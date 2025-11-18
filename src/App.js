import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Container, Spinner } from "react-bootstrap";
import Courses from "./components/Course/CourseComponent.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContainer from "./AppContainer";
import CourseContent from "./components/Course/CourseContent.jsx";
import Login from "./components/Login/Login";
import Landing from "./components/Landing";
import React from "react";
import { initializeApp, listenNotify } from "./redux/app-reducer";
import { getInitialized, getNotify } from "./redux/app-selectors";
import { connect } from "react-redux";
import RequestResetForm from "./components/Login/RequestResetForm";
import ResetForm from "./components/Login/ResetForm";
import Rooms from "./components/Chat/Room";
import Chat from "./components/Chat/Chat";
import Notify from "./common/Notify.jsx";
import Profile from "./components/Profile/Profile.jsx";
import LessonComponent from "./components/Course/Lesson/LessonComponent.jsx";
import WorkContainer from "./components/Work/WorkContainer.jsx";
import WorkContent from "./components/Work/WorkContent.jsx";

class App extends React.Component {
  componentDidMount() {
    this.props.initializeApp();
    this.props.listenNotify();
  }

  render() {
    if (!this.props.initialized)
      return (
        <Container fluid className='d-flex justify-content-center align-items-center bg-dark' style={{ height: "100vh" }}>
          <Spinner animation='border' variant='light'></Spinner>
        </Container>
      )

    return (
      <>
        <Notify notify={this.props.notify} />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/request-reset' element={<RequestResetForm />} />
            <Route path='/auth/reset' element={<ResetForm />} />
            <Route path='*' element={<h1>Not Found</h1>} />

            <Route path='/app' element={<AppContainer />}>
              <Route index element={<Courses />} />
              <Route path='courses' element={<Courses />} />
              <Route path='works' element={<WorkContainer />} />
              <Route path='works/:userID/:lessonID' element={<WorkContent />} />
              <Route path='lessons/:lessonID' element={<LessonComponent />} />
              <Route path='courses/:courseID' element={<CourseContent />} />
              <Route path='profile/:userID' element={<Profile />} />
              <Route path='chats' element={<Rooms />} />
              <Route path='chats/:chatID' element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    initialized: getInitialized(state),
    notify: getNotify(state),
  }
}

export default connect(mapStateToProps, { initializeApp, listenNotify })(App);
