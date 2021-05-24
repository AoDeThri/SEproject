import * as CourseServices from '@/services/course'
import generateEffect from '@/utils/generateEffect'
import generateReducer, {
  defaultArrayTransformer,
  defaultObjectTransformer,
} from '@/utils/generateReducer'
import { cloneDeep } from 'lodash'
import moment from 'moment'

const defaultCourseInfo = {
  courseCreatorSchoolId: 'tongji',
  courseId: -1,
  courseName: null,
  courseCredit: null,
  courseStudyTimeNeeded: null,
  courseDescription: null,
  courseType: '必修',
  courseStartTime: null,
  courseEndTime: null,
  courseAvatar: false,
}

const defaultState = {
  currentCourseInfo: defaultCourseInfo,
  courseList: [],
  courseTeachList: [], // course-teach的list
}

const effects = {
  // 获取全部课程信息
  getAllCourses: generateEffect(function* (_, { call, put, select }) {
    const res = yield call(CourseServices.fetchAllCourseInfo)
    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // FIXME: can't get the courseList using students' account
  // 获取当前课程信息
  getCurrentCourseInfo: generateEffect(function* ({ payload }, { put, select }) {
    const courseList = yield select((state) => state.Course.courseList)
    const currentCourse = courseList[payload]
    // const res = yield call(CourseServices.fetchOneCourseInfo, currentCourse)

    yield put({
      type: 'setCurrentCourse',
      payload: currentCourse,
    })
    // const currentCourseInfo = yield select((state) => state.Course.currentCourseInfo)
    // console.log(currentCourseInfo)
  }),

  getCurrentCourseInfoStudent: generateEffect(function* ({ payload }, { call, put, select }) {
    // console.log(payload)
    const courseList = yield select((state) => state.Course.courseList)
    // console.log(courseList)
    const currentCourse = payload
    // console.log(currentCourse)
    const res = yield call(CourseServices.fetchOneCourseInfo, currentCourse)

    // console.log(res.data)
    yield put({
      type: 'setCurrentCourse',
      payload: res.data,
    })
    // const currentCourseInfo = yield select((state) => state.Course.currentCourseInfo)
    // console.log(currentCourseInfo)
  }),

  // 创建新课程
  createNewCourse: generateEffect(function* ({ payload }, { call, put }) {
    const newCourseInfoCopy = cloneDeep(payload)

    newCourseInfoCopy.course_creator_school_id = 'tongji'
    // newCourseInfoCopy.course_start_time = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
    //   newCourseInfoCopy.course_time[0],
    // )[0]
    // newCourseInfoCopy.course_end_time = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(
    //   newCourseInfoCopy.course_time[1],
    // )[0]
    newCourseInfoCopy.course_start_time = moment(newCourseInfoCopy.course_time[0]).format()
    newCourseInfoCopy.course_end_time = moment(newCourseInfoCopy.course_time[1]).format()
    newCourseInfoCopy.course_avatar = 'fake'
    newCourseInfoCopy.course_credit = parseInt(newCourseInfoCopy.course_credit, 10)
    newCourseInfoCopy.course_study_time_needed = parseInt(
      newCourseInfoCopy.course_study_time_needed,
      10,
    )
    delete newCourseInfoCopy.course_time

    console.log(newCourseInfoCopy)

    const newCourseInfo = yield call(CourseServices.publishCourse, newCourseInfoCopy)

    console.log(newCourseInfo)

    yield call(CourseServices.publishGradeWeight, newCourseInfo)
    const gradeWeight = yield call(CourseServices.fetchGradeWeight, newCourseInfo)
    console.log(gradeWeight)

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // 编辑课程信息
  updateSomeCourse: generateEffect(function* ({ payload, successHandler }, { call, put }) {
    const newValues = cloneDeep(payload)
    const oldKeys = Object.keys(payload)
    for (let i = 0; i < oldKeys.length; i++) {
      const key = oldKeys[i]
      if (newValues[key] === undefined || newValues[key] === null) {
        delete newValues[key]
      } else if (
        key.toString() === 'courseId' ||
        key.toString() === 'courseCredit' ||
        key.toString() === 'courseStudyTimeNeeded'
      ) {
        newValues[key] = parseInt(newValues[key], 10)
      } else if (key.toString() === 'courseTime') {
        newValues.courseStartTime = moment(newValues.courseTime[0]).format()
        newValues.courseEndTime = moment(newValues.courseTime[1]).format()
        delete newValues[key]
      }
    }
    console.log(newValues)
    try {
      yield call(CourseServices.updateCourseInfo, newValues)
      successHandler()
    } catch (error) {
      console.log(error)
    }

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // 删除课程信息
  deleteCourseInfo: generateEffect(function* ({ payload }, { call, put }) {
    console.log(payload)

    yield call(CourseServices.deleteCourseInfo, payload)

    const res = yield call(CourseServices.fetchAllCourseInfo)

    yield put({
      type: 'setCourseList',
      payload: res.data,
    })
  }),

  // 获取全部绑定关系列表
  getAllCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    console.log('开始接受数据')
    const res = yield call(CourseServices.fetchAllCourseTeach)

    console.log(res)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  // 新建一个课程绑定
  createNewCourseTeach: generateEffect(function* (
    { payload, errorHandler, successHandler },
    { call, put },
  ) {
    const { courseId, teacherId } = payload
    const newCourseTeachCopy = cloneDeep({
      course_id: courseId,
      teacher_id: teacherId,
    })

    try {
      const resPublish = yield call(CourseServices.publishCourseTeach, newCourseTeachCopy)
      successHandler(resPublish)
    } catch (e) {
      errorHandler(e)
    }
    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),

  // 删除一个课程绑定
  deleteCourseTeach: generateEffect(function* ({ payload }, { call, put }) {
    console.log('effect', payload)

    yield call(CourseServices.deleteCourseTeach, payload)

    const res = yield call(CourseServices.fetchAllCourseTeach)

    yield put({
      type: 'setCourseTeachList',
      payload: res.data,
    })
  }),
}

const reducers = {
  setCourseList: generateReducer({
    attributeName: 'courseList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),

  setCurrentCourse: generateReducer({
    attributeName: 'currentCourseInfo',
    // transformer: defaultObjectTransformer,
    transformer: (payload) => payload || defaultCourseInfo,
    defaultState,
  }),

  setCourseTeachList: generateReducer({
    attributeName: 'courseTeachList',
    transformer: defaultArrayTransformer,
    defaultState,
  }),
}

export default {
  namespace: 'Course',
  state: defaultState,
  effects,
  reducers,
}
