import React from "react";
import { connect } from "react-redux";
import { getCurrentLesson, getLoadingCourses } from "../../../redux/courses-selectors";
import withRouter from "../../../common/WithRouter";
import { requestCurrentLesson } from "../../../redux/courses-reducer";
import Preloader from "../../../common/Preloader";
import "prism-themes/themes/prism-ghcolors.css";
import LessonInfo from "./LessonInfo";

class LessonComponent extends React.Component {
    componentDidMount() {
        const { lessonID } = this.props.router.params;
        this.props.requestCurrentLesson(lessonID);
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />

        return (
            <div style={{ height: '100vh' }}>
                <LessonInfo lesson={this.props.lesson} />
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
export default withRouter(connect(mapStateToProps, { requestCurrentLesson })(LessonComponent));