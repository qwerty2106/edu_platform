import { Container } from "react-bootstrap"

const Message = (props) => {
    return (
        <Container fluid className="border p-2 rounded-3 bg-light d-flex gap-2">
            <span className="text-primary">{props.username}:</span>
            <span>{props.message}</span>
        </Container>
    )
}
export default Message