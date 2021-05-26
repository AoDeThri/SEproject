import React from 'react'
import { Modal } from 'antd'

const CreateForm = (props) => {
  const { modalVisible, onCancel } = props
  return (
    <Modal
      destroyOnClose
      title='新建选课'
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  )
}

export default CreateForm
