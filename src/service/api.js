import axios from "axios";

export const CoursesAPI = {
    getCourses() {
        return axios.get('/app/courses').then(response => response.data);
    },
    getCourseModules(courseID) {
        return axios.get(`/app/courses/${courseID}`).then(response => response.data);
    },
    completeLesson(userID, courseID, lessonID) {
        return axios.post(`/app/courses/${courseID}/${lessonID}`, { userID }).then(response => response.status)
    }

};

export const AuthAPI = {
    signUp(username, email, password) {
        return axios.post('/auth/register', { username, email, password }).then(response => response.data)
    },
    signIn(login, password) {
        return axios.post('/auth/login', { login, password }).then(response => response.data)
    },
    requestReset(email) {
        return axios.post('/auth/request-reset', { email }).then(response => response.status)
    },
    reset(resetToken, newPassword) {
        return axios.post('/auth/reset', { resetToken, newPassword }).then(response => response.data)
    }
};

export const ChatAPI = {
    getRooms(userID) {
        return axios.get('/app/chats', { headers: { 'userID': userID } }).then(response => response.data);
    },
    getMessages(chatID) {
        return axios.get(`/app/chats/${chatID}`).then(response => response.data);
    }
};
