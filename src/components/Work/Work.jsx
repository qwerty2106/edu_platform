import { Badge, Button, Col, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Work = (props) => {
    const navigate = useNavigate();
    return (
        <Row className="text-white bg-dark rounded p-3 align-items-center g-0 px-5" onClick={() => navigate(`/app/works/${props.user_id}/${props.lesson_id}`)} style={{ cursor: "pointer" }}>
            <Col className="d-flex gap-3 align-items-center" sm={4}>
                <Image
                    src={props.img}
                    roundedCircle
                    style={{ height: '60px', width: '60px', objectFit: "cover", border: props.status === 'Проверено' ? '2px solid #28a745' : '2px solid #ffc107' }}
                />
                <div>
                    <div className="fw-bold">{props.username}</div>
                    <small className="text-muted">Студент</small>
                </div>
            </Col>


            <Col className="d-flex flex-column gap-1">
                <span>«{props.title}»</span>
                <div>
                    <Badge bg={props.status === 'Проверено' ? 'success' : 'warning'}>
                        {props.status}
                    </Badge>
                </div>

            </Col>

            <Col className="d-flex justify-content-end" >
                <Button variant="primary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/works/${props.user_id}/${props.lesson_id}`)
                }}>Просмотреть</Button>
            </Col>
        </Row>
    )
}

export default Work;