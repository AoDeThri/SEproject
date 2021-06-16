import { InfoCircleOutlined } from '@ant-design/icons'
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
} from 'antd'
import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined } from '@ant-design/icons'
import { connect, history, useParams } from 'umi'
import { useMount } from 'react-use'
import React, { useEffect } from 'react'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
// import PDFViewer from './PDFViewer'
import styles from './style.less'

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography

const FormatData = (params, labData, form) => {
  // const formattedLab = []
  const formattedLab = {
    courseCaseId: Number(params.courseCaseId),
    submissionUploader: labData.submissionUploader,
    submissionFileToken: labData.submissionFileToken,
    submissionTimestamp: labData.submissionTimestamp,
    submissionScore: form.score,
    submissionComments: form.comments,
    submissionIsPublic: false,
    submissionCaseId: Number(params.submissionCaseId)
  }
  return formattedLab
}

const LabCase = ({ lab }) => ({
  isSuccess: lab.isSuccess,
  labData: lab.labCaseList,
  submissionData: lab.labSubmissionDetail,
})

const MarkLab = ({ props, labData = [], submissionData = {}, dispatch = () => {} }) => {
  const params = useParams()
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 5,
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
      title: '日期',
      dataIndex: 'fileDate',
      key: 'fileDate',
    },
    {
      title: '操作',
      key: 'fileAction',
      render: (text, record) => (
        <span>
          <a
            style={{
              marginRight: 16,
            }}
            href={submissionData.ASSIGNMENT_DOWNLOAD_URL}
          >
            下载
          </a>
        </span>
      ),
    },
  ]

  useEffect(() => {
  }, [submissionData])

  const onFinish = (form) => {
    const data = FormatData(params, labData, form)
    dispatch({
      type: 'lab/markSubmission',
      payload: data,
      onError: (err) => {
        notification.error({
          message: '批改学生实验作业失败',
          description: err.message,
        })
      },
      onSuccess: () =>{
        history.push({
          pathname: `/labs/pending-list/${params.courseCaseId}`
        })
      }
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

  useMount(() => {
    dispatch({
      type: 'lab/fetchSubmission',
      payload: params.submissionCaseId,
      onError: (err) => {
        notification.error({
          message: '获取学生实验作业失败',
          description: err.message,
        })
      },
    })
    
  })  

  const fileSubmitDate = () => {
    const t = submissionData.submissionTimestamp
    if(t == null || t == undefined){
      return ''
    }
    const date = t.split('T')[0]
    const m = t.split('T')[1].split('.')[0]
    return date + " " + m
  }

  const data = [
    {
      key: '1',
      fileName: '学生作业',
      fileDate: fileSubmitDate(),
    },
  ]

  return (
    <PageContainer title={false}>
      <Card bordered={false}>
        <div style={{textAlign:'center', width:'80%', paddingLeft:'12%',margin:'20px'}}>
          <h2>{labData.experimentName}</h2>
          <h3>{labData.experimentCaseName}</h3>
          <Paragraph>{labData.experimentCaseDescription}</Paragraph>
          <div>
            <Tag icon={<UserOutlined />}>
              {labData.submissionUploader}  张三
            </Tag>
            <Button key='back' type='link' icon={<RollbackOutlined />} onClick={() => window.history.back()}>
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
          initialValues={{
            score: '0',
            comments: ''
          }}
          initialValues = {{
            score: submissionData.submissionScore,
            comments: submissionData.submissionComments,
          }}
        >
          <FormItem {...formItemLayout} label='下载实验报告' name='labSubmitFile'>
            <Table pagination={false} columns={columns} dataSource={data} />
          </FormItem>
          <FormItem {...formItemLayout} name='score' initialValue='100'
            label={
              <span>
                学生成绩
                <em className={styles.optional}>/100</em>
              </span>
            }
          >
            <InputNumber min={0} max={100} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                评语
                <em className={styles.optional}>（选填）</em>
              </span>
            }
            name='comments'
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder=''
              rows={4}
            />
          </FormItem>
            <Button
              type='primary'
              htmlType='submit'
            >
              确认批改
            </Button>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(LabCase)(MarkLab)