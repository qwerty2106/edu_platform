import React from "react";
import { connect } from "react-redux";
import { getLesson, getLoadingCourses } from "../redux/courses-selectors";
import withRouter from "../common/WithRouter";
import { requestCourseModules } from "../redux/courses-reducer";
import Preloader from "../common/Preloader";
import "prism-themes/themes/prism-ghcolors.css";
import { getUser } from "../redux/auth-selectors";
import Lesson from "./Lessson";

class LessonContent extends React.Component {
    componentDidMount() {
        //Загрузка модулей и уроков при обновлении страницы в state
        const courseID = this.props.router.params.courseID;
        this.props.requestCourseModules(courseID, this.props.user.id);
    }
    render() {
        //Загрузка урока 
        if (this.props.isLoading)
            return <Preloader />
        return (
            <div className="" style={{height: '100vh'}}>
                <Lesson {...this.props} />
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const lessonID = ownProps.router.params.lessonID; //courseID из URL
    return {
        lesson: getLesson(state, lessonID),
        isLoading: getLoadingCourses(state),
        user: getUser(state),
    }
}

//withRouter доступен в mapStateToProps
export default withRouter(connect(mapStateToProps, { requestCourseModules })(LessonContent));