import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useMount } from 'react-use'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'
import { Column } from '@ant-design/charts';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import { Button, message, Form, DatePicker, Input, InputNumber, Popconfirm, Select } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import { connect } from 'umi'
import onError from '@/utils/onError'

const mapStateToProps = ({ Grade, Course, user }) => ({
  grades: Grade.grades,
  courseId: Course.currentCourseInfo.courseId,
  userId: user.currentUser.id
})

const my_grades = ({courseId = -1, grades = {}, userId = -1, dispatch = () => {}}) =>{

  const fetchMyGrades = () =>{
    dispatch({
      type: 'Grade/fetchOneGrades',
      payload: {courseId, userId},
      errorHandler: (e) => {
          message.error('获取课程分数失败')
        },
      successHandler: () => {
        message.success('成功获取课程分数')
      },
    })
  }

  useMount(() => {
    fetchMyGrades()
  })

  var config = {
    data: (() => {
      let a = []
      for (const key in grades){
        const value = Number(grades[key])
        if (value === 0){
          continue
        }
        a.push({type: key, value: value})
      }
      return a
    })(),
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      min: 0,
      max: 100
    },
    meta: {
      type: { alias: '类别' },
      value: { alias: '得分' },
    },
  };

  return(
    <PageContainer>
        <Column {...config} />
    </PageContainer>
  )
}


export default connect(mapStateToProps)(my_grades)