import * as LabServices from '@/services/lab'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultPublishLab = {
  caseId: -1,
  courseId: -1,
  courseCaseId: -1,
  caseStartTimeStamp: null,
  caseEndTimeStamp: null,
  experimentCaseDescription: null,
  experimentName:null,
  experimentCaseName: null,

  submissionUploader: -1,
  submissionFileToken: null,
  submissionTimestamp: null,
  submissionScore: -1,
  submissionComments: null,
  submissionIsPublic: false,
  submissionCaseId: 2,
}

const defaultState = {
  isSuccess: false,
  allPendingList: [],
  newPublishLab: defaultPublishLab,
  allLabCaseList: [],
  labCaseList:[],
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
  }),

  fetchMySubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchMySubmission, payload)

    yield put({
      type: 'setPendingList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
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

  fetchSubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.fetchSubmission, payload)

    yield put({
      type: 'setLabCaseList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  markSubmission: generateEffect(function* ({ payload }, { call }) {
    yield call(LabServices.markSubmission, payload)
  }),

  remarkSubmission: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(LabServices.remarkSubmission, payload)

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
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
