import React from "react";
import { joinUser, listenReceiveMessage, requestMessages } from "../../redux/chat-reducer";
import { getLoadingMessages, getMessages } from "../../redux/chat-selectors";
import { getUser } from "../../redux/auth-selectors"
import Message from "./Message";
import Input from "./Input";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import withRouter from "../../common/WithRouter";
import Preloader from "../../common/Preloader";
import { withChatRedirect } from "../../hoc/withChatRedirect";
import { getLoadingRooms, getRooms } from "../../redux/rooms-selectors";

const Chat = (props) => {
    const messageElements = props.messages.map(message => <Message key={message.id} username={message.username} message={message.message} />)
    return (
        <Container fluid className="p-1" style={{ height: "100vh", }}>

            {/* Шапка */}
            <div className="p-3 bg-dark text-white rounded-3">
                <h3>Room name</h3>
                <div className="d-flex gap-2 align-items-center">
                    <div className={'bg-danger'} style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                    <h6 className="m-0">online: 0</h6>
                </div>

                {/* <div className="d-flex gap-2 align-items-center">
                        <div className={props.joinUsers.length === 0 ? 'bg-danger' : 'bg-success'} style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                        <h6 className="m-0">online: {props.joinUsers.length}</h6>
                    </div> */}
            </div>

            {/* Сообщения */}
            <div className="d-flex flex-column gap-2 py-2" style={{ overflowY: "auto" }}>
                {messageElements}
            </div>

            {/* Строка ввода */}
            <Input />

            {/* Уведомление */}
            {/* <ToastContainer position="top-end" className="p-3">
                <Toast show={showNotify} onClose={toggleNotify}>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">{room.name}</strong>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body>{props.notify}</Toast.Body>
                </Toast>
            </ToastContainer> */}
        </Container>
    )
}


class ChatContainer extends React.Component {
    componentDidMount() {
        const chatID = this.props.router.params.chatID;
        this.props.requestMessages(chatID);

        //Подписки на события 1 раз
        this.props.listenReceiveMessage();

        this.props.joinUser(this.props.user.username, chatID);
    }

    render() {
        if (this.props.isLoading) {
            return <Preloader />
        }
        return <Chat {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return {
        messages: getMessages(state),
        isLoading: getLoadingMessages(state),
        user: getUser(state),
        rooms: getRooms(state),
        isLoadingRooms: getLoadingRooms(state)
    }
}

export default connect(mapStateToProps, { requestMessages, joinUser, listenReceiveMessage })(withRouter(withChatRedirect(ChatContainer)))