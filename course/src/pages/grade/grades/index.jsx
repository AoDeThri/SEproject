import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useMount } from 'react-use'
import ProTable from '@ant-design/pro-table'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { Button, message, Form, DatePicker, Input, InputNumber, Popconfirm, Select } from 'antd'
import { connect } from 'umi'

const mapStateToProps = ({ Grade, Course }) => ({
    gradesList: Grade.gradesList,
    courseId: Course.currentCourseInfo.courseId
})

const grades = ({courseId = -1, gradesList = [], dispatch = () => {}}) =>{
  const actionRef = useRef()

  const fetchAllGrades = () =>{
    dispatch({
      type: 'Grade/fetchAllGrades',
      payload: courseId,
      errorHandler: (e) => {
          message.error('获取课程分数列表失败')
        },
      successHandler: () => {
        message.success('成功获取课程分数列表')
      },
    })
  }

  useMount(() => {
    fetchAllGrades()
    console.log(gradesList.map((t, i) => ({ ...t, key: i })))
  })


  const columns = [
    {
      title: '学生ID',
      dataIndex: 'studentId',
      formItemProps: { rules: [{ required: true, message: '学生ID是必须项' }] },
      key: 'studentId',
      sorter: (a,b) => a.studentId - b.studentId,
    },
    {
      title: '作业得分',
      dataIndex: 'assignmentPoint',
      key: 'assignmentPoint',
      sorter: (a,b) => a.assignmentPoint - b.assignmentPoint,
    },
    {
      title: '期中考试得分',
      dataIndex: 'exam1Point',
      key: 'exam1Point',
      sorter: (a,b) => a.exam1Point - b.exam1Point,
    },
    {
      title: '期末考试得分',
      dataIndex: 'exam2Point',
      key: 'exam2Point',
      sorter: (a,b) => a.exam2Point - b.exam2Point,
    },
    {
      title: '实验得分',
      dataIndex: 'experimentPoint',
      key: 'experimentPoint',
      sorter: (a,b) => a.experimentPoint - b.experimentPoint,
    },
    {
      title: '对抗练习得分',
      dataIndex: 'contestPoint',
      key: 'contestPoint',
      sorter: (a,b) => a.contestPoint - b.contestPoint,
    },
    {
      title: '出勤得分',
      dataIndex: 'attendancePoint',
      key: 'attendancePoint',
      sorter: (a,b) => a.attendancePoint - b.attendancePoint,
    },
    {
      title: '总得分',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      sorter: (a,b) => a.totalPoint - b.totalPoint,
    }
  ];

  return(
    <PageContainer>
      <ProTable
      headerTitle='课程分数总览'
      actionRef={actionRef}
      rowKey='key'
      search={false}
      columns={columns}
      dataSource={gradesList.map((t, i) => ({ ...t, key: i }))}
      >
      </ProTable>
    </PageContainer>
  )
}


export default connect(mapStateToProps)(grades)