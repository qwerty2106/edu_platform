import React from "react";
import { Accordion, AccordionBody, AccordionHeader, Container, ListGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCourseContentData } from "../redux/courses-reducer";
import { getCourseContent } from "../redux/course-content-selectors";
import withRouter from "../common/WithRouter"

const Lesson = (props) => {
    const navigate = useNavigate();
    return (
        <ListGroup.Item>
            <span onClick={() => navigate('/profile')} style={{ cursor: "pointer" }}>{props.title}</span>
        </ListGroup.Item>
    )
}

const Module = (props) => {
    const lessonsElements = props.lessons.map(lesson => <Lesson key={lesson.id} id={lesson.id} title={lesson.title} path={lesson.content_path} />)
    return (
        <Accordion.Item eventKey={props.id}>
            <AccordionHeader>{props.title}</AccordionHeader>
            <AccordionBody>
                <span>lorem ipsum</span>
                <ListGroup className="py-3">
                    {lessonsElements}
                </ListGroup>
            </AccordionBody>
        </Accordion.Item>
    )
}


class CourseContent extends React.Component {
    componentDidMount() {
        const courseID = this.props.router.params.courseID;
        this.props.getCourseContentData(courseID);
    }
    render() {
        if (!this.props.courseContent)
            return (
                <Container className='d-flex justify-content-center align-items-center h-100'>
                    <Spinner animation='border' variant='dark'></Spinner>
                </Container>
            )
        const modulesElements = this.props.courseContent.map(content => <Module key={content.id} id={content.id} title={content.title} lessons={content.lessons} />)
        return (
            <Accordion defaultActiveKey={1}>
                {modulesElements}
            </Accordion>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        courseContent: getCourseContent(state)
    }
}

export default (connect(mapStateToProps, { getCourseContentData })(withRouter(CourseContent)));