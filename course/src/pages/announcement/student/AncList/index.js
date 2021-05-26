import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Modal, Space, Select } from 'antd'
import formatTime from '@/utils/formatTime'
import {connect} from 'umi'
import {Link} from 'react-router-dom'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const mapStateToProps = ({ announcement, Course }) => ({
  ancList: announcement.ancList,
  courseId: Course.currentCourseInfo.courseId,
  courseList: Course.courseList
})

const FormatData = (ancList) => {
  const formattedAncList = []
  for (let i = 0; i < ancList.length; i++) {
    formattedAncList.push({
      key: ancList[i].announcementId,
      title: ancList[i].announcementTitle,
      des: ancList[i].announcementContents,
      isPinned: ancList[i].announcementIsPinned,
      createTime: formatTime(ancList[i].announcementPublishTime),
      updateTime: formatTime(ancList[i].announcementLastUpdateTime),
      creator: ancList[i].announcementSenderId,
    })
  }
  return formattedAncList
}

const AncList = ({
  ancList = [],
  dispatch = () => { },
  courseId = courseId,
  courseList = []
}) => {
  const [loading, setLoading] = useState(true)
  const [announcementId, setAnnouncementId ] = useState()
  const [ modalVisible, setModalVisible ] = useState(false)
  const ref = useRef()

  //获得当前公告列表
  const getAncList = (value) => {
    dispatch({
      type: 'announcement/fetchAncList',
      payload: {
        courseId: value,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //删除某公告
  const deleteAncInfo = () => {
    dispatch({
      type: 'announcement/deleteAncInfo',
      payload: {
        courseId, announcementId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    if(courseId != -1){
      getAncList(courseId)
    }
    //console.log(hwList)
  })

  const setCurrentCourse = (index) => (
    dispatch({
      type: 'Course/getCurrentCourseInfoStudent',
      payload: {
        courseId: index,
      },
      onError,
    })
  )
  
  const handleSelectOnChange = (value) => {
    setCurrentCourse(value)
    getAncList(value)
  }
  
  const columns = [
    {
      title: '公告名称',
      dataIndex: 'title',
      width: '20%',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '公告内容',
      dataIndex: 'des',
      width: '30%',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: '15%',
    },
    {
      title: '修改日期',
      dataIndex: 'updateTime',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <>
          <Link to={`/announcement/anc-list/anc-info/${record.key}`}>详情&nbsp;&nbsp;&nbsp;&nbsp;</Link>
        </>
      )
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='公告列表'
        // actionRef={ref}
        search={false}
        dataSource={FormatData(ancList)}
        columns={columns}
        toolBarRender={() => [
          <Select
            placeholder="请选择课程"
            onChange={(value) => handleSelectOnChange(value)}
            defaultValue={courseId == -1 ? undefined: courseId}
          >
            {
              courseList.map((i) => (
                <Option value={i.courseId} >{i.courseName}</Option>
              ))
            }
          </Select>
        ]}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(AncList)