import React from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import { requestCourseModules } from "../../redux/courses-reducer";
import { getLessons, getLessonsCount, getLoadingCourses, getModules, getModulesCount } from "../../redux/courses-selectors";
import withRouter from "../../common/WithRouter"
import Preloader from "../../common/Preloader";
import MyPagination from "../../common/Pagination";
import LessonInfo from "./Lesson/LessonInfo";
import ModuleInfo from "./Module/ModuleInfo";
import EmptyScreen from "../../common/EmptyScreen";

class CourseModules extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modulePageSize: 3, modulePage: 1, lessonPageSize: 2, lessonPage: 1, currentModule: null };
    }
    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const { modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule } = this.state;
        const courseID = this.props.router.params.courseID;  //courseID из URL
        const result = await this.props.requestCourseModules(courseID, modulePage, lessonPage, modulePageSize, lessonPageSize, currentModule);

        if (!result.success && (result.error === 403 || result.error === 404))
            this.props.router.navigate('/app/courses', { replace: true });
    }

    //Смена пагинации модулей
    onModulePageChangeHandle = (modulePage) => {
        this.setState({ modulePage, currentModule: null, lessonPage: 1 }, () => {
            this.loadData();
        });
    }

    //Смена пагинации страниц
    onLessonPageChangeHandle = (lessonPage) => {
        this.setState({ lessonPage }, () => {
            this.loadData();
        });
    }

    //Выбор модулей
    onClickHandle = (currentModule) => {
        this.setState({ currentModule, lessonPage: 1 }, () => {
            this.loadData();
        });
    }

    render() {
        const { modulePageSize, modulePage, lessonPageSize, lessonPage, currentModule } = this.state;
        const { modulesCount, lessonsCount, isLoading, courseModules, courseLessons } = this.props;

        //Загрузка модулей
        if (isLoading)
            return <Preloader />

        //Курс без модулей
        if (courseModules.length === 0)
            return <EmptyScreen />

        const activeModule = currentModule || courseModules[0]?.id;

        //Список модулей
        const modulesElements = courseModules.map(module => <ModuleInfo
            key={module.id}
            onClickHandle={this.onClickHandle}
            activeModule={activeModule}
            {...module}
        />)

        //Список уроков
        const lessonsElements = courseLessons.map(lesson => <LessonInfo
            key={lesson.id}
            {...lesson}
        />)

        return (
            <>
                <MyPagination
                    itemsCount={modulesCount}
                    pageSize={modulePageSize}
                    currentPage={modulePage}
                    onPageChange={this.onModulePageChangeHandle} />
                <Tab.Container activeKey={activeModule}>
                    <Row>
                        <Col sm={4}>
                            <Nav variant="pills" className="flex-column gap-1">
                                {modulesElements}
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content>
                                <MyPagination
                                    itemsCount={lessonsCount}
                                    pageSize={lessonPageSize}
                                    currentPage={lessonPage}
                                    onPageChange={this.onLessonPageChangeHandle} />
                                {lessonsElements}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        courseModules: getModules(state),
        courseLessons: getLessons(state),
        isLoading: getLoadingCourses(state),
        modulesCount: getModulesCount(state),
        lessonsCount: getLessonsCount(state),
    }
}

export default (connect(mapStateToProps, { requestCourseModules })(withRouter(CourseModules)));