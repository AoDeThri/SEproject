import * as GradeServices from '@/services/grade'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultGradeWeight = {
  assignment: 1,
  exam1: 1,
  exam2: 1,
  experiment: 1,
  contest: 1,
  attendance: 1,
}

const defaultGrades = {
  studentID: -1,
  totalPoint: -1,
  assignmentPoint: -1,
  exam1Point: -1,
  exam2Point: -1,
  experimentPoint: -1,
  combatPoint: -1,
  attendancePoint: -1,
  bonusPoint: -1,
}

const defaultState = {
  isSuccess: false,
  grades: defaultGrades,
  gradeWeights: defaultGradeWeight,
  gradesList: []
}

const effects = {
  fetchAllGrades: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(GradeServices.fetchAllGrades, payload)
    // TODO
    yield put({
      type: 'setGradesList',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  fetchGradeWeight: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(GradeServices.fetchGradeWeight, payload)
    yield put({
      type: 'setGradeWeight',
      payload: res.data,
    })

    yield put({
      type: 'setIsSuccess',
      payload: res.isSuccess,
    })
  }),

  modifyGradeWeight: generateEffect(function* ({ payload }, { call }) {
    try{
      const res = yield call(GradeServices.putGradeWeight, payload)
      successHandler(res)
    } catch(e){
      errorHandler(e)
    }
  }),

}

const reducers = {
  setGradesList: generateReducer({
    attributeName: 'gradesList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setGrades: generateReducer({
    attributeName: 'grades',
    transformer: (payload) => {
      return payload || defaultGrades
    },
    defaultState,
  }),
  setGradeWeight: generateReducer({
    attributeName: 'gradeWeights',
    transformer: (payload) => {
      return payload || defaultGradeWeight
    },
    defaultState,
  }),
  setIsSuccess: generateReducer({
    attributeName: 'isSuccess',
    transformer: defaultObjectTransformer,
    defaultState,
  }),
}

export default {
  namespace: 'Grade',
  state: defaultState,
  effects,
  reducers,
}
