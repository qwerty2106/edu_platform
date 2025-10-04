import axios from "axios"
export const CoursesAPI = {
    getCourses() {
        return axios.get('/courses').then(response => response.data);
    }
}