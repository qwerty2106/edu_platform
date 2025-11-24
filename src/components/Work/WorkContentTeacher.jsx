import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const WorkContentTeacher = ({ currentWork, requestCheckWork }) => {
    const { userID, lessonID } = useParams();
    const [text, setText] = useState('');
    const [status, setStatus] = useState(currentWork.status);
    const [score, setScore] = useState(currentWork.score);

    useEffect(() => {
        setStatus(currentWork.status);
        setScore(currentWork.score);
    }, [currentWork.status, currentWork.score])

    const onChangeStatusHandle = (eventKey) => {
        if (eventKey === '1') {
            setStatus(currentWork.status);
        }
        else {
            const newStatus = currentWork.status === 'Проверено' ? 'На проверке' : 'Проверено';
            setStatus(newStatus);
        }
    }

    const onChangeScoreHandle = (eventKey) => {
        setScore(parseInt(eventKey, 10));
    }

    const onClickHandle = () => {
        requestCheckWork(userID, lessonID, status, text, score);
    }

    return (
        <>
            {currentWork.comment_student &&
                <div>
                    <p className="mb-0 fw-bold">Комментарий к заданию:</p>
                    <span>{currentWork.comment_student}</span>
                </div>
            }

            <div>
                <p className="mb-0 fw-bold">Скачать работу:</p>
                <a href={currentWork.content_path} download>
                    <Button variant="primary">Скачать</Button>
                </a>
            </div>

            <div>
                <p className="mb-0 fw-bold">Выставить баллы:</p>
                <DropdownButton title={score} variant='dark' onSelect={onChangeScoreHandle}>
                    <Dropdown.Item eventKey='0' active={score === 0}>0</Dropdown.Item>
                    <Dropdown.Item eventKey='1' active={score === 1}>1</Dropdown.Item>
                    <Dropdown.Item eventKey='2' active={score === 2}>2</Dropdown.Item>
                    <Dropdown.Item eventKey='3' active={score === 3}>3</Dropdown.Item>
                    <Dropdown.Item eventKey='4' active={score === 4}>4</Dropdown.Item>
                    <Dropdown.Item eventKey='5' active={score === 5}>5</Dropdown.Item>
                </DropdownButton>
            </div>

            <div>
                <p className="mb-0 fw-bold">Изменить статус:</p>
                <DropdownButton title={status} variant='dark' onSelect={onChangeStatusHandle}>
                    <Dropdown.Item eventKey='1' active={status === currentWork.status}>{currentWork.status}</Dropdown.Item>
                    <Dropdown.Item eventKey='2' active={status !== currentWork.status}>{currentWork.status === 'Проверено' ? 'На проверке' : 'Проверено'}</Dropdown.Item>
                </DropdownButton>
            </div>

            <Form.Group>
                <Form.Label>Напишите комментарий к заданию (не обязательно)</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Введите текст..." onChange={(e) => setText(e.target.value)} />
            </Form.Group>
            <Button variant="success" className="align-self-start" onClick={onClickHandle}>Сохранить</Button>
        </>
    )
}

export default WorkContentTeacher;