import React, { Component } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import { Link, history } from 'umi'
import styles from './index.less'
import { userAccountLogin } from '@/services/login'
import { getPageQuery } from '@/utils/utils'
import { setAuthority, AUTHORITY_LIST, getAuthority } from '@/utils/authority'
import onError from '@/utils/onError'

const namespace = 'login'

const mapStateToProps = (state) => {
  const _ = state[namespace]
  return {}
}

const mapDispatchToProps = () => {
  const authorityRedirect = () => {
    const currentUserAuthority = getAuthority()[0]
    switch (currentUserAuthority) {
      case 'student':
        history.replace('/course/course-info')
        break
      case 'principal':
        history.replace('/course/course-list')
        break
      case 'teacher':
      case 'teachingAssistant':
        history.replace('/course/course-list-teacher')
        break
      default:
        break
    }
  }

  return {
    onFinish: (values) => {
      // eslint-disable-next-line no-console
      console.log('Received values of form: ', values)
      userAccountLogin(values).then((r) => {
        if (r.isSuccess) {
          const urlParams = new URL(window.location.href)
          const params = getPageQuery()
          let { redirect } = params

          if (redirect) {
            const redirectUrlParams = new URL(redirect)

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length)

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1)
              }
            } else {
              window.location.href = '/'
              return
            }
          }
          console.log(redirect || '/')

          console.log(r)
          if (r.isSuccess) {
            setAuthority(AUTHORITY_LIST[Number(r.data.character) - 1])
            console.log(`current authority is :${AUTHORITY_LIST[Number(r.data.character) - 1]}`)
          }

          history.replace(redirect || '/')
          authorityRedirect()
          // return { ...state, status: payload.status, type: payload.type }
        } else {
          const errorText = r.error.message
          notification.error({
            message: `????????????`,
            description: errorText,
          })
        }
      })
      // dispatch({
      //   type: `${namespace}/login`,
      //   payload: { ...values },
      //   onError: (err) => {
      //     console.log(err)
      //   }
      // })
    },
  }
}

const NormalLoginForm = (props) => {
  return (
    <div className={styles.main}>
      <h3>??????</h3>
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{
          remember: true,
        }}
        onFinish={props.onFinish}
      >
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
          ]}
        >
          <Input
            size='large'
            placeholder='?????????'
            prefix={<UserOutlined className='site-form-item-icon' />}
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: '??????????????????',
            },
          ]}
        >
          <Input
            size='large'
            placeholder='??????'
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
          />
        </Form.Item>

        <Form.Item>
          <Button size='large' type='primary' htmlType='submit' className={styles.submit}>
            ??????
          </Button>
          {/* Or{' '} */}
          <Link className={styles.login} to='/user/register'>
            ?????????????????????
          </Link>
          <Link className={styles.reset} to='/user/retrievepassword'>
            ?????????????
          </Link>
        </Form.Item>
      </Form>
    </div>
  )
}

@connect(mapStateToProps, mapDispatchToProps)
class LoginForm extends Component {
  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <div>
        <div id='components-form-demo-normal-login'>
          <NormalLoginForm onFinish={this.props.onFinish} />
        </div>
      </div>
    )
  }
}

export default LoginForm
