import { FilePond } from "react-filepond";
import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

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
            <FloatingLabel label="Напишите комментарий к заданию... (не обязательно)" className="my-3">
                <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    onChange={(e) => setText(e.target.value)}
                />
            </FloatingLabel>
            <Button type="button" variant="success" disabled={files.length === 0} onClick={() => props.fileUploaderHandle(files, text)}>Отправить</Button>
        </div>
    )
}
export default FileUploader;

