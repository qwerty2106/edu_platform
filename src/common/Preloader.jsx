import { Container, Spinner } from "react-bootstrap";
const Preloader = () => {
    return (
        <Container className='d-flex justify-content-center align-items-center h-100'>
            <Spinner animation='border' variant='dark'></Spinner>
        </Container>
    )
}
export default Preloader;