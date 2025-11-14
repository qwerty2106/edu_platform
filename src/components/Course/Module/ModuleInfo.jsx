import { Nav } from "react-bootstrap";
import styles from "./ModuleInfo.module.css";
const ModuleInfo = (props) => {
    return (
        <Nav.Item>
            <Nav.Link eventKey={props.id} onClick={() => props.onClickHandle(props.id)} active={props.activeModule === props.id} className={props.activeModule === props.id ? styles.moduleActive : styles.module}>
                <span className="fw-bold">Модуль {props.order_index}: «{props.title}»</span>
                <div className="small">{props.description}</div>
            </Nav.Link>
        </Nav.Item>
    )
}

export default ModuleInfo;