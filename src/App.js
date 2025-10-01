import 'bootstrap/dist/css/bootstrap.min.css';
import CourseContainer from './components/CourseContainer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppContainer from './AppContainer';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppContainer />}>
          <Route path='courses' element={<CourseContainer />} />
          <Route path='profile' element={<h1>Profile</h1>} />
          <Route path='chat' element={<h1>Chat</h1>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
