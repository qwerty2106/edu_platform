import axios from "axios";


export const CoursesAPI = {
    getCourses(currentPage, pageSize, filterType, accessToken) {
        return axios.get(`/app/courses?page=${currentPage}&count=${pageSize}&filter=${filterType}`, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data);
    },
    getCourseModules(courseID, modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule, accessToken) {
        return axios.get(`/app/courses/${courseID}?modulePage=${modulePage}&lessonPage=${lessonPage}&moduleCount=${modulePageSize}&lessonCount=${lessonPageSize}&moduleID=${currentModule}`, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data);
    },
    completeLesson(lessonID, formData, accessToken) {
        return axios.post(`/app/lessons/${lessonID}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data)
    },
    getCurrentLesson(lessonID, accessToken) {
        return axios.get(`/app/lessons/${lessonID}`, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data)
    }
};

export const WorksAPI = {
    getWorks(userID, currentPage, pageSize, accessToken) {
        return axios.get(`/app/works/${userID}?page=${currentPage}&count=${pageSize}`, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data);
    },
    getCurrentWork(userID, lessonID, accessToken) {
        return axios.get(`/app/works/${userID}/${lessonID}`, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.data);
    },
    updateWork(userID, lessonID, status, comment, score, accessToken) {
        return axios.put(`/app/works/${userID}/${lessonID}`, { status, comment, score }, { headers: { 'Authorization': `Bearer ${accessToken}` } }).then(response => response.status);
    },
};

export const AuthAPI = {
    signUp(username, email, password) {
        return axios.post('/auth/register', { username, email, password }, { withCredentials: true }).then(response => response.data)
    },
    signIn(login, password) {
        return axios.post('/auth/login', { login, password }, { withCredentials: true }).then(response => response.data)
    },
    requestReset(email) {
        return axios.post('/auth/request-reset', { email }).then(response => response.status)
    },
    reset(resetToken, newPassword) {
        return axios.post('/auth/reset', { resetToken, newPassword }, { withCredentials: true }).then(response => response.data)
    },
    getUserData(accessToken) {
        return axios.get('/auth/me', { headers: { 'Authorization': `Bearer ${accessToken}` }, withCredentials: true }).then(response => response.data)
    },
    refreshToken() {
        return axios.post('/auth/refresh-token', {}, { withCredentials: true }).then(response => response.data)
    },
    logOut() {
        return axios.post('/auth/logout', {}, { withCredentials: true }).then(response => response.data)
    },
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