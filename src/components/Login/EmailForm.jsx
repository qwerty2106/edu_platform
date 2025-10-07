import React from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import isEmail from "validator/lib/isEmail";
import { requestPasswordReset } from "../../redux/auth-reducer";

//Вход
const EmailForm = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

    const onSubmit = (data) => {
        props.requestPasswordReset(data.email);
    }

    return (
        <div className="w-25 bg-white rounded-3 text-dark d-flex justify-content-center align-items-center flex-column p-4" >
            <h1 className="my-3">Password recovery</h1>
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

class EmailFormContainer extends React.Component {
    render() {
        return <EmailForm {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return {
        resetStatus: state.auth.resetStatus,
        isLoading: state.auth.isLoading
    }
}

export default connect(mapStateToProps, { requestPasswordReset })(EmailFormContainer);