import React, { useState, useRef, useCallback } from 'react'
import { useMount } from 'react-use'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { StepsForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import { Button, Divider, Drawer, message, Form, DatePicker, Input, TimePicker } from 'antd'
import CreateForm from './components/CreateForm'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'umi'
import onError from '@/utils/onError'

const { RangePicker } = DatePicker

const mapStateToProps = ({ Course }) => ({
  courseTeachList: Course.courseTeachList,
})

const course_list = ({ courseTeachList = [], dispatch = () => {} }) => {
  const [createModalVisible, handleModalVisible] = useState(false)
  const actionRef = useRef()
  const [row, setRow] = useState()
  const [selectedRowsState, setSelectedRows] = useState([])

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseID',
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
    },
    {
      title: '教师ID',
      dataIndex: 'teacherID',
      formItemProps: { rules: [{ required: true, message: '教师ID是必须项' }] },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              deleteCourseTeach(record.courseTeachId)
            }}
          >
            {' '}
            删除{' '}
          </a>
        </>
      ),
    },
  ]

  useMount(() => {
    console.log('准备接受数据')
    dispatch({
      type: 'Course/getAllCourseTeach', //这里需要修改
      onError,
    })
  })

  /**
   * 格式化课程绑定数据
   * @param courseTeachList
   */
  const FormatData = (courseTeachList) => {
    const formattedCourseTeachList = []
    for (let i = 0; i < courseTeachList.length; i++) {
      formattedCourseTeachList.push({
        key: i,
        courseID: courseTeachList[i].courseId,
        teacherID: courseTeachList[i].teacherId,
        courseTeachId: courseTeachList[i].courseTeachId,
      })
    }
    return formattedCourseTeachList
  }

  /**
   * 添加课程绑定信息
   * @param values
   */
  const addCourseTeachInfo = useCallback(
    (values) => {
      // console.log(values)
      dispatch({
        type: 'Course/createNewCourseTeach',
        payload: values,
        onError,
        onFinish: () => {
          message.success('创建课程成功')
          console.log(courseTeachList)
        },
      })
    },
    [dispatch],
  )

  /**
   *
   */
  const deleteCourseTeach = useCallback((value) => {
    dispatch({
      type: 'Course/deleteCourseTeach',
      payload: value,
      onError,
      onFinish: () => {
        message.success('删除课程绑定成功')
      },
    })
  }, [])

  return (
    <PageContainer>
      <ProTable
        headerTitle='所有课程'
        actionRef={actionRef}
        rowKey='key'
        search={false}
        toolBarRender={() => [
          <Button key='primary' type='primary' onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={FormatData(courseTeachList)}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState)
              setSelectedRows([])
              actionRef.current?.reloadAndRest?.()
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProCard>
          <Form
            onFinish={async (values) => {
              // console.log(values)
              addCourseTeachInfo(values)
              handleModalVisible(false)
            }}
          >
            <FormItem label='课程ID' name='courseID' rules={[{ required: true }]}>
              <Input placeholder='请输入课程ID' />
            </FormItem>
            <FormItem label='教师ID' name='teacherID' rules={[{ required: true }]}>
              <Input placeholder='请输入想要与之绑定的教师ID' />
            </FormItem>
            <FormItem style={{ marginTop: 32 }}>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
            </FormItem>
          </Form>
        </ProCard>
      </CreateForm>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(course_list)
