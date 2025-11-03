import { connect } from "react-redux"
import { getUser } from "../../redux/auth-selectors"
import React from "react"
import { Container, Image, ProgressBar } from "react-bootstrap"
import { PersonFill } from 'react-bootstrap-icons';
import { requestUserProgress } from "../../redux/profile-reducer";
import { getProfileLoading, getUserProgress } from "../../redux/profile-selector";
import Preloader from "../../common/Preloader";
import withRouter from "../../common/WithRouter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = (props) => {
    const data = {
        labels: props.activity.map((data) => {
            const date = new Date(data.completed_date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [
            {
                label: 'activity',
                data: props.activity.map((data) => data.lessons_count),
                lineTension: 0.5,
                backgroundColor: '#9F7AEA',
                borderColor: '#9F7AEA',
                pointBorderColor: '#B57295',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#D6BCFA',
                pointHoverBorderColor: '#D6BCFA',
                pointRadius: 3,
            }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    }
    return (
        <div className="d-flex flex-column align-items-center w-100">
            <h4>Line Activity Chart</h4>
            <div style={{ width: '100%', height: '200px' }}>
                <Line data={data} options={options} key={props.userID} />
            </div>

        </div>
    )
}


const Profile = (props) => {
    const userProgressElements = props.userProgress.statistics.map(userProgress => <UserProgress key={userProgress.id} img={userProgress.img} title={userProgress.title} percent={userProgress.completion_percent} />)
    return (
        <Container fluid className="p-1" style={{ height: "100vh" }}>
            <div className="d-flex">
                <div className="w-75 d-flex flex-column gap-5">
                    <div className="bg-dark rounded-3 p-3 text-white">
                        <h2>Hello {props.user.username}!</h2>
                        <p>It's good to see you again.</p>
                    </div>
                    <div>
                        <LineChart activity={props.userProgress.activity} userID={props.user.id} />
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