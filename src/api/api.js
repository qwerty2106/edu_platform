import axios from "axios";

export const CoursesAPI = {
    getCourses() {
        return axios.get('/courses').then(response => response.data);
    },
    getCourseModules(courseID) {
        return axios.get(`/courses/${courseID}`).then(response => response.data);
    }
};

export const AuthAPI = {
    signUp(username, password) {
        return axios.post('/register', { username, password }).then(response => response.data)
    },
    signIn(username, password) {
        return axios.post('/login', { username, password }).then(response => response.data)
    }
};