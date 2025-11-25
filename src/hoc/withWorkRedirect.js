import React from "react";
import { Navigate } from "react-router-dom";

//HOC проверки доступа пользователя к работе
export const withWorkRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        render() {
            const { user } = this.props;
            const { userID } = this.props.router.params;

            if (user.role === "student" && userID != user.id)
                return <Navigate to={`/app/works/${user.id}`} replace />
            
            // if (user.role === "teacher")
            
            return <Component{...this.props} />;
        }
    }
    return RedirectComponent;
}




