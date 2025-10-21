import { InputGroup, Container, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form"
import { getUser } from "../../redux/auth-selectors";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { sendMessage } from "../../redux/chat-reducer";

const Input = (props) => {
    const { chatID } = useParams();
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    // Отправка сообщения
    const onSubmit = (data) => {
        dispatch(sendMessage(data.message, user.username, chatID));
    }

    return (
        <Container fluid className="bg-dark p-3 text-white rounded-3">
            <Form className="d-flex gap-2" onSubmit={handleSubmit(onSubmit)}>
                <InputGroup size="sm">
                    <InputGroup.Text>{user.username}</InputGroup.Text>
                    <Form.Control type="text" placeholder="Type something..." {...register("message", { required: true, validate: (value) => value.trim() !== '' })}></Form.Control>
                </InputGroup>
                <Button size="sm" variant="primary" type="submit">Send</Button>
            </Form>
        </Container>
    )
}



export default Input;