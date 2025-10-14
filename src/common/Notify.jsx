import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Notify = (props) => {
    useEffect(() => {
        if (!props.notifies) return;
        props.notifies.forEach(notify => {
            switch (notify.status) {
                case 'info':
                    toast.info(notify.message)
                    break;
                case 'success':
                    toast.success(notify.message)
                    break;
                case 'error':
                    toast.error(notify.message)
                    break;
            }
        });
    }, [props.notifies]);

    return <ToastContainer />
};

export default Notify;