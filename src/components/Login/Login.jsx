import React, { useState } from "react"
import { connect } from "react-redux"
import SignInContainer from "./SignIn"
import SignUpContainer from "./SignUp"
import { Navigate } from "react-router-dom"

const Login = (props) => {
    //Смена формы входа/регистрации
    const [currentForm, setCurrentForm] = useState('signIn');
    const onSetCurrentForm = (currentForm) => setCurrentForm(currentForm);

    return (
        <div className="d-flex flex-column h-100">
            <div className="d-flex gap-3 justify-content-end p-2">
                <button className="btn btn-primary" onClick={() => onSetCurrentForm('signIn')}>Sign In</button>
                <button className="btn btn-primary" onClick={() => onSetCurrentForm('signUp')}>Sign Up</button>
            </div>
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                {currentForm === 'signIn' ? <SignInContainer /> : <SignUpContainer />}
            </div>
        </div>
    )
}

class LoginContainer extends React.Component {
    render() {
        if (this.props.user)
            return <Navigate to={"/app"} replace />
        return (
            <div className="container-fluid bg-dark d-flex flex-column" style={{ height: '100vh' }}>
                <Login />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.user,

    }
}


export default connect(mapStateToProps, null)(LoginContainer) 