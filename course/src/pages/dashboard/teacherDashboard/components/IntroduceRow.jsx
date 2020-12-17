import { InfoCircleOutlined } from '@ant-design/icons'
import { Col, Row, Tooltip } from 'antd'
import { FormattedMessage } from 'umi'
import React from 'react'
import numeral from 'numeral'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts'
import Trend from './Trend'
import Yuan from '../utils/Yuan'
import styles from '../style.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
}

const IntroduceRow = ({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='平均分'
        action={
          <Tooltip title='班级成绩的平均分以及分布情况'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total='87.3'
        footer={<Field label='及格率' value='97.2%' />}
        contentHeight={46}
      >
        <MiniArea color='#975FE4' data={visitData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='选课人数'
        action={
          <Tooltip title='本节课程选课人数'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => '65人'}
        footer={<Field label='平均学习时长' value='23小时 12分钟' />}
        contentHeight={46}
      >
        {/* <Trend
          flag='up'
          style={{
            marginRight: 16,
          }}
        >
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag='down'>
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend> */}
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='选课人数'
        action={
          <Tooltip title='本节课程选课人数'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => '65人'}
        footer={<Field label='平均学习时长' value='23小时 12分钟' />}
        contentHeight={46}
      >
        {/* <Trend
          flag='up'
          style={{
            marginRight: 16,
          }}
        >
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag='down'>
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend> */}
      </ChartCard>
    </Col>

    {/* <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='支付笔数'
        action={
          <Tooltip title='指标说明'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={<Field label='转化率' value='60%' />}
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col> */}
    {/* <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title='运营活动效果'
        action={
          <Tooltip title='指标说明'>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total='78%'
        footer={
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <Trend
              flag='up'
              style={{
                marginRight: 16,
              }}
            >
              周同比
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag='down'>
              日同比
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color='#13C2C2' />
      </ChartCard>
    </Col> */}
  </Row>
)

export default IntroduceRow
