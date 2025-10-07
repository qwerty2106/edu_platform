import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { getLoadingUser, getUser } from "../redux/auth-selectors";

//HOC проверки авторизации (запрет на рутинг)
export const withAuthRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        render() {
            //Пользователь не авторизован -> редирект на форму с логином
            if (!this.props.user)
                return <Navigate to={"/login"} replace />
            //Пользователь авторизован -> отображение текущего компонента
            return <Component{...this.props} />;
        }
    }

    const mapStateToProps = (state) => ({ user: getUser(state), isLoading: getLoadingUser(state) });
    return connect(mapStateToProps)(RedirectComponent);
}




