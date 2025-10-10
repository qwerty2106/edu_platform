import React from "react";
import { Accordion, Container, ListGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { requestCourseModules } from "../redux/courses-reducer";
import { getCourseModules, getLoadingCourses } from "../redux/courses-selectors";
import withRouter from "../common/WithRouter"
import Preloader from "../common/Preloader";

const Lesson = (props) => {
    const navigate = useNavigate();
    const { courseID } = useParams();
    return (
        <ListGroup.Item>
            <span onClick={() => navigate(`/app/courses/${courseID}/${props.id}`)} style={{ cursor: "pointer" }}>{props.title}</span>
        </ListGroup.Item>
    )
}

const Module = (props) => {
    const lessonsElements = props.lessons.map(lesson => <Lesson key={lesson.id} id={lesson.id} title={lesson.title} path={lesson.content_path} moduleID={props.id} />)
    return (
        <Accordion.Item eventKey={props.id}>
            <Accordion.Header>{props.title}</Accordion.Header>
            <Accordion.Body>
                <span>lorem ipsum</span>
                <ListGroup className="py-3">
                    {lessonsElements}
                </ListGroup>
            </Accordion.Body>
        </Accordion.Item>
    )
}


class CourseModules extends React.Component {
    componentDidMount() {
        const courseID = this.props.router.params.courseID;  //courseID из URL
        this.props.requestCourseModules(courseID);  //Загрузка данных для аккордеона
    }
    render() {
        //Загрузка модулей
        if (this.props.isLoading)
            return <Preloader />

        //Курс без модулей
        if (this.props.courseModules.length === 0)
            return <h1>No modules yet!</h1>

        //Список модулей
        const modulesElements = this.props.courseModules.map(module => <Module key={module.id} id={module.id} title={module.title} lessons={module.lessons} />)

        return <Accordion>{modulesElements}</Accordion>
    }
}

const mapStateToProps = (state) => {
    return {
        courseModules: getCourseModules(state),
        isLoading: getLoadingCourses(state),
    }
}

export default (connect(mapStateToProps, { requestCourseModules })(withRouter(CourseModules)));