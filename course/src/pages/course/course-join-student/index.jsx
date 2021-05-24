import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PageContainer } from '@ant-design/pro-layout'
import { Popconfirm } from 'antd'
import { connect } from 'umi'

const CourseList = ({ courseList = {} }) => {
  const [selectedRows, setSelectedRows] = useState([]) \
  
  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      hideInForm: true,
      fixed: 'left',
      width: 100,
      formItemProps: { rules: [{ required: true, message: '课程ID是必须项' }] },
      sorter: (a, b) => a.courseId - b.courseId,
      sortOrder: 'ascend',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      fixed: 'left',
      width: 150,
      formItemProps: { rules: [{ required: true }] },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setRow(entity)
            }}
          >
            {dom}
          </a>
        )
      },
    },
    {
      title: '课程学分',
      dataIndex: 'courseCredit',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
      sorter: (a, b) => a.courseCredit - b.courseCredit,
    },
    {
      title: '课程学时',
      dataIndex: 'courseStudyTimeNeeded',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
      sorter: (a, b) => a.courseStudyTimeNeeded - b.courseStudyTimeNeeded,
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      width: 100,
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '课程描述',
      dataIndex: 'courseDescription',
      valueType: 'textarea',
      ellipsis: true,
      width: 250,
      formItemProps: { rules: [{ required: true, max: 50 }] },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setCurrentCourse(record.key)
            }}
          >
            编辑
          </a>
          <Divider type='vertical' />
          <Popconfirm
            title='确定加入课程？'
            onConfirm={() => {
              removeCourseInfo(record.courseId)
            }}
            onCancel={() => {}}
            okText='确定'
            cancelText='取消'
          >
            <a href='#'>加入</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='AllCourses'
        rowKey='key'
        search={true}
        toolBarRender={() => {
          return [
            selectedRowsState?.length > 0 && (
              <Button
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
                  onClick={() => {
                    // handleRemove(selectedRowsState)
                    setSelectedRows([])
                    actionRef.current?.reloadAndRest?.()
                  }}
                >
                  批量删除
                </Button>
              </Button>
            )
          ]
        }}
        dataSource={courseList.map((c, i) => ({
          ...c,
          key: i,
          courseIsScorePublic: c.courseIsScorePublic ? '公开' : '不公开',
        }))}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
    </PageContainer>
  )
}

export default connect(({ Course }) => ({ courseList: Course.courseList }))(CourseList)
