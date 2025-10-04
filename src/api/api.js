import axios from "axios"
export const CoursesAPI = {
    getCourses() {
        return axios.get('/courses').then(response => response.data);
    },
    getCourseModules(courseID) {
        return axios.get(`/courses/${courseID}`).then(response => response.data);
    }
}