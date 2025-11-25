
import React from "react";
import { Navigate } from "react-router-dom";

//HOC проверки доступа пользователя к списку работ
export const withWorkListRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        render() {
            const { user } = this.props;
            const { userID } = this.props.router.params;
            if (userID != user.id)
                return <Navigate to={`/app/works/${user.id}`} replace />
            return <Component{...this.props} />;
        }
    }
    return RedirectComponent;
}




