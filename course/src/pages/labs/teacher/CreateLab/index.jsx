import { InfoCircleOutlined } from '@ant-design/icons'
import {
  Upload,
  Tag,
  notification,
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Modal,
} from 'antd'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { connect, history } from 'umi'
import { useMount } from 'react-use'
import styles from './style.less'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { UploadOutlined } from '@ant-design/icons'
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const PORT = SERVER_PORT
const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input
const { confirm } = Modal

const FormatData = (labCase) => {
  const formattedLab = {
    experimentName: labCase.expName,
    experimentCaseName: labCase.caseName,
    experimentCaseDescription: labCase.caseDesc,
    // FIXME: lack of experiment_case_file_name and answer_file_name
    experimentCaseFileName: 'eF1',
    answerFileName: 'aF1',
    experimentCaseFileToken: 'fake file token',
    answerFileToken: 'fake file token',
  }
  return formattedLab
}

const CreateLab = (props) => {
  const { submitting } = props
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
  const [uploadCaseFile, setUploadCaseFile] = React.useState()
  const [uploadAnswerFile, setUploadAnswerFile] = React.useState()
  // const [caseFileName, setCaseFileName] = React.useState()
  // const [answerFileName, setAnswerFileName] = React.useState()

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

  const doUploadAnswerFile = (putUrl) => {
    return axios({
      method: 'put',
      url: putUrl,
      data: uploadAnswerFile,
      headers: { 'Content-Type': `application/octet-stream` },
    })
  }

  const doUploadCaseFile = (putUrl) => {
    return axios({
      method: 'put',
      url: putUrl,
      data: uploadCaseFile,
      headers: { 'Content-Type': `application/octet-stream` },
    })
  }

  const onFinish = (labCase) => {
    console.log(labCase)
    axios
      .post(`http://localhost:${PORT}/api/v1/experiment/experiment-database/list/`, {
        experimentName: labCase.expName,
        experimentCaseName: labCase.caseName,
        experimentCaseDescription: labCase.caseDesc,
        experimentCaseFileName: labCase.caseFile.file.name,
        answerFileName: labCase.answerFile.file.name,
      })
      .then((res) => {
        const firstResponse = res.data.data
        console.log(firstResponse)
        const casePutUrl = firstResponse.CASE_FILE_UPLOAD_URL
        const answerPutUrl = firstResponse.ANSWER_FILE_UPLOAD_URL
        console.log(casePutUrl)
        console.log(answerPutUrl)
        axios
          .all([doUploadCaseFile(casePutUrl), doUploadAnswerFile(answerPutUrl)])
          .then(
            axios.spread((...responses) => {
              notification.success({
                message: '????????????!',
              })
              history.push('/labs/all')
            }),
          )
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

  function showPromiseConfirm() {
    confirm({
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }
  return (
    <PageContainer title={false}>
      <Card title='????????????' bordered={false}>
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
          <FormItem
            {...formItemLayout}
            label='????????????'
            name='expName'
            rules={[
              {
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <Input placeholder='?????????????????????' />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='????????????'
            name='caseName'
            rules={[
              {
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <Input placeholder='?????????????????????' />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                ????????????
                <br />
                <em className={styles.optional}>????????????</em>
              </span>
            }
            name='caseDesc'
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder='?????????????????????'
              rows={3}
            />
          </FormItem>

          <Form.Item
            name='caseFile'
            style={{
              marginLeft: '16px',
            }}
          >
            <Upload
              multiple={false}
              maxCount={1}
              showUploadList={{
                showDownloadIcon: true,
              }}
              action={(v) => setUploadCaseFile(v)}
            >
              <Button icon={<UploadOutlined />}>????????????????????????</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name='answerFile'
            style={{
              marginLeft: '16px',
            }}
          >
            <Upload
              multiple={false}
              maxCount={1}
              showUploadList={{
                showDownloadIcon: true,
              }}
              action={(v) => setUploadAnswerFile(v)}
            >
              <Button icon={<UploadOutlined />}>????????????????????????</Button>
            </Upload>
          </Form.Item>

          <Button
            style={{
              marginLeft: 16,
            }}
            type='primary'
            htmlType='submit'
          >
            ????????????
          </Button>

          {/* </FormItem> */}
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(null)(CreateLab)
