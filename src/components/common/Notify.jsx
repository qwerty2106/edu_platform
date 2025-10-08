import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";

const Notify = (props) => {
    const [showNotify, setShowNotify] = useState(true);
    const toggleShowNotify = () => setShowNotify(!showNotify);
    return (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            <Toast show={showNotify} delay={3000} autohide onClose={toggleShowNotify}>
                <Toast.Header>
                    <BellFill className="rounded me-2" />
                    <strong className="me-auto">Notification</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>{props.text}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}


export default Notify;