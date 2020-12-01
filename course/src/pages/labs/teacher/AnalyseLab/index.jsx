import { EllipsisOutlined } from '@ant-design/icons'
import { Col, Dropdown, Row, Table, Button, Tabs } from 'antd'
import React, { Component, Suspense } from 'react'
import { GridContent } from '@ant-design/pro-layout'
import { connect } from 'umi'
import PageLoading from './components/PageLoading'
import { getTimeDistance } from './utils/utils'
import styles from './style.less'

const ProportionSales = React.lazy(() => import('./components/ProportionSales'))

class AnalyseLab extends Component {
  state = {
    salesType: 'all',
    rangePickerValue: getTimeDistance('year'),
  }

  reqRef = 0

  timeoutId = 0

  componentDidMount() {
    const { dispatch } = this.props
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'labsAndAnalyseLab/fetch',
      })
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'labsAndAnalyseLab/clear',
    })
    cancelAnimationFrame(this.reqRef)
    clearTimeout(this.timeoutId)
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    })
  }

  handleRangePickerChange = (rangePickerValue) => {
    const { dispatch } = this.props
    this.setState({
      rangePickerValue,
    })
    dispatch({
      type: 'labsAndAnalyseLab/fetchSalesData',
    })
  }

  // TODO: otherLabs onClick func
  otherLabOnClick = () => {}

  selectDate = (type) => {
    const { dispatch } = this.props
    this.setState({
      rangePickerValue: getTimeDistance(type),
    })
    dispatch({
      type: 'labsAndAnalyseLab/fetchSalesData',
    })
  }

  isActive = (type) => {
    const { rangePickerValue } = this.state

    if (!rangePickerValue) {
      return ''
    }

    const value = getTimeDistance(type)

    if (!value) {
      return ''
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate
    }

    return ''
  }

  render() {
    const { rangePickerValue, salesType } = this.state
    const { labsAndAnalyseLab, loading } = this.props
    const { salesTypeData, salesTypeDataOnline, otherLabsData } = labsAndAnalyseLab
    let salesPieData
    const columns = [
      {
        title: '其他实验',
        dataIndex: 'name',
        render: (text) => (
          <a
            onClick={() => {
              this.otherLabOnClick()
            }}
          >
            {text}
          </a>
        ),
      },
    ]

    if (salesType === 'all') {
      salesPieData = salesTypeData
    } else {
      salesPieData = salesTypeDataOnline
    }

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={null}>
            <ProportionSales
              salesType={salesType}
              loading={loading}
              salesPieData={salesPieData}
              handleChangeSalesType={this.handleChangeSalesType}
              otherLabsData={otherLabsData}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    )
  }
}

export default connect(({ labsAndAnalyseLab, loading }) => ({
  labsAndAnalyseLab,
  loading: loading.effects['labsAndAnalyseLab/fetch'],
}))(AnalyseLab)
