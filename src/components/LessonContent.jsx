import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getLesson, getLoadingCourses } from "../redux/courses-selectors";
import ReactMarkdown from 'react-markdown';
import withRouter from "../common/WithRouter";
import { requestCourseModules } from "../redux/courses-reducer";
import Preloader from "../common/Preloader";

const Lesson = (props) => {
    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    //Загрузка (преобразование файла)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.lesson) {
            setLoading(false);
            return;
        };
        //Кодировка некорректных символов в названии файла
        const encodedPath = encodeURI(props.lesson.content_path);
        setLoading(true);
        fetch(encodedPath)
            .then(res => res.text()) //Запись файла в строчку
            .then(text => setContent(text))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [props.lesson])

    if (isLoading) return <Preloader />
    return content ? <div><ReactMarkdown>{content}</ReactMarkdown></div> : <h1>No lesson yet!</h1>
}

class LessonContent extends React.Component {
    componentDidMount() {
        //Загрузка модулей и уроков при обновлении страницы в state
        const courseID = this.props.router.params.courseID;
        this.props.requestCourseModules(courseID);
    }
    render() {
        //Загрузка урока 
        if (this.props.isLoading)
            return <Preloader />
        return <Lesson {...this.props} />
    }
}

const mapStateToProps = (state, ownProps) => {
    const lessonID = ownProps.router.params.lessonID; //courseID из URL
    return {
        lesson: getLesson(state, lessonID),
        isLoading: getLoadingCourses(state),
    }
}

//withRouter достпупен в mapStateToProps
export default withRouter(connect(mapStateToProps, { requestCourseModules })(LessonContent));