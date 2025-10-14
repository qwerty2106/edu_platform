import { Navigate, useParams } from "react-router-dom";

//HOC проверки доступа пользователя к комнате
export const withChatRedirect = (Component) => {
    const RedirectComponent = (props) => {
        const { chatID } = useParams();
        const room = props.rooms.find(room => room.id == chatID)
        //Пользователь не состоит в чате -> редирект на список чатов
        if (!room)
            return <Navigate to={'/app/chats'} replace />
        return <Component {...props} />;
    }
    return RedirectComponent;
}




