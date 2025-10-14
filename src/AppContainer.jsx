import { Button, Container, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'
import { withAuthRedirect } from './hoc/withAuthRedirect.js';
import { logOut } from './redux/auth-reducer.js';
import { useDispatch } from 'react-redux';


const AppContainer = (props) => {
    const dispatch = useDispatch();
    return (
        <Container fluid className='d-flex flex-column p-0' style={{ height: '100vh' }} data-bs-theme="dark" >
            {/* Navbar */}
            <Navbar bg="dark" className='flex-shrink-0'>
                <Container>
                    <Navbar.Brand>Logo</Navbar.Brand>
                    <Button className='btn btn-danger' onClick={() => dispatch(logOut())}>Log out</Button>
                </Container>
            </Navbar>

            <div className='d-flex flex-grow-1' style={{ minHeight: 0 }}>
                {/* Sidebar */}
                <Sidebar />
                {/* Content */}
                <div className='flex-grow-1 p-3' style={{ minHeight: 0, overflow: "hidden" }}>
                    {/* Отрисовка активного маршрута */}
                    <Outlet />
                </div>
            </div>
        </Container >
    )
}

export default withAuthRedirect(AppContainer); 