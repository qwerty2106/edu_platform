import axios from "axios";

export const CoursesAPI = {
    getCourses() {
        return axios.get('/app/courses').then(response => response.data);
    },
    getCourseModules(courseID) {
        return axios.get(`/app/courses/${courseID}`).then(response => response.data);
    },
    
};

export const AuthAPI = {
    signUp(username, email, password) {
        return axios.post('/register', { email, username, password }).then(response => response.data)
    },
    signIn(login, password) {
        return axios.post('/login', { login, password }).then(response => response.data)
    },
    requestReset(email) {
        return axios.post('/request-reset', { email }).then(response => response.status)
    },
    reset(resetToken, newPassword) {
        return axios.post('/reset', { resetToken, newPassword }).then(response => response.data)
    }
};