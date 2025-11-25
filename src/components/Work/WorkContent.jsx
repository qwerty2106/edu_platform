import { connect, useSelector } from "react-redux";
import { requestCheckWork, requestCurrentWork } from "../../redux/works-reducer";
import withRouter from "../../common/WithRouter";
import Preloader from "../../common/Preloader";
import { getCurrentWork, getWorksLoading } from "../../redux/works-selector";
import React from "react";
import { Badge } from "react-bootstrap";
import { getUser } from "../../redux/auth-selectors";
import WorkContentStudent from "./WorkContentStudent";
import WorkContentTeacher from "./WorkContentTeacher";

const WorkContent = ({ currentWork, requestCheckWork }) => {
    const user = useSelector(getUser);
    return (
        <div>
            <h2>Информация о работе</h2>

            <div className="d-flex flex-column gap-3">
                <div>
                    <p className="mb-0 fw-bold">Статус:</p>
                    <Badge bg={currentWork.status === 'Проверено' ? 'success' : 'warning'}>{currentWork.status}</Badge>
                </div>

                <div>
                    <p className="mb-0 fw-bold">Полученных баллов:</p>
                    <span>{currentWork.score}</span>
                </div>

                <div>
                    <p className="mb-0 fw-bold">Отправлено:</p>
                    <span>{new Date(currentWork.created_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {user.role === "student" && <WorkContentStudent currentWork={currentWork} />}
                {user.role === "teacher" && <WorkContentTeacher currentWork={currentWork} requestCheckWork={requestCheckWork} />}
            </div >
        </div >
    )
}

class WorkContentComponent extends React.Component {
    async componentDidMount() {
        const { userID, lessonID } = this.props.router.params;
        const result = await this.props.requestCurrentWork(userID, lessonID);

        if (!result.success && result.error === 403) {
            this.props.router.navigate(`/app/works/${userID}`, { replace: true });
        }
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />

        return <WorkContent currentWork={this.props.currentWork} requestCheckWork={this.props.requestCheckWork} />
    }
}

const mapStateToProps = (state) => {
    return {
        currentWork: getCurrentWork(state),
        isLoading: getWorksLoading(state),
        user: getUser(state),
    }
}

export default connect(mapStateToProps, { requestCurrentWork, requestCheckWork })(withRouter(WorkContentComponent));