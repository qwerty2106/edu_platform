import { FilePond } from "react-filepond";
import { useState } from "react";
import { Button } from "react-bootstrap";

import 'filepond/dist/filepond.min.css';

const FileUploader = (props) => {
    const [files, setFiles] = useState([]);
    return (
        <div>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                credits={false}
                labelIdle='Перетащите ZIP файл или <span class="filepond--label-action">выберите</span>'
            />
            <Button type="button" variant="success" disabled={files.length === 0} onClick={() => props.fileUploaderHandle(files)}>Отправить</Button>
        </div>
    )
}


export default FileUploader;

