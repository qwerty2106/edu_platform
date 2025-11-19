import { connect, useDispatch } from "react-redux";
import { requestCheckWork, requestCurrentWork } from "../../redux/works-reducer";
import withRouter from "../../common/WithRouter";
import Preloader from "../../common/Preloader";
import { getCurrentWork, getWorksLoading } from "../../redux/works-selector";
import React, { useEffect, useState } from "react";
import { Badge, Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const WorkContent = (props) => {
    const { userID, lessonID } = useParams();
    const currentWork = props.currentWork;
    const [status, setStatus] = useState(currentWork.status);
    const [text, setText] = useState('');

    useEffect(() => {
        setStatus(currentWork.status);
    }, [currentWork.status])

    const onChangeHandle = (eventKey) => {
        if (eventKey === '1') {
            setStatus(currentWork.status);
        }
        else {
            const newStatus = currentWork.status === 'Проверено' ? 'На проверке' : 'Проверено';
            setStatus(newStatus);
        }
    }

    const onClickHandle = () => {
        props.requestCheckWork(userID, lessonID, status, text);
    }

    return (
        <div>
            <h2>Информация о работе</h2>

            <div className="d-flex flex-column gap-3">
                <div>
                    <p className="mb-0 fw-bold">Статус:</p>
                    <Badge bg={currentWork.status === 'Проверено' ? 'success' : 'warning'}>{currentWork.status}</Badge>
                </div>

                <div>
                    <p className="mb-0 fw-bold">Отправлено:</p>
                    <span>{new Date(currentWork.created_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {currentWork.comment_student ?
                    <div>
                        <p className="mb-0 fw-bold">Комментарий к заданию:</p>
                        <span>{currentWork.comment_student}</span>
                    </div> : null}

                <div>
                    <p className="mb-0 fw-bold">Скачать работу:</p>
                    <a href={currentWork.content_path} download>
                        <Button variant="primary">Скачать</Button>
                    </a>

                </div>

                <div>
                    <p className="mb-0 fw-bold">Изменить статус:</p>
                    <DropdownButton title={status} variant='dark' onSelect={onChangeHandle}>
                        <Dropdown.Item eventKey='1' active={status === currentWork.status}>{currentWork.status}</Dropdown.Item>
                        <Dropdown.Item eventKey='2' active={status !== currentWork.status}>{currentWork.status === 'Проверено' ? 'На проверке' : 'Проверено'}</Dropdown.Item>
                    </DropdownButton>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Напишите комментарий к заданию (не обязательно)</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Введите текст..." onChange={(e) => setText(e.target.value)} />
                </Form.Group>


            </div>
            <Button variant="success" className="mt-3" onClick={onClickHandle}>Сохранить</Button>
        </div>
    )
}

class WorkContentComponent extends React.Component {
    componentDidMount() {
        const { userID, lessonID } = this.props.router.params;
        this.props.requestCurrentWork(userID, lessonID);
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
    }
}

export default connect(mapStateToProps, { requestCurrentWork, requestCheckWork })(withRouter(WorkContentComponent));