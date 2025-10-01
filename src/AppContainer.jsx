import React from 'react';
import { Col, Container, Row, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'

class AppContainer extends React.Component {
    render() {
        return (
            <Container fluid style={{ height: '100vh' }} data-bs-theme="dark">
                {/* Navbar */}
                <Row>
                    <Navbar bg="dark">
                        <Container>
                            <Navbar.Brand>Logo</Navbar.Brand>
                        </Container>
                    </Navbar>
                </Row>
                <Row>
                    {/* Sidebar */}
                    <Sidebar />
                    {/* Content */}
                    <Col className='p-3'>
                        {/* Отрисовка активного маршрута */}
                        <Outlet />
                    </Col>
                </Row >
            </Container >
        )
    }
}

export default AppContainer