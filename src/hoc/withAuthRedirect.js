import React from "react";
import { setUser } from "../redux/auth-reducer";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

export const withAuthRedirect = (Component) => {

    class RedirectComponent extends React.Component {
        render() {
            //Пользователь не авторизован -> редирект на форму с логином
            if (!this.props.user)
                return <Navigate to={"/login"} />
            //Пользователь авторизован -> отображение текущего компонента
            return <Component{...this.props} />;
        }
    }

    const mapStateToProps = (state) => ({ user: state.auth.user });

    return connect(mapStateToProps)(RedirectComponent);
}




