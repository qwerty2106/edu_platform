import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'
import { withAuthRedirect } from './hoc/withAuthRedirect.js';
import { logOut } from './redux/auth-reducer.js';
import { connect, useDispatch } from 'react-redux';
import { getUser } from './redux/auth-selectors.js';


const AppContainer = (props) => {
    const dispatch = useDispatch();
    return (
        <Container fluid className='d-flex flex-column p-0' style={{ height: '100vh' }} data-bs-theme="dark" >
            {/* Navbar */}
            <Navbar bg="dark" expand="sm" className='flex-shrink-0'>
                <Container>
                    <Navbar.Brand>Logo</Navbar.Brand>
                    <Navbar.Collapse className='justify-content-end mx-4'>
                        <Navbar.Text>Hello, {props.user ? props.user.username : ''}!</Navbar.Text>
                    </Navbar.Collapse>
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

const mapStateToProps = (state) => {
    return {
        user: getUser(state)
    }
}

export default connect(mapStateToProps)(withAuthRedirect(AppContainer)); 