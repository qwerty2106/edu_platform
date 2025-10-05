import React, { useState } from "react"
import { connect } from "react-redux"
import SignInContainer from "./SignInContainer"
import SignUpContainer from "./SignUpContainer"

const Login = (props) => {
    //Смена формы входа/регистрации
    const [currentForm, setCurrentForm] = useState('signIn');
    const onSetCurrentForm = (currentForm) => setCurrentForm(currentForm);

    return (
        <div className="container-fluid bg-dark d-flex flex-column" style={{ height: '100vh' }}>
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
        return <Login />
    }
}
const mapStateToProps = (state) => {
    return {
        // user: state.auth.user
    }
}


export default connect(mapStateToProps, null)(LoginContainer) 