import { connect } from "react-redux"
import { getUser } from "../../redux/auth-selectors"
import React from "react"
import { Container, Image, ProgressBar } from "react-bootstrap"
import { PersonFill, Book } from 'react-bootstrap-icons';
import { requestUserProgress } from "../../redux/profile-reducer";
import { getProfileLoading, getUserProgress } from "../../redux/profile-selector";
import Preloader from "../../common/Preloader";
import withRouter from "../../common/WithRouter";

const UserProgress = (props) => {
    return (
        <div className="bg-dark rounded-3 text-white p-2 d-flex align-items-center gap-3">
            <Image src={props.img} style={{ objectFit: 'cover', width: '50px', height: '50px' }} />
            <div className="d-flex flex-column">
                <h6 className="m-0">{props.title}</h6>
                <ProgressBar variant="success" now={props.percent} label={`${props.percent}%`} />
            </div>
        </div>
    )
}

const LineChart = (props) => {
    const data = {
        //labels:
        dataset: [
            {
                label: 'activity',
                //data
            }
        ]

    }
}


const Profile = (props) => {
    const userProgressElements = props.userProgress.map(userProgress => <UserProgress key={userProgress.id} img={userProgress.img} title={userProgress.title} percent={userProgress.completion_percent} />)
    return (
        <Container fluid className="p-1" style={{ height: "100vh" }}>
            <div className="d-flex">
                <div className="w-75 d-flex flex-column gap-5">
                    <div className="bg-dark rounded-3 p-3 text-white">
                        <h2>Hello {props.user.username}!</h2>
                        <p>It's good to see you again.</p>
                    </div>
                    <div>
                        <h4>Courses</h4>
                        {userProgressElements}
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center flex-grow-1 p-1">
                    {props.user.img ? <Image src={props.user.img} alt="" rounded style={{ objectFit: 'cover', width: '150px', height: '150px' }} />
                        : <PersonFill style={{ width: '150px', height: '150px' }} />}
                    <h2>{props.user.username}</h2>
                    <span>{props.user.email}</span>
                    <span>Joined {props.user.created_date}</span>
                </div>
            </div>
        </Container>
    )
}

class ProfileContainer extends React.Component {
    componentDidMount() {
        const userID = this.props.router.params.userID;
        this.props.requestUserProgress(userID);
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />
        return <Profile {...this.props} />
    }
}


const mapStateToProps = (state) => {
    return {
        user: getUser(state),
        isLoading: getProfileLoading(state),
        userProgress: getUserProgress(state),
    }
}

export default connect(mapStateToProps, { requestUserProgress })(withRouter(ProfileContainer));