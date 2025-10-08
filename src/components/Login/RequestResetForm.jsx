import React from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { Container, Spinner } from "react-bootstrap";
import isEmail from "validator/lib/isEmail";
import { requestPasswordReset } from "../../redux/auth-reducer";
import Notify from "../common/Notify";

//Вход
const RequestResetForm = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

    const onSubmit = (data) => {
        props.requestPasswordReset(data.email);
    }

    return (
        <div className="w-25 bg-white rounded-3 text-dark d-flex justify-content-center align-items-center flex-column p-4" >
            <h1 className="my-3">Password Reset</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-100 align-items-center">

                <input {...register("email", {
                    required: { value: true, message: "This field is required" },
                    validate: {
                        isNotEmpty: (value) => value.trim() !== '' || "This field is required",
                        isValidEmail: (value) => isEmail(value) || "Enter a valid email",
                    }
                })} type="email" className={`form-control my-2 ${errors.email ? "is-invalid" : ""}`} placeholder="Enter your email..." />

                {/* Ошибка */}
                <div className="invalid-feedback">
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={props.isLoading} className="btn btn-primary btn-sm my-2 w-50">
                    {props.isLoading ? <Spinner size="sm" /> : 'Send'}
                </button>
            </form>
        </div>
    )
}

class RequestResetFormContainer extends React.Component {
    //Генерация уведомления 
    setNotifyText(status) {
        switch (status) {
            case 'pending':
                return 'Sending message...';
            case 'success':
                return 'Message sent successfully';
            case 'error':
                return 'Error sending message';
            default:
                return null;
        }
    }
    render() {
        const notifyText = this.setNotifyText(this.props.requestResetStatus);
        return (
            <>
                {/* Уведомление */}
                {notifyText && <Notify text={notifyText} />}
                < Container fluid className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '100vh' }
                }>
                    <RequestResetForm {...this.props} />
                </Container >
            </>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        isLoading: state.auth.isLoading,
        requestResetStatus: state.auth.requestResetStatus,
    }
}

export default connect(mapStateToProps, { requestPasswordReset })(RequestResetFormContainer);