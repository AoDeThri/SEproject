import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

// const defaultPublishLab = {
//   case_id: -1,
//   course_id: -1,
//   case_start_timestamp: null,
//   case_end_timestamp: null,
//   course_case_id: -1,
// }

const defaultPublishLab = {
  caseId: -1,
  courseId: -1,
  caseStartTimeStamp: null,
  caseEndTimeStamp: null,
  courseCaseId: -1,
  experimentCaseDescription: null,
  experimentName: null,
  experimentCaseName: null,
}

const defaultState = {
  isSuccess: false,
  allPendingList: [],
  newPublishLab: defaultPublishLab,
  allLabCaseList: [],
  labCaseList: [],
  labStatistics: {},
}

const effects = {
  fetchAllStudentReport: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchAllStudentReport, payload)

    yield put({
      type: 'setPendingList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  publishLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.publishLabCase, payload)
  }),
  deleteLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.deleteLabCase, payload)
  }),
  createLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.createLabCase, payload)
  }),
  submitLabCase: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.submitLabCase, payload)
  }),
  fetchAllLabCase: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchAllLabCase, payload)

    yield put({
      type: 'setAllLabCaseList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
    yield put({
      type: 'fetchLabStatistics',
      payload: res.data[0].courseCaseId,
    })
  }),

  fetchLabCase: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchLabCase, payload)

    yield put({
      type: 'setLabCaseList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  remarkSubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.remarkSubmission, payload)

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),
  fetchLabStatistics: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchLabStatistics, payload)
    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
    yield put({
      type: 'setLabStatistics',
      payload: res.data,
    })
  }),
}

const reducers = {
  setPendingList: generateReducer({
    attributeName: 'allPendingList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setIsSuccess: generateReducer({
    attributeName: 'isSuccess',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setPublishLab: generateReducer({
    attributeName: 'newPublishLab',
    transformer: (payload) => {
      return payload || defaultPublishLab
    },
    defaultState,
  }),
  setAllLabCaseList: generateReducer({
    attributeName: 'allLabCaseList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setLabStatistics: generateReducer({
    attributeName: 'labStatistics',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
  setLabCaseList: generateReducer({
    attributeName: 'labCaseList',
    transformer: defaultArrayTransformer,
  }),
}

export default {
  namespace: 'lab',
  state: defaultState,
  effects,
  reducers,
}
