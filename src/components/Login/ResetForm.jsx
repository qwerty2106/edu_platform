import React from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { Container, Spinner } from "react-bootstrap";
import { passwordReset } from "../../redux/auth-reducer";
import withRouter from "../../common/WithRouter";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

//Вход
const ResetForm = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });
    const [searchParams] = useSearchParams(); //Берется первый элемент и переименовывается
    const resetToken = searchParams.get('token');
    const onSubmit = (data) => {
        props.passwordReset(resetToken, data.password);
    }

    return (
        <div className="w-25 bg-white rounded-3 text-dark d-flex justify-content-center align-items-center flex-column p-4" >
            <h1 className="my-3">Password Reset</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-100 align-items-center">

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

                <button type="submit" disabled={props.isLoading} className="btn btn-primary btn-sm my-2 w-50">
                    {props.isLoading ? <Spinner size="sm" /> : 'Send'}
                </button>
            </form>
        </div>
    )
}

class ResetFormContainer extends React.Component {
    render() {
        if (this.props.resetStatus === 'success')
            return <Navigate to={'/login'} replace/>
        return (
            <Container fluid className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <ResetForm {...this.props} />
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.auth.isLoading,
        resetStatus: state.auth.resetStatus
    }
}

export default connect(mapStateToProps, { passwordReset })(ResetFormContainer);