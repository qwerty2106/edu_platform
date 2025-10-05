import React from "react";
import { connect } from "react-redux";
import { signUp } from "../../redux/auth-reducer";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

//Регистрация
const SignUp = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

    //Регистрация 
    const onSubmit = (data) => {
        props.signUp(data.username, data.password)
    }

    return (
        <div className="w-25 bg-white rounded-3 text-dark d-flex justify-content-center align-items-center flex-column p-4" >
            <h1 className="my-3">Sign Up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-100 align-items-center">

                <input {...register("username", {
                    required: { value: true, message: "This field is required" },
                    maxLength: { value: 25, message: "The maximum length is 25" },
                    validate: (value) => value.trim() !== '' || "This field is required"
                })} type="text" className={`form-control my-2 ${errors.username ? "is-invalid" : ""}`} placeholder="Enter your name..." />

                {/* Ошибка */}
                <div className="invalid-feedback">
                    {errors.username && <p>{errors.username.message}</p>}
                </div>

                <input {...register("password", {
                    required: { value: true, message: "This field is required" },
                    minLength: { value: 5, message: "The minimum length is 5 and the maximum is 10" },
                    maxLength: { value: 10, message: "The minimum length is 5 and the maximum is 10" },
                    validate: (value) => value.trim() !== '' || "This field is required"
                })} type="password" className={`form-control my-2 ${errors.password ? "is-invalid" : ""}`} placeholder="Enter your password..." />

                {/* Ошибка */}
                <div className="invalid-feedback">
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary btn-sm my-2 w-50">Sign Up</button>
            </form>
        </div>
    )
}

class SignUpContainer extends React.Component {
    render() {
        return <SignUp {...this.props} signUp={this.props.signUp} />
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { signUp })(SignUpContainer);