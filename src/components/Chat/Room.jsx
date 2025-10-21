import React from "react";
import { connect } from "react-redux";
import { requestRooms } from "../../redux/rooms-reducer";
import { getLoadingRooms, getRooms } from "../../redux/rooms-selectors";
import { ChatDotsFill } from "react-bootstrap-icons";
import Preloader from "../../common/Preloader";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Room = (props) => {
    //Кол-во онлайн-пользователей в комнате
    const usersCount = 0
    const messageCount = 0
    return (
        <Row className="d-flex align-items-center w-100 p-2 border rounded-3 ">
            <Col xs={6}>
                <Row className="align-items-center">
                    <Col xs={2} className="d-flex justify-content-center"><ChatDotsFill style={{ width: "50px", height: "50px" }} /></Col>
                    <Col className="d-flex flex-column justify-content-center">
                        <Row>
                            <NavLink to={`/app/chats/${props.id}`} className="text-decoration-none text-primary">
                                <h4>{props.title}</h4>
                            </NavLink>
                        </Row>
                        <Row><p>{props.description}</p></Row>
                    </Col>
                </Row>
            </Col>
            <Col>
                <h6 className='m-0'>{messageCount}</h6>
            </Col>
            <Col>
                <div className="d-flex gap-2 align-items-center">
                    <h6 className='m-0'>{usersCount}</h6>
                    <div className={usersCount === 0 ? 'bg-danger' : 'bg-success'} style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                </div>
            </Col>
            <Col>
                <h6 className='m-0'>{props.createdDate}</h6>
            </Col>
        </Row>
    )
}

class RoomsContainer extends React.Component {
    componentDidMount() {
        this.props.requestRooms();
    }
    render() {
        //Спиннер (загрузка чатов)
        if (this.props.isLoading)
            return <Preloader />

        //Чатов нет (пустой массив)
        if (this.props.rooms.length === 0)
            return <h1>No rooms yet!</h1>

        //Список комнат
        const roomsElements = this.props.rooms.map(room => <Room key={room.id} id={room.id} title={room.title} description={room.description} createdDate={room.created_date} />);
        return <div>
            {/* Шапка */}
            <Container className='p-3 gap-3 d-grid'>
                <Row className="d-flex align-items-center w-100 p-3 bg-dark rounded-3 text-white">
                    <Col xs={6}><Row><span>Chats</span></Row></Col>
                    <Col><span>Messages</span></Col>
                    <Col className="col"><span>Users</span></Col>
                    <Col className="col"><span>Freshness</span></Col>
                </Row>
                {roomsElements}
            </Container>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: getRooms(state),
        isLoading: getLoadingRooms(state),
    }
}

export default connect(mapStateToProps, { requestRooms })(RoomsContainer)