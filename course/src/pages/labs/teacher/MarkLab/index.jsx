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
} from 'antd'
import { ClockCircleOutlined, UserOutlined, EditTwoTone, RollbackOutlined } from '@ant-design/icons'
import { connect, FormattedMessage, formatMessage } from 'umi'
import React from 'react'
import ProForm, { ProFormUploadDragger } from '@ant-design/pro-form'
import { PageContainer } from '@ant-design/pro-layout'
import PDFViewer from './PDFViewer'
import styles from './style.less'

const FormItem = Form.Item
const { TextArea } = Input
const { Paragraph } = Typography

const MarkLab = (props) => {
  const { submitting } = props
  const [form] = Form.useForm()
  const [showPublicUsers, setShowPublicUsers] = React.useState(false)
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: '日期',
      dataIndex: 'fileDate',
      key: 'fileDate',
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
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
          >
            下载
          </a>
        </span>
      ),
    },
  ]
  const desc = "这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述这是一段实验描述"
 
  const data = [
    {
      key: '1',
      fileName: '实验说明书.jpg',
      fileDate: '2020-5-7',
      fileSize: '167 KB',
    },
  ]
  const onFinish = (values) => {
    const { dispatch } = props
    dispatch({
      type: 'labsAndMarkLab/submitRegularForm',
      payload: values,
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
  return (
    <PageContainer>
      <Card bordered={false}>
        <div style={{textAlign:'center', width:'80%', paddingLeft:'12%',margin:'20px'}}>
          <h2>实验1</h2>
          <Paragraph>{desc}</Paragraph>
          <div>
            <Tag icon={<UserOutlined />}>1923456李华</Tag>
            <Button key='edit' type='link' icon={<EditTwoTone />}>
              编辑
            </Button>
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
        >
          {/*
          <FormItem {...formItemLayout} name='pdf'>
            <PDFViewer />
          </FormItem>
          */}
          <FormItem {...formItemLayout} label='下载附件' name='goal'>
            <Table pagination={false} columns={columns} dataSource={data} />
          </FormItem>
          <FormItem {...formItemLayout} label='学生成绩' name='labScore'>
            <InputNumber placeholder=' ' min={0} max={100} />
            <span className='ant-form-text'>/ 100</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                评语
                <em className={styles.optional}>（选填）</em>
              </span>
            }
            name='labReview'
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder=''
              rows={4}
            />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 48,
            }}
          >
            <Button
              type='primary'
              htmlType='submit'
              loading={submitting}
            >
              确认
            </Button>
            <Button
              style={{
                marginLeft: 16,
              }}
            >
              下一份
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default connect(({ loading }) => ({
  submitting: loading.effects['labsAndMarkLab/submitRegularForm'],
}))(MarkLab)
