import { io } from "socket.io-client";

//WebSocket на клиенте
class WebSocketService {
    constructor() {
        //Подключение
        this.socket = io('http://localhost:5000');
        //Флаги подписки на события (предотвращение повтора)
        this.isSubscribeMessage = false;
        this.isSubscribeNotify = false;
        this.isSubscribeRoomStats = false;
        this.isSubscribeMessageStats = false;
    };

    //Отправка подключенного пользователя
    joinUser(username, chatID) {
        this.socket.emit('join', { username, chatID });
    }

    //Отправка отключенного пользователя
    leaveUser(username, chatID) {
        this.socket.emit('leave', { username, chatID });
    };

    //Отправка сообщения
    sendMessage(message, username, chatID) {
        this.socket.emit('send-message', { message, username, chatID });
    };

    //Подписка на получение сообщений
    listenReceiveMessage(addMessage) {
        if (this.isSubscribeMessage) return;
        this.socket.on('receive-message', (data) => addMessage(data));
        this.isSubscribeMessage = true;
    };

    //Подписка на уведомления
    listenNotify(setNotify) {
        if (this.isSubscribeNotify) return;
        this.socket.on('notify', (notify) => setNotify(notify));
        this.isSubscribeNotify = true;
    };

    requestRoomStats() {
        this.socket.emit('requestRoomStats');
    };

    requestMessageStats() {
        this.socket.emit('requestMessageStats');
    };

    //Подписка на статистику по онлайн-пользователям
    listenRoomStats(setRoomStats) {
        if (this.isSubscribeRoomStats) return
        this.socket.on('roomStats', (roomStats) => {
            const newRoomStats = roomStats;
            setRoomStats(newRoomStats);
        })
        this.isSubscribeRoomStats = true;
    };

    //Подписка на статистику по сообщениям
    listenMessageStats(setMessageStats) {
        if (this.isSubscribeMessageStats) return
        this.socket.on('messageStats', (messageStats) => {
            const newMessageStats = messageStats;
            setMessageStats(newMessageStats);
        })
        this.isSubscribeMessageStats = true
    };
}

export default new WebSocketService();