import { Button, Modal } from "react-bootstrap";

const InstuctionModal = ({modalShow, setModalShow}) => {
    return (
        <Modal centered show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Инструкция по загрузке файла</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-1">
                        <h6>Допустимые форматы</h6>
                        <div className="d-flex gap-2">
                            <span className="badge bg-success">ZIP</span>
                            <span className="badge bg-success">RAR</span>
                            <span className="badge bg-success">7Z</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <h6>Как загрузить</h6>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-dark">1</span>
                            <span>Выберите файл или перетащите в область загрузки</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-dark">2</span>
                            <span>Дождитесь появления имени файла в интерфейсе</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-dark">3</span>
                            <span>Нажмите кнопку «Отправить»</span>
                        </div>
                    </div>
                    <div className="alert alert-warning">
                        <small>
                            <strong>⚠️ Максимальный размер файла: </strong>
                            <span className="text-danger fw-bold">50 МБ</span>
                        </small>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setModalShow(false)}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default InstuctionModal;

