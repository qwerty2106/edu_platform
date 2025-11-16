import { FilePond, registerPlugin } from "react-filepond";
import 'filepond/dist/filepond.min.css';
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setNotify } from "../../../redux/app-reducer";


const FileUploader = () => {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);

    const onClickHandle = () => {
        const file = files[0];
        const fileName = file.file.name.toLowerCase();

        const isValid = fileName.endsWith('.rar') || fileName.endsWith('.zip') || fileName.endsWith('.7z');

        if (isValid) 
            dispatch(setNotify({ status: 'success', message: 'Файл успешно отправлен!' }));
        else 
            dispatch(setNotify({ status: 'error', message: 'Неверный формат файла!' }));
    }
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
                labelFileTypeNotAllowed="Некорректный формат файла!"
                fileValidateTypeLabelExpectedTypes="Ожидается ZIP файл"

            />
            <Button variant="success" disabled={files.length === 0} onClick={onClickHandle}>Отправить</Button>
        </div>
    )
}





export default FileUploader;