import { Button, Container, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'
import { withAuthRedirect } from './hoc/withAuthRedirect.js';
import { logOut } from './redux/auth-reducer.js';
import { connect, useDispatch } from 'react-redux';
import { getUser } from './redux/auth-selectors.js';


const AppContainer = (props) => {
    const dispatch = useDispatch();
    return (
        <div className='d-flex flex-column vh-100' data-bs-theme="dark" style={{ overflow: "hidden" }}>
            {/* Navbar */}
            <Navbar bg="dark" expand="sm" className='flex-shrink-0'>
                <Container>
                    <Navbar.Brand>Logo</Navbar.Brand>
                    <Navbar.Collapse className='justify-content-end mx-4'>
                        <Navbar.Text>Привет, {props.user ? props.user.username : ''}!</Navbar.Text>
                    </Navbar.Collapse>
                    <Button variant='danger' onClick={() => dispatch(logOut())}>Выйти</Button>
                </Container>
            </Navbar>

            <div className='d-flex flex-grow-1' style={{ minHeight: 0 }}>
                {/* Sidebar */}
                <Sidebar />
                {/* Content */}
                <div className='flex-grow-1 p-3' style={{ minHeight: 0, overflowY: "auto" }}>
                    {/* Отрисовка активного маршрута */}
                    <Outlet />
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        user: getUser(state)
    }
}

export default connect(mapStateToProps)(withAuthRedirect(AppContainer)); 