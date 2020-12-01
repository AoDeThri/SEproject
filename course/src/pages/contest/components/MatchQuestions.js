import React from 'react'
import { Row, Col, List, Divider } from 'antd'
import Question from '@/pages/contest/components/Question'

const MatchQuestions = ({ questions = [], score }) => {
  const footer =
    score != null ? (
      <React.Fragment>
        <Divider />
        <div className='match-score-block'>总分：{score}</div>
      </React.Fragment>
    ) : null

  return (
    <div>
      <Row>
        <Col md={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
          <List
            dataSource={questions}
            size='large'
            renderItem={(question) => (
              <List.Item key={question.questionId}>
                <Question question={question} />
              </List.Item>
            )}
          />
          {footer}
        </Col>
      </Row>
    </div>
  )
}

export default React.memo(MatchQuestions)