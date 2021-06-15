import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useMount } from 'react-use'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import { Pie } from '@ant-design/charts';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { Button, message, Form, DatePicker, Input, InputNumber, Popconfirm, Select } from 'antd'
import CreateForm from './components/CreateForm'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'umi'

const mapStateToProps = ({ Grade, Course }) => ({
    gradeWeight: Grade.gradeWeights,
    courseId: Course.currentCourseInfo.courseId
})

const grade_weight = ({courseId = -1, gradeWeight = {}, dispatch = () => {}}) =>{
  const [createModalVisible, handleModalVisible] = useState(false)
  const actionRef = useRef()

  const fetchGradeWeight = () =>{
    dispatch({
      type: 'Grade/fetchGradeWeight',
      payload: courseId,
      errorHandler: (e) => {
          message.error('获取课程分数权重失败')
        },
      successHandler: () => {
        message.success('成功获取课程分数权重')
      },
    })
  }

  useMount(() => {
    fetchGradeWeight()
  })

  const updateGradeWeight = (values) =>{
    dispatch({
      type: 'Grade/modifyGradeWeight',
      payload:{
        courseId: courseId,
        values
      },
      errorHandler: (e) => {
        message.error('更新课程分数权重失败')
      },
      successHandler: () => {
        message.success('成功更新课程分数权重')
      },
    }).then((res) => {
      fetchGradeWeight()
      console.log(gradeWeight)
    })
  }

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
      key: 'courseId'
    },
    {
      title: '作业权重',
      dataIndex: 'assignment',
      key: 'assignment',
    },
    {
      title: '期中考试权重',
      dataIndex: 'exam1',
      key: 'exam1',
    },
    {
      title: '期末考试权重',
      dataIndex: 'exam2',
      key: 'exam2',
    },
    {
      title: '实验权重',
      dataIndex: 'experiment',
      key: 'experiment',
    },
    {
      title: '对抗练习权重',
      dataIndex: 'contest',
      key: 'contest',
    },
    {
      title: '出勤权重',
      dataIndex: 'attendance',
      key: 'attendance',
    },
  ];

  const pieConfig = {
    appendPadding: 5,
    data: (() => {
      let a = []
      for (const key in gradeWeight){
        const value = Number(gradeWeight[key])
        if (value === 0){
          continue
        }
        a.push({type: key, value: value})
      }
      console.log('piedata')
      console.log(a)
      return a
    })(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  }

  return(
    <PageContainer>
      <ProTable
      headerTitle='课程分数权重'
      actionRef={actionRef}
      rowKey='key'
      search={false}
      toolBarRender={() => [
        <Button key='primary' type='primary' onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 修改
        </Button>,
      ]}
      columns={columns}
      dataSource={[{
        key:'1',
        courseId,
        ...gradeWeight
      },]
      }

      >
          
      </ProTable>

      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProCard>
          <Form
            onFinish={(values) => {
              updateGradeWeight(values)
              handleModalVisible(false)
            }}
            initialValues={{
              assignment: "20",
              exam1:"10",
              exam2:"30",
              experiment:"10",
              contest:"10",
              attendance:"20"
            }}
          >
            <FormItem label='作业权重' name='assignment' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>
            <FormItem label='期中考试权重' name='exam1' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>
            <FormItem label='期末考试权重' name='exam2' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>
            <FormItem label='实验权重' name='experiment' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>
            <FormItem label='对抗练习权重' name='contest' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>
            <FormItem label='出勤权重' name='attendance' rules={[{ required: true }]}>
            <InputNumber
              min="0"
              max="100"
              step="1"
            />
            </FormItem>

            <FormItem style={{ marginTop: 32 }}>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
            </FormItem>
          </Form>
        </ProCard>
      </CreateForm>

      <Pie {...pieConfig} />

    </PageContainer>
  )
}


export default connect(mapStateToProps)(grade_weight)