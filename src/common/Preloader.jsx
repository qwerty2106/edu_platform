import { Spinner } from "react-bootstrap";
const Preloader = () => {
    return (
        <div className='d-flex justify-content-center align-items-center w-100 min-vh-100'>
            <Spinner animation='border' variant='dark'></Spinner>
        </div>
    )
}
export default Preloader;