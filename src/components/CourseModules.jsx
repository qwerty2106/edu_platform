import React from "react";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { requestCourseModules } from "../redux/courses-reducer";
import { getLessons, getLessonsCount, getLoadingCourses, getModules, getModulesCount } from "../redux/courses-selectors";
import withRouter from "../common/WithRouter"
import Preloader from "../common/Preloader";
import { getUser } from "../redux/auth-selectors";
import { CheckCircleFill } from "react-bootstrap-icons";
import MyPagination from "../common/Pagination";

const Lesson = (props) => {
    const navigate = useNavigate();
    const { courseID } = useParams();
    return (
        <div>
            <div className="d-flex flex-column">
                <div className="fw-bold d-flex align-items-center gap-2">
                    <span>Урок {props.orderIndex}</span>
                    {props.isCompleted ? <CheckCircleFill style={{ color: 'green' }} /> : null}
                </div>
                <span className="small">«{props.title}»</span>
                <div className="mt-3">
                    <Button size="sm" onClick={() => navigate(`/app/lessons/${props.id}`)} style={{ cursor: "pointer" }}>Перейти</Button>
                </div>
            </div>

        </div>
    )
}

const Module = (props) => {
    return (
        <span className="fw-bold">Модуль {props.orderIndex}: «{props.title}»</span>
    )
}


class CourseModules extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modulePageSize: 3, modulePage: 1, lessonPageSize: 2, lessonPage: 1, currentModule: null };
    }
    componentDidMount() {
        this.loadData();
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // Срабатывает когда:
    //     // 1. Загрузились новые модули И currentModule = null
    //     // 2. Или сменилась страница модулей
    //     if (this.props.courseModules !== prevProps.courseModules && 
    //         this.props.courseModules.length > 0 && 
    //         !this.state.currentModule) {

    //         const firstModule = this.props.courseModules[0].id;
    //         this.setState({ currentModule: firstModule });
    //     }
    // }

    componentDidUpdate(prevProps) {
        if (this.props.courseModules.length > 0 && !this.state.currentModule) {
            const firstModule = this.props.courseModules[0].id;
            this.setState({ currentModule: firstModule });
        }
    }

    loadData = () => {
        const courseID = this.props.router.params.courseID;  //courseID из URL
        const { modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule } = this.state;
        this.props.requestCourseModules(courseID, this.props.user.id, modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule);
    }

    onModulePageChangeHandle = (modulePage) => {
        this.setState({ modulePage, currentModule: null, lessonPage: 1 }, () => {
            this.loadData();
        });
    }
    onLessonPageChangeHandle = (lessonPage) => {
        this.setState({ lessonPage }, () => {
            this.loadData();
        });
    }

    onClickHandle = (currentModule) => {
        this.setState({ currentModule, lessonPage: 1 }, () => {
            this.loadData();
        });
    }

    render() {
        //Загрузка модулей
        if (this.props.isLoading)
            return <Preloader />

        //Курс без модулей
        if (this.props.courseModules.length === 0)
            return <h1>No modules yet!</h1>

        const activeModule = this.state.currentModule || this.props.courseModules[0]?.id;

        //Список модулей
        const modulesElements = this.props.courseModules.map(module =>
            <Nav.Item>
                <Nav.Link eventKey={module.id} onClick={() => this.onClickHandle(module.id)} active={activeModule === module.id}>
                    <Module key={module.id} id={module.id} title={module.title} lessons={module.lessons} orderIndex={module.order_index} />
                    <div className="small">{module.description}</div>
                </Nav.Link>
            </Nav.Item>)

        //Список уроков
        const lessonsElements = this.props.courseLessons.map(lesson =>
            <Tab.Pane eventKey={lesson.module_id} className="mb-3 bg-dark text-white p-3 rounded">
                <Lesson key={lesson.id} id={lesson.id} title={lesson.title} path={lesson.content_path} moduleID={lesson.module_id} isCompleted={lesson.is_completed} orderIndex={lesson.order_index} />
            </Tab.Pane>)

        return (
            <div>
                <MyPagination itemsCount={this.props.modulesCount} pageSize={this.state.modulePageSize} currentPage={this.state.modulePage} onPageChange={this.onModulePageChangeHandle} />
                <Tab.Container defaultActiveKey={activeModule}>
                    <Row>
                        <Col sm={4}>
                            <Nav variant="pills" className="flex-column gap-1">
                                {modulesElements}
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content>
                                <MyPagination itemsCount={this.props.lessonsCount} pageSize={this.state.lessonPageSize} currentPage={this.state.lessonPage} onPageChange={this.onLessonPageChangeHandle} />
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
        modulesCount: getModulesCount(state),
        lessonsCount: getLessonsCount(state),
        user: getUser(state),
    }
}

export default (connect(mapStateToProps, { requestCourseModules })(withRouter(CourseModules)));