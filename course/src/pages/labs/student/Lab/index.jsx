import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Radio,
  Select,
  Statistic,
  Tooltip,
  Table,
  Tabs,
  Tag,
  PageHeader,
  Typography,
  notification,
  message,
} from 'antd'
import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined } from '@ant-design/icons'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import { useMount } from 'react-use'
import { connect, useParams, useRouteMatch, useLocation, Link, history } from 'umi'
import styles from './style.less'
import axios from 'axios'
import { getAuthority } from '@/utils/authority'

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography
const { Countdown } = Statistic
const PORT = SERVER_PORT

const FormatData = (courseCaseId, fileUpload, courseId) => {
  const formattedLab = {
    courseCaseId,
    submissionFileName: 'student submit fake token',
    courseId,
  }
  return formattedLab
}

const LabCase = ({ lab, user, Course }) => ({
  isSuccess: lab.isSuccess,
  labData: lab.labCaseList,
  currentUser: user.currentUser,
  courseId: Course.currentCourseInfo.courseId,
})

const Lab = ({ props, labData = {}, currentUser = [], courseId, dispatch = () => {} }) => {
  const params = useParams()
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
  const [uploadFile, setUploadFile] = useState()

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 16,
      },
    },
  }
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 0,
        offset: 10,
      },
    },
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '操作',
      key: 'fileAction',
      dataIndex: 'fileAction',
      render: (text, record) => (
        <span>
          <a
            style={{
              marginRight: 16,
            }}
            href= {text}
          >
            下载
          </a>
        </span>
      ),
    },
  ]
  const data = [
    {
      key: '1',
      fileName: '实验说明书',
      fileAction: labData.CASE_FILE_DOWNLOAD_URL,
    },
    {
      key: '2',
      fileName: '参考答案',
      fileAction: labData.ANSWER_FILE_DOWNLOAD_URL,
    }
  ]

  const uploadReport = (val) => {
    return axios.post(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
      courseId,
      courseCaseId: params.courseCaseId,
      submissionUploader: currentUser.id,
      submissionFileName: val.fileUpload.file.name,
    })
  }

  const modifyReport = (val) => {
    return axios.put(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
      courseId,
      courseCaseId: params.courseCaseId,
      submissionUploader: currentUser.id,
      submissionFileName: val.fileUpload.file.name,
    })
  }

  const onFinish = (val) => {
    console.log(courseId)
    console.log(params.courseCaseId)
    console.log(uploadFile)
    axios
      .post(`http://localhost:${PORT}/api/v1/experiment/assignments/student/list/`, {
        courseId,
        courseCaseId: params.courseCaseId,
        submissionFileName: uploadFile.name,
      })
      .then((res) => {
        const firstResponse = res.data.data
        const putUrl = firstResponse.SUBMISSION_UPLOAD_URL
        console.log(putUrl)
        axios({
          method: 'put',
          url: putUrl,
          data: uploadFile,
          headers: { 'Content-Type': `application/octet-stream` },
        }).then((res) => {
          notification.success({
            message: '上传成功!',
          })
          history.push('/labs/list')
        })
      })
      .catch((res) => {
        notification.error({
          message: res,
        })
      })
  }

  const onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues) => {
    const { publicType } = changedValues
    if (publicType) setShowPublicUsers(publicType === '2')
  }

  const getDdl = () => {
    const t = labData.caseEndTimestamp
    if(t == null || t == undefined){
      return ''
    }
    const date = t.split('T')[0]
    const m = t.split('T')[1].split('+')[0]
    return date + " " + m
  }

  useMount(() => {
    console.log(params)
    console.log(params.courseCaseId)

    dispatch({
      type: 'lab/fetchLabCase',
      payload: params.courseCaseId,
      onError: (err) => {
        notification.error({
          message: '获取实验详情失败',
          description: err.message,
        })
      },
    }).then(console.log(`labData`), console.log(labData))
  })

  return (
    <PageContainer title={false}>
      <Card bordered={false}>
        <Countdown
          title='倒计时'
          style={{ position: 'flxed', float: 'right' }}
          value={Date.parse(labData.caseEndTimestamp)}
          onFinish={onFinish}
        />
        <div style={{ textAlign: 'center', width: '80%', paddingLeft: '12%', margin: '20px' }}>
          <h2>{labData.experimentName}</h2>
          <h3>{labData.experimentCaseName}</h3>
          <Paragraph>{labData.experimentCaseDescription}</Paragraph>
          <div>
            <Tag icon={<ClockCircleOutlined />}>截止时间：{getDdl()}</Tag>
            <Button
              key='back'
              type='link'
              icon={<RollbackOutlined />}
              onClick={() => window.history.back()}
            >
              返回
            </Button>
          </div>
        </div>

        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name='basic'
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem {...formItemLayout} label='下载附件' name='fileUpload'>
            <Table 
              pagination={false} 
              columns={columns} 
              dataSource={getAuthority()[0] != "student" ? data: [data[0]]} 
            />
          </FormItem>
          <FormItem>
            <ProFormUploadDragger
              {...formItemLayout}
              max={4}
              label='提交报告'
              name='fileUpload'
              disabled={
                Date.now() < Date.parse(labData.caseStartTimestamp) ||
                Date.now() > Date.parse(labData.caseEndTimestamp) ||
                labData.isSubmit ||
                getAuthority()[0] != "student"
              }
              maxCount={1}
              multiple={false}
              action={(v) => setUploadFile(v)}
            />
          </FormItem>

          {labData.isPublicScore ? (
            <FormItem {...formItemLayout} label='实验得分' name='labScore'>
              <Statistic value={5} suffix='/ 100' />
            </FormItem>
          ) : null}

          {labData.isPublicScore ? (
            <FormItem {...formItemLayout} label='教师评语' name='submissionComments'>
              <TextArea
                style={{
                  minHeight: 32,
                }}
                rows={4}
                readOnly='readOnly'
                defaultValue={'comment'}
              />
            </FormItem>
          ) : null}

          {/*
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          > */}
          {Date.now() > Date.parse(labData.caseStartTimestamp) &&
          Date.now() < Date.parse(labData.caseEndTimestamp) &&
          !labData.isSubmit ? (
            <Button
              style={{
                marginLeft: 16,
              }}
              type='primary'
              htmlType='submit'
              // loading={submitting}
              disabled = { getAuthority()[0] != "student" }
            >
              提交作业
            </Button>
          ) : (
            <p>本实验尚未开始进行或您已提交过实验报告</p>
          )}

          {/* </FormIm> */}
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(LabCase)(Lab)
