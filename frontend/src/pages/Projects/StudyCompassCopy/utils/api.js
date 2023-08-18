import { Backend, setAuthToken } from '../../../../utils/apiConfig'

export const getStudyPrograms = async () => {
  try {
    const response = await Backend.get(`/course-recommender/studyprograms/`)
    const {
      data: { message },
    } = response

    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getLectureUsingStudyProgramId = async (studyProgramId) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))

    const response = await Backend.get(
      `/app/studycompass/get-lectures-with-id/${studyProgramId}/`
    )
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getCourses = async () => {
  try {
    // setAuthToken(sessionStorage.getItem('elas-token'))
    let token = sessionStorage.getItem('elas-token')
    if (token) {
      setAuthToken(sessionStorage.getItem('elas-token'))
      let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
      let studyProgram = userInfo.study_program
      let uid = userInfo.id
      const response = await Backend.post(`/course-recommender/user-courses/`, {
        studyprogram: studyProgram,
        uid: uid
      })
      const {
        data: { message },
      } = response
      return message
    } else {
      const response = await Backend.get(`/course-recommender/courses/`)
      const {
        data: { message },
      } = response
      return message
    }
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getAvailableCourse = async (semester) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))

    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let studyProgram = userInfo.study_program
    // let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/studyprogram-courses/`, {
      studyprogram: studyProgram,
      semester: semester
    })
    const {
      data: { message },
    } = response
    return message

  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getCourseInfo = async (id) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))

    const response = await Backend.get(`/course-recommender/course-detail/${id}/`)
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const enrollCourse = async (id, selectedTimeID, passedState) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    let passed
    if (passedState) {
      passed = JSON.parse(passedState)
    } else {
      passed = false
    }

    const response = await Backend.post(`/course-recommender/enroll-course/`, { uid: uid, cid: id, selectedTimeID: selectedTimeID, passed: passed })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const unenrollCourse = async (id) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id

    const response = await Backend.post(`/course-recommender/unenroll-course/`, { uid: uid, cid: id })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getCurrentEnrolledCourses = async () => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id

    const response = await Backend.post(`/course-recommender/student-current-courses/`, { uid: uid })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getWholeCoursePath = async () => {
  try {
    const response = await Backend.get(`/course-recommender/all-course-path/`)
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getLocalCoursePath = async (id) => {
  try {
    const response = await Backend.post(`/course-recommender/local-course-path/`, { cid: id })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getStudentSemester = async () => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/student-semester/`, { uid: uid })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const getStudentSchedule = async (semester) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/student-schedule/`, { uid: uid, semester: semester })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const rateCourse = async (cid, ratings) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/rate-course/`, { uid: uid, cid: cid, ratings: ratings })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const changePassState = async (cid, passed) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/change-pass-state/`, { uid: uid, cid: cid, passed: passed })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

export const changeUserSetting = async (setting) => {
  try {
    setAuthToken(sessionStorage.getItem('elas-token'))
    let userInfo = JSON.parse(sessionStorage.getItem('elas-user'))
    let uid = userInfo.id
    const response = await Backend.post(`/course-recommender/change-student-setting/`, { uid: uid, setting: setting })
    const {
      data: { message },
    } = response
    return message
  } catch (err) {
    console.log(err.details)
    throw err
  }
}

