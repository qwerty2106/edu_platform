import React, { useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLesson, getLoadingCourses } from "../redux/courses-selectors";

import { Container, Spinner } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import withRouter from "../common/WithRouter";
import { requestCourseModules } from "../redux/courses-reducer";

const Lesson = (props) => {

    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    useEffect(() => {
        if (!props.lesson) return;
        const encodedPath = encodeURI(props.lesson.content_path)
        fetch(encodedPath)
            .then(res => res.text())
            .then(text => setContent(text))
            .catch(err => console.log(err));
    }, [props.lesson])


    return (
        <div>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    )
}

class LessonContent extends React.Component {
    componentDidMount() {
        const courseID = this.props.router?.params?.courseID;
        this.props.requestCourseModules(courseID);
    }
    render() {
        //Загрузка урока
        if (this.props.isLoading)
            return (
                <Container className='d-flex justify-content-center align-items-center h-100'>
                    <Spinner animation='border' variant='dark'></Spinner>
                </Container>
            )
        return (
            <Lesson {...this.props} />
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const lessonID = ownProps.router?.params?.lessonID; //courseID из URL
    console.log('lessonID', lessonID)
    return {
        lesson: getLesson(state, lessonID),
        isLoading: getLoadingCourses(state),
    }
}


export default withRouter(connect(mapStateToProps, {requestCourseModules})(LessonContent));