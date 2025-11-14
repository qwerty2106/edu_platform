import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Container, Spinner } from "react-bootstrap";
import Courses from "./components/Courses";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContainer from "./AppContainer";
import CourseModules from "./components/CourseModules";
import Login from "./components/Login/Login";
import Landing from "./components/Landing";
import React from "react";
import { initializeApp, listenNotify } from "./redux/app-reducer";
import { getInitialized, getNotify } from "./redux/app-selectors";
import { connect } from "react-redux";
import RequestResetForm from "./components/Login/RequestResetForm";
import ResetForm from "./components/Login/ResetForm";
import LessonContent from "./components/LessonContent";
import Rooms from "./components/Chat/Room";
import Chat from "./components/Chat/Chat";
import Notify from "./common/Notify.jsx";
import Profile from "./components/Profile/Profile.jsx";

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
              <Route path='lessons/:lessonID' element={<LessonContent />} />
              <Route path='courses/:courseID' element={<CourseModules />} />
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
