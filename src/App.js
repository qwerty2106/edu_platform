import 'bootstrap/dist/css/bootstrap.min.css';
import Courses from './components/Courses';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppContainer from './AppContainer';
import CourseModules from './components/CourseModules';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppContainer />}>
          <Route path='courses' element={<Courses />} />
          <Route path='courses/:courseID' element={<CourseModules />} />
          <Route path='profile' element={<h1>Profile</h1>} />
          <Route path='chat' element={<h1>Chat</h1>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
