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
import styles from "./LessonComponent.module.css";


class LessonComponent extends React.Component {
    componentDidMount() {
        const { lessonID } = this.props.router.params;
        this.props.requestCurrentLesson(lessonID);
    }
    render() {
        const { isLoading, lesson } = this.props;
        if (isLoading)
            return <Preloader />

        return (
            <Tab.Container defaultActiveKey="lesson">
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link eventKey="lesson" className={styles.tabActive}>Теория</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="test">Тест</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="lesson"><LessonContent lesson={lesson} /></Tab.Pane>
                    <Tab.Pane eventKey="test"><LessonTest lesson={lesson} /></Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            // <Tabs defaultActiveKey='lesson' fill>
            //     <Tab eventKey='lesson' title='Теория' >
            //         <LessonContent lesson={lesson} />

            //     </Tab>
            //     <Tab eventKey='test' title='Тест'>
            //         <LessonTest lesson={lesson} />
            //     </Tab>
            // </Tabs>
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