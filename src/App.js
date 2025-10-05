import 'bootstrap/dist/css/bootstrap.min.css';
import Courses from './components/Courses';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppContainer from './AppContainer';
import CourseModules from './components/CourseModules';
import Login from './components/Login/Login';
import Landing from './components/Landing';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<h1>Not Found</h1>} />

        <Route path='/app' element={<AppContainer />}>
          <Route index element={<Courses />} />
          <Route path='courses' element={<Courses />} />
          <Route path='courses/:courseID' element={<CourseModules />} />
          <Route path='profile' element={<h1>Profile</h1>} />
          <Route path='chat' element={<h1>Chat</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
