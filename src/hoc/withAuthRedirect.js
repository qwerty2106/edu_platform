import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Spinner } from "react-bootstrap";
import { getUser } from "../redux/auth-selectors";

//HOC проверки авторизации (запрет на рутинг)
export const withAuthRedirect = (Component) => {

    class RedirectComponent extends React.Component {
        render() {
            // if (this.props.isLoading)
            //     return (
            //         <Container className='d-flex justify-content-center align-items-center h-100'>
            //             <Spinner animation='border' variant='primary'></Spinner>
            //         </Container>
            //     )
            //Пользователь не авторизован -> редирект на форму с логином
            if (!this.props.user)
                return <Navigate to={"/login"} />
            //Пользователь авторизован -> отображение текущего компонента
            return <Component{...this.props} />;
        }
    }

    const mapStateToProps = (state) => getUser(state);
    return connect(mapStateToProps)(RedirectComponent);
}




