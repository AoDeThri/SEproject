import { Card, Radio } from 'antd'
import { FormattedMessage } from 'umi'
import React from 'react'
import { Pie } from './Charts'
import styles from '../style.less'

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id='labsandanalyselab.analysis.the-proportion-of-sales'
        defaultMessage='The Proportion of Sales'
      />
    }
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value='all'>
              <FormattedMessage id='labsandanalyselab.channel.all' defaultMessage='ALL' />
            </Radio.Button>
            <Radio.Button value='online'>
              <FormattedMessage id='labsandanalyselab.channel.online' defaultMessage='Online' />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        <FormattedMessage id='labsandanalyselab.analysis.all-count-title' defaultMessage='Sales' />
      </h4>
      <Pie
        hasLegend
        subTitle={
          <FormattedMessage id='labsandanalyselab.analysis.all-count' defaultMessage='Sales' />
        }
        total={() => <p>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</p>}
        data={salesPieData}
        valueFormat={(value) => <p>{value}</p>}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
)

export default ProportionSales
