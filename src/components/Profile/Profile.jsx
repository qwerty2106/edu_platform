import { connect } from "react-redux"
import { getUser } from "../../redux/auth-selectors"
import React from "react"
import { Container, Image, ProgressBar } from "react-bootstrap"
import { PersonFill } from 'react-bootstrap-icons';
import { requestUserProgress, setCurrentPage } from "../../redux/profile-reducer";
import { getCoursesCount, getCurrentPage, getProfileLoading, getUserCompletionStats, getUserProgress } from "../../redux/profile-selector";
import Preloader from "../../common/Preloader";
import withRouter from "../../common/WithRouter";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import MyPagination from "../../common/Pagination";

const UserProgress = (props) => {
    const navigate = useNavigate();
    return (
        <div className="bg-dark rounded-3 text-white p-2 d-flex align-items-center gap-3">
            <Image src={props.img} style={{ objectFit: 'cover', width: '50px', height: '50px' }} />
            <div className="d-flex gap-3 justify-content-between flex-grow-1 align-items-center px-3">
                <h6 className="m-0">{props.title}</h6>
                <ProgressBar variant="success" now={props.percent} label={`${props.percent}%`} style={{ width: '50%' }} />
                <button className="btn btn-primary" onClick={() => navigate(`/app/courses/${props.id}`)}>Learn</button>
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
                label: 'Tasks count done per day',
                data: props.activity.map((data) => data.lessons_count),
                lineTension: 0.5,
                backgroundColor: '#332D2D',
                borderColor: '#332D2D',
                pointBorderColor: '#DC4C64',
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#DC4C64',
                pointHoverBorderColor: '#332D2D',
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
    const userProgressElements = props.userProgress.statistics.map(userProgress => <UserProgress key={userProgress.id} id={userProgress.id} img={userProgress.img} title={userProgress.title} percent={userProgress.completion_percent} />)
    return (
        <Container fluid className="p-1" style={{ height: "100vh" }}>
            <div className="d-flex">
                <div className="w-75 d-flex flex-column gap-3">
                    <div className="bg-dark rounded-3 p-3 text-white">
                        <h2>Hello {props.user.username}!</h2>
                        <p>It's good to see you again.</p>
                    </div>
                    <div className="d-flex gap-3 w-50">
                        <div className="d-flex w-50 bg-dark text-white justify-content-center align-items-center gap-3 p-3 rounded-3">
                            <h1>{props.userCompletionStats.completedCount}</h1>
                            <h6>Courses<br />completed</h6>
                        </div>
                        <div className="d-flex w-50 bg-dark text-white justify-content-center align-items-center gap-3 p-3 rounded-3">
                            <h1>{props.userCompletionStats.inProcessCount}</h1>
                            <h6>Courses<br />in progress</h6>
                        </div>
                    </div>
                    <div>
                        <LineChart activity={props.userProgress.activity} userID={props.user.id} />
                    </div>
                    <div>
                        <h4>Courses</h4>
                        <MyPagination itemsCount={props.coursesCount} pageSize={props.pageSize} currentPage={props.currentPage} onPageChange={props.handlePageChange} />
                        <div className="d-flex flex-column gap-2">
                            {userProgressElements}
                        </div>

                    </div>
                </div>
                <div className="d-flex flex-column align-items-center flex-grow-1 p-1">
                    {props.user.img ? <Image src={props.user.img} alt="" rounded style={{ objectFit: 'cover', width: '150px', height: '150px' }} />
                        : <PersonFill style={{ width: '150px', height: '150px' }} />}
                    <h2>{props.user.username}</h2>
                    {/* <span>{props.user.email}</span> */}
                    <span>Joined {props.user.created_date}</span>
                </div>
            </div>
        </Container>
    )
}

class ProfileContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 2, page: 1 };
    }
    handlePageChange = (page) => {
        const userID = this.props.router.params.userID;
        this.props.setCurrentPage(page);
        this.props.requestUserProgress(userID, page, this.state.pageSize);
    }
    componentDidMount() {
        const userID = this.props.router.params.userID;
        this.props.requestUserProgress(userID, this.state.page, this.state.pageSize);
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />
        return <Profile {...this.props} pageSize={this.state.pageSize} handlePageChange={this.handlePageChange} />
    }
}


const mapStateToProps = (state) => {
    return {
        user: getUser(state),
        isLoading: getProfileLoading(state),
        userProgress: getUserProgress(state),
        userCompletionStats: getUserCompletionStats(state),
        currentPage: getCurrentPage(state),
        coursesCount: getCoursesCount(state),
    }
}

export default connect(mapStateToProps, { requestUserProgress, setCurrentPage })(withRouter(ProfileContainer));