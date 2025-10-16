import { useEffect } from "react";
import { Slide, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Notify = (props) => {
    useEffect(() => {
        if (Object.keys(props.notify).length === 0) return;
        switch (props.notify.status) {
            case 'info':
                toast.info(props.notify.message, { transition: Slide })
                break;
            case 'success':
                toast.success(props.notify.message, { transition: Slide })
                break;
            case 'error':
                toast.error(props.notify.message, { transition: Slide })
                break;
        }
    }, [props.notify]);

    return <ToastContainer hideProgressBar={true} autoClose={2000} />
};

export default Notify;