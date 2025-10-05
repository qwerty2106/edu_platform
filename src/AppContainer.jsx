import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'
import { setUser } from './redux/auth-reducer.js';
import { connect } from 'react-redux';

class AppContainer extends React.Component {
    componentDidMount() {
        const storedUserData = localStorage.getItem('user');
        //Данные есть в localStorage -> загружаем в state
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);  //Из строки в объект  
            this.props.setUser(userData);
        }
    }
    render() {
        return (
            <Container fluid className='d-flex flex-column p-0' style={{ height: '100vh' }} data-bs-theme="dark" >
                {/* Navbar */}
                <Navbar bg="dark" className='flex-shrink-0'>
                    <Container>
                        <Navbar.Brand>Logo</Navbar.Brand>
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
}

export default connect(null, { setUser })(AppContainer) 