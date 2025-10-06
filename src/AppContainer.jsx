import React from 'react';
import { Container, Navbar, Spinner } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'
import { setUser } from './redux/auth-reducer.js';
import { connect } from 'react-redux';
import { getInitialized } from './redux/app-selectors.js';
import { initializeApp } from './redux/app-reducer.js';

class AppContainer extends React.Component {
    componentDidMount() {
        this.props.initializeApp();
    }
    render() {
        console.log('render init: ', this.props.initialized);
        if (!this.props.initialized)
            return (
                <Container fluid className='d-flex justify-content-center align-items-center bg-dark' style={{ height: "100vh" }}>
                    <Spinner animation='border' variant='light'></Spinner>
                </Container>
            )
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

const mapStateToProps = (state) => {
    return {
        initialized: getInitialized(state),
    }
}

export default connect(mapStateToProps, { setUser, initializeApp })(AppContainer) 