import { FilePond } from "react-filepond";
import { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import styles from './FileUpload.module.css';
import 'filepond/dist/filepond.min.css';

const test = `
<div style="display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
    </svg>
    <div style="font-size: 16px;">Перетащите ZIP файл или <span style="text-decoration: underline; color: #0d6efd;">выберите</span></div>
</div>`;

const FileUploader = (props) => {
    const [files, setFiles] = useState([]);
    const [text, setText] = useState('');
    const [modalShow, setModalShow] = useState(false);

    const InstuctionModal = (props) => {
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
                                <span className="badge bg-primary">1</span>
                                <span>Выберите файл или перетащите в область загрузки</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-primary">2</span>
                                <span>Дождитесь появления имени файла в интерфейсе</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-primary">3</span>
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

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-end">
                    <Button variant="outline-primary" size="sm" onClick={() => setModalShow(true)}>
                        📖 Посмотреть инструкцию
                    </Button>
                </div>
                <InstuctionModal />
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    credits={false}
                    labelIdle={test}
                    className={styles.filepondOverride}
                />
            </div>

            <FloatingLabel label="Напишите комментарий к заданию... (не обязательно)">
                <Form.Control
                    placeholder=" "
                    as="textarea"
                    style={{ height: '100px' }}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
            </FloatingLabel>
            <Button type="button" variant="success" disabled={files.length === 0} onClick={() => props.fileUploaderHandle(files, text)} className="align-self-start">Отправить</Button>
        </div>
    )
}
export default FileUploader;

