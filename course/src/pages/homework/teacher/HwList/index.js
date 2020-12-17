import React from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Tag, Space} from 'antd'
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Column } = Table;

const onSearch = value => console.log(value);

const columns = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: '发布者',
        dataIndex: 'owner',
        key: 'owner',
    },
    {
        title: '操作',
        dataIndex: 'opr',
        key: 'opr',
        render: () => (
            <Space size="middle">
              <a>查看详情</a>
              <a>编辑</a>
              <a>删除</a>
            </Space>
        ),
    },
];

const data = [
    {
      key: '1',
      title: '第一次作业',
      content: '给妈妈洗脚并写一篇心得',
      date: '2020.11.24',
      owner: 'Dri',
    },
    {
      key: '1',
      title: '第二次作业',
      content: '给爸爸洗脚并写一篇心得',
      date: '2020.11.24',
      owner: 'Dri',
    },
    {
        key: '1',
        title: '第三次作业',
        content: '给爷爷洗脚并写一篇心得',
        date: '2020.11.24',
        owner: 'Dri',
    },
    {
        key: '1',
        title: '第四次作业',
        content: '给奶奶洗脚并写一篇心得',
        date: '2020.11.24',
        owner: 'Dri',
    },
    {
        key: '1',
        title: '第五次作业',
        content: '给自己洗脚并写一篇心得',
        date: '2020.11.24',
        owner: 'Dri',
    },
];

const Bread = () => {
return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <div style={{paddingTop: '20px', marginLeft: '126px', width: '30%'}}>
            <Search placeholder="" 
                    onSearch={onSearch} 
                    enterButton
                    block='false' />
              
        </div>
        <div style={{paddingTop: '20px', width: '100%', textAlign: 'center'}}>
          <Button type="dashed" style={{width: '80%'}}>
             + 添加
          </Button>
        </div> 
        <div style={{width: '100%', textAlign: 'center'}}>
          <Table dataSource={data} columns={columns}
                 style={{width: '80%', margin: 'auto'}}>
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}

export default Bread