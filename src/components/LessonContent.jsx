import React from "react";
import { connect } from "react-redux";
import { getCurrentLesson, getLoadingCourses } from "../redux/courses-selectors";
import withRouter from "../common/WithRouter";
import { requestCurrentLesson } from "../redux/courses-reducer";
import Preloader from "../common/Preloader";
import "prism-themes/themes/prism-ghcolors.css";
import Lesson from "./Lessson";

class LessonContent extends React.Component {
    componentDidMount() {
        //Загрузка урока в state
        const { lessonID } = this.props.router.params;
        this.props.requestCurrentLesson(lessonID);
    }
    render() {
        //Загрузка урока 
        if (this.props.isLoading)
            return <Preloader />
        return (
            <div className="" style={{ height: '100vh' }}>
                <Lesson lesson={this.props.lesson} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lesson: getCurrentLesson(state),
        isLoading: getLoadingCourses(state),
    }
}

//withRouter доступен в mapStateToProps
export default withRouter(connect(mapStateToProps, { requestCurrentLesson })(LessonContent));