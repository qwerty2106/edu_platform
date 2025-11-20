import axios from "axios";

export const CoursesAPI = {
    getCourses(currentPage, pageSize, filterType, userID) {
        return axios.get(`/app/courses?page=${currentPage}&count=${pageSize}&filter=${filterType}`, { headers: { 'userID': userID } }).then(response => response.data);
    },
    getCourseModules(courseID, userID, modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule) {
        return axios.get(`/app/courses/${courseID}?modulePage=${modulePage}&lessonPage=${lessonPage}&moduleCount=${modulePageSize}&lessonCount=${lessonPageSize}&moduleID=${currentModule}`, { headers: { 'userID': userID } }).then(response => response.data);
    },
    completeLesson(lessonID, formData) {
        return axios.post(`/app/lessons/${lessonID}`, formData).then(response => response.status)
    },
    getCurrentLesson(lessonID) {
        return axios.get(`/app/lessons/${lessonID}`).then(response => response.data)
    }
};

export const WorksAPI = {
    getWorks(currentPage, pageSize) {
        return axios.get(`/app/works?page=${currentPage}&count=${pageSize}`).then(response => response.data);
    },
    getCurrentWork(userID, lessonID) {
        return axios.get(`/app/works/${userID}/${lessonID}`).then(response => response.data);
    },
    updateWork(userID, lessonID, status, comment) {
        return axios.put(`/app/works/${userID}/${lessonID}`, { status, comment }).then(response => response.status);
    },
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

export const ProfileAPI = {
    getUserProgress(userID, currentPage, pageSize) {
        return axios.get(`/app/profile/${userID}?page=${currentPage}&count=${pageSize}`).then(response => response.data);
    },
};