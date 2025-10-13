import { InputGroup, Container, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form"

const Input = (props) => {
    const { register, handleSubmit } = useForm()

    // Отправка сообщения
    const onSubmit = (data) => {
        // props.sendMessage(data.message)
    }

    return (
        <Container fluid className="bg-dark p-3 text-white">
            <Form className="d-flex gap-2" onSubmit={handleSubmit(onSubmit)}>
                <InputGroup size="sm">
                    <InputGroup.Text>{props.username}</InputGroup.Text>
                    <Form.Control type="text" placeholder="Type something..." {...register("message", { required: true, validate: (value) => value.trim() !== '' })}></Form.Control>
                </InputGroup>
                <Button size="sm" variant="primary" type="submit">Send</Button>
            </Form>
        </Container>
    )
}
export default Input