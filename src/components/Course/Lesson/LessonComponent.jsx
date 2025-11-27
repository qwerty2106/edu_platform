import React from "react";
import { connect } from "react-redux";
import { getCurrentLesson, getLoadingCourses } from "../../../redux/courses-selectors";
import withRouter from "../../../common/WithRouter";
import { requestCurrentLesson } from "../../../redux/courses-reducer";
import Preloader from "../../../common/Preloader";
import "prism-themes/themes/prism-ghcolors.css";
import LessonTest from './LessonTest';
import { Nav, Tab, } from "react-bootstrap";
import LessonContent from "./LessonContent";
import styles from '../../../styles.module.css';
import EmptyScreen from "../../../common/EmptyScreen";

class LessonComponent extends React.Component {
    async componentDidMount() {
        const { lessonID } = this.props.router.params;
        const result = await this.props.requestCurrentLesson(lessonID);
        if (!result.success && (result.error === 403 || result.error === 404))
            this.props.router.navigate('/app/courses', { replace: true });
    }
    render() {
        const { isLoading, lesson } = this.props;
        if (isLoading)
            return <Preloader />
        if (Object.keys(lesson) === 0 || lesson.content_path == null)
            return <EmptyScreen />

        return (
            <Tab.Container defaultActiveKey="lesson">
                <Nav variant="pills" className="w-100 pb-3">
                    <Nav.Item className="flex-fill text-center">
                        <Nav.Link eventKey="lesson" className={styles.navLinkOverride}>Теория</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill text-center">
                        <Nav.Link eventKey="test" className={styles.navLinkOverride}>Практика</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div style={{ height: 'calc(100vh - 150px)', overflowY: "auto" }}>
                    <Tab.Content>
                        <Tab.Pane eventKey="lesson">
                            <div className="p-2">
                                <LessonContent lesson={lesson} />
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="test">
                            <div className="p-2">
                                <LessonTest lesson={lesson} />
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lesson: getCurrentLesson(state),
        isLoading: getLoadingCourses(state),
    }
}

export default connect(mapStateToProps, { requestCurrentLesson })(withRouter(LessonComponent));