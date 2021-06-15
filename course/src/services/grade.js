import {
    API_GRADE_PREFIX,
    API_GRADE_ALLGRADE_PREFIX,
    API_GRADE_WEIGHT_PREFIX,
  } from '@/url-prefixes'
import request from '@/utils/request'
import SafeUrlAssembler from 'safe-url-assembler'
  
// fetch all grades in database
export const fetchAllGrades = (courseId) => {
    return request(SafeUrlAssembler('/:courseId').param({courseId:courseId}).toString(), {
        method: 'GET',
        prefix: API_GRADE_ALLGRADE_PREFIX,
    })
}

export const fetchOneGrades = (data) => {
    return request(SafeUrlAssembler('/:courseId/:studentId').param({courseId:data.courseId, studentId:data.studentId}).toString(), {
        method: 'GET',
        prefix: API_GRADE_PREFIX,
    })
}

// fetch course grade weitght
export const fetchGradeWeight = (courseId) => {
    return request(SafeUrlAssembler('/:courseId').param({courseId:courseId}).toString(), {
        method: 'GET',
        prefix: API_GRADE_WEIGHT_PREFIX,
    })
}

// put course grade weight
export const putGradeWeight = (data) => {
    console.log(data)
    return request(SafeUrlAssembler('/:courseId').param({courseId:data.courseId}).toString(), {
        method: 'PUT',
        prefix: API_GRADE_WEIGHT_PREFIX,
        data:data.values,
    })
}
  