import { Button, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";

const LessonInfo = (props) => {
    const navigate = useNavigate();
    return (
        <Tab.Pane eventKey={props.module_id} className="mb-3 bg-dark text-white p-3 rounded">
            <div className="d-flex flex-column">
                <div className="fw-bold d-flex align-items-center gap-2">
                    <span>Урок {props.order_index}</span>
                    {props.is_completed ? <CheckCircleFill style={{ color: 'green' }} /> : null}
                </div>
                <span className="small">«{props.title}»</span>
                <small className="text-muted fst-italic my-1">{props.lesson_type}</small>
                <Button size="sm align-self-start mt-1" onClick={() => navigate(`/app/lessons/${props.id}`)} style={{ cursor: "pointer" }}>Перейти</Button>
            </div>
        </Tab.Pane>
    )
}

export default LessonInfo;