import React from "react";
import { Col, ListGroup, Nav, Pagination, Row, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { requestCourseModules } from "../redux/courses-reducer";
import { getLessons, getLoadingCourses, getModules } from "../redux/courses-selectors";
import withRouter from "../common/WithRouter"
import Preloader from "../common/Preloader";
import { getUser } from "../redux/auth-selectors";
import { AwardFill, Check2, CheckCircle, CheckCircleFill, CheckLg } from "react-bootstrap-icons";
import MyPagination from "../common/Pagination";

const Lesson = (props) => {
    const navigate = useNavigate();
    const { courseID } = useParams();
    return (
        <ListGroup.Item onClick={() => navigate(`/app/courses/${courseID}/${props.moduleID}/${props.id}`)} style={{ cursor: "pointer" }}>
            <div className="py-2">
                <div className="fw-bold d-flex align-items-center gap-2">
                    Урок {props.orderIndex}
                    {props.isCompleted ? <CheckCircleFill style={{ color: 'green' }} /> : null}
                </div>
                {props.title}
            </div>

        </ListGroup.Item>
    )
}

const Module = (props) => {
    return (
        <span className="fw-bold">Модуль {props.orderIndex}: {props.title}</span>
    )
}


class CourseModules extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 3, page: 1 };
    }
    componentDidMount() {
        const courseID = this.props.router.params.courseID;  //courseID из URL
        this.props.requestCourseModules(courseID, this.props.user.id);  //Загрузка данных для аккордеона
    }
    render() {
        //Загрузка модулей
        if (this.props.isLoading)
            return <Preloader />

        //Курс без модулей
        if (this.props.courseModules.length === 0)
            return <h1>No modules yet!</h1>

        //Список модулей
        const modulesElements = this.props.courseModules.map(module =>
            <Nav.Item>
                <Nav.Link eventKey={module.id} >
                    <Module key={module.id} id={module.id} title={module.title} lessons={module.lessons} orderIndex={module.order_index} />
                    <div className="small">{module.description}</div>
                </Nav.Link>
            </Nav.Item>)

        //Список уроков
        const lessonsElements = this.props.courseLessons.map(lesson =>
            <Tab.Pane eventKey={lesson.module_id}>
                <Lesson key={lesson.id} id={lesson.id} title={lesson.title} path={lesson.content_path} moduleID={lesson.module_id} isCompleted={lesson.is_completed} orderIndex={lesson.order_index} />
            </Tab.Pane>)

        return (
            <div>
                <MyPagination />
                <Tab.Container defaultActiveKey={0}>
                    <Row>
                        <Col sm={4}>
                            <Nav variant="pills" className="flex-column gap-1">
                                {modulesElements}
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content>
                                {lessonsElements}
                            </Tab.Content>
                        </Col>

                    </Row>
                </Tab.Container>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        // courseModules: getCourseModules(state),
        courseModules: getModules(state),
        courseLessons: getLessons(state),
        isLoading: getLoadingCourses(state),
        user: getUser(state),
    }
}

export default (connect(mapStateToProps, { requestCourseModules })(withRouter(CourseModules)));