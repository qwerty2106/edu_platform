import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Prism from "prismjs";
import rehypeRaw from "rehype-raw";
import Preloader from "../../../common/Preloader";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../redux/auth-selectors";
import { useParams } from "react-router-dom";
import { setNotify } from "../../../redux/app-reducer";
import { requestCompleteLesson } from "../../../redux/courses-reducer";
import 'prism-themes/themes/prism-atom-dark.css';
import FileUploader from "./FileUploader";

const LessonTest = (props) => {
    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    //Загрузка (преобразование файла)
    const [isLoading, setLoading] = useState(true);

    const [showUploader, setShowUploader] = useState(false);

    const dispatch = useDispatch();
    const { lessonID } = useParams();
    const user = useSelector(getUser);

    useEffect(() => {
        if (!props.lesson) {
            setLoading(false);
            return;
        };

        //Кодировка некорректных символов в названии файла
        const encodedPath = encodeURI(props.lesson.test_path);
        setLoading(true);
        fetch(encodedPath)
            .then(res => res.text()) //Запись файла в строчку
            .then(text => setContent(text))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [props.lesson]);

    const checkButtonHandle = () => {
        const correct = document.querySelectorAll('input[correct]:checked');
        const questions = document.querySelectorAll('input[correct]');

        if (questions.length !== 0) {
            if (correct.length === questions.length) {
                dispatch(requestCompleteLesson(user.id, lessonID));
                dispatch(setNotify({ status: 'success', message: 'Вы справились на все 100%! 🎉' }));
            }
            else if (correct.length === 0) {
                dispatch(setNotify({ status: 'error', message: 'Попробуйте еще раз!' }));
            }
            else {
                dispatch(setNotify({ status: 'info', message: `Правильных ответов: ${correct.length} из ${questions.length}` }));
            }
        }
    }

    const fileUploaderHandle = (files) => {
        const file = files[0];
        const fileName = file.file.name.toLowerCase();
        const fileSize = file.file.size / 1024 / 1024;  //size всегда в байтах

        const isValid = (fileName.endsWith('.rar') || fileName.endsWith('.zip') || fileName.endsWith('.7z')) && fileSize <= 50; //50MB лимит

        if (isValid) {
            dispatch(requestCompleteLesson(user.id, lessonID, `/completed-lessons/${user.username}-${lessonID}`));
            dispatch(setNotify({ status: 'success', message: 'Файл успешно отправлен!' }));
        }

        else {
            dispatch(setNotify({ status: 'error', message: 'Ошибка отправки файла!' }));
        }
    }

    //Подсветка кода
    useEffect(() => {
        if (content) {
            Prism.highlightAll();

            const checkButton = document.querySelector('.check-answers-btn');
            if (checkButton) {
                checkButton.addEventListener('click', checkButtonHandle);
            }

            const uploadFiles = document.querySelector('.upload-files');
            if (uploadFiles) {
                setShowUploader(true);
            }

            //Очистка при размонтировании
            return () => {
                if (checkButton)
                    checkButton.removeEventListener('click', checkButtonHandle);
            };

        }

    }, [content]);

    if (isLoading) return <Preloader />
    return content
        ? <div>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            {showUploader && <FileUploader fileUploaderHandle={fileUploaderHandle} />}
        </div >
        : <h1>No lesson yet!</h1>
}

export default LessonTest;