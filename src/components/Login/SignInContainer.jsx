import React from "react";
import { connect } from "react-redux";
import { signIn } from "../../redux/auth-reducer";
import { useForm } from "react-hook-form";

//Вход
const SignIn = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

    //Вход 
    const onSubmit = (data) => {
        props.signIn(data.username, data.password)
    }

    return (
        <div className="w-25 bg-white rounded-3 text-dark d-flex justify-content-center align-items-center flex-column p-4" >
            <h1 className="my-3">Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-100 align-items-center">

                <input {...register("username", {
                    required: { value: true, message: "This field is required" },
                    validate: (value) => value.trim() !== '' || "This field is required"
                })} type="text" className={`form-control my-2 ${errors.username ? "is-invalid" : ""}`} placeholder="Enter your name..." />

                {/* Ошибка */}
                <div className="invalid-feedback">
                    {errors.username && <p>{errors.username.message}</p>}
                </div>

                <input {...register("password", {
                    required: { value: true, message: "This field is required" },
                    validate: (value) => value.trim() !== '' || "This field is required"
                })} type="password" className={`form-control my-2 ${errors.password ? "is-invalid" : ""}`} placeholder="Enter your password..." />


                {/* Ошибка */}
                <div className="invalid-feedback">
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary btn-sm my-2 w-50">Sign In</button>
            </form>
        </div>
    )
}

class SignInContainer extends React.Component {
    render() {
        return <SignIn {...this.props} signIn={this.props.signIn} />
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps, { signIn })(SignInContainer);