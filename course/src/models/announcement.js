import * as AncServices from '@/services/announcement'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
    defaultArrayTransformer,
    defaultObjectTransformer,
} from '@/utils/generateReducer'

const defaultAncInfo = {
  announcementTitle: "",
  announcementContents: "",
  announcementIsPinned: null,
}

const defaultState = {
  ancList: [],
  ancInfo: defaultAncInfo,
}

const effects = {
  fetchAncList: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  addAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(AncServices.addAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  deleteAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    yield call(AncServices.deleteAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  modifyAncInfo: generateEffect(function* ({ payload }, { call }) {
    yield call(AncServices.modifyAncInfo, payload)
    const res = yield call(AncServices.fetchAncList, payload)

    yield put({
      type: 'setAncList',
      payload: res,
    })
  }),
  fetchAncInfo: generateEffect(function* ({ payload }, { call, put }) {
    const res = yield call(AncServices.fetchAncInfo, payload)

    yield put({
      type: 'setAncInfo',
      payload: res,
    })
  })
}

const reducers = {
  setAncList: generateReducer({
    attributeName: 'ancList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
  setAncInfo: generateReducer({
    attributeName: 'ancInfo',
    transformer: (payload) => payload || defaultAncInfo,
    defaultState,
  }),
}

export default {
  namespace: 'announcement',
  state: defaultState,
  effects,
  reducers,
}