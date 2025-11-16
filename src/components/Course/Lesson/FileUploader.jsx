import { FilePond, registerPlugin } from "react-filepond";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setNotify } from "../../../redux/app-reducer";
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import 'filepond/dist/filepond.min.css';

registerPlugin(FilePondPluginFileEncode);

const FileUploader = () => {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);

    const onClickHandle = () => {
        const file = files[0];
        const fileName = file.file.name.toLowerCase();
        const fileSize = file.file.size / 1024 / 1024;  //size всегда в байтах

        const isValid = (fileName.endsWith('.rar') || fileName.endsWith('.zip') || fileName.endsWith('.7z')) && fileSize <= 50; //50MB лимит

        if (isValid)
            dispatch(setNotify({ status: 'success', message: 'Файл успешно отправлен!' }));
        else
            dispatch(setNotify({ status: 'error', message: 'Ошибка отправки файла!' }));
    }
    return (
        <div>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                maxFiles={1}
                maxFileSize="500KB"
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
            <Button variant="success" disabled={files.length === 0} onClick={onClickHandle}>Отправить</Button>
        </div>
    )
}





export default FileUploader;