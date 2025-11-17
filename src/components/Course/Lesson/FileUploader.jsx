import { FilePond, registerPlugin } from "react-filepond";
import { useState } from "react";
import { Button } from "react-bootstrap";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import 'filepond/dist/filepond.min.css';
registerPlugin(FilePondPluginFileEncode);

const FileUploader = (props) => {
    const [files, setFiles] = useState([]);
    return (
        <div>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                maxFiles={1}
                maxFileSize="50MB"
                credits={false}
                labelIdle='Перетащите ZIP файл или <span class="filepond--label-action">выберите</span>'
                allowFileEncode={true}
                allowProcess={false}
                instantUpload={false}
                labelFileLoading="Загрузка..."
                labelTapToCancel="Нажмите для отмены"
                labelFileLoadError="Ошибка загрузки"
                labelTapToRetry="Нажмите для повтора"
                labelFileWaitingForSize="Определяем размер файла..."
            />
            <Button type="button" variant="success" disabled={files.length === 0} onClick={() => props.fileUploaderHandle(files)}>Отправить</Button>
        </div>
    )
}


export default FileUploader;

