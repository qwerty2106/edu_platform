import { FilePond } from "react-filepond";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import 'filepond/dist/filepond.min.css';

const FileUploader = (props) => {
    const [files, setFiles] = useState([]);
    const [text, setText] = useState('');
    return (
        <div>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                credits={false}
                labelIdle='Перетащите ZIP файл или <span class="filepond--label-action">выберите</span>'
            />
            <Form.Group className="mb-3">
                <Form.Label>Напишите комментарий к заданию (не обязательно)</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Введите текст..." onChange={(e) => setText(e.target.value)} />
            </Form.Group>
            <Button type="button" variant="success" disabled={files.length === 0} onClick={() => props.fileUploaderHandle(files, text)}>Отправить</Button>
        </div>
    )
}


export default FileUploader;

