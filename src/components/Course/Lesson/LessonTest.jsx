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
        const encodedPath = encodeURI(`http://localhost:3000/static${props.lesson.test_path}`);
        setLoading(true);
        fetch(encodedPath)
            .then(res => res.text()) //Запись файла в строчку
            .then(text => setContent(text))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [props.lesson]);

    const checkButtonHandle = async () => {
        const correct = document.querySelectorAll('input[data-correct]:checked');
        const questions = document.querySelectorAll('input[data-correct]');

        if (questions.length !== 0) {
            if (correct.length === questions.length) {
                try {
                    const res = await dispatch(requestCompleteLesson(user.id, lessonID, null, null));
                    if (res === 201)
                        dispatch(setNotify({ status: 'success', message: 'Вы справились на все 100%! 🎉' }));
                    else
                        dispatch(setNotify({ status: 'error', message: 'Произошла ошибка! ⚠️' }));
                }
                catch (err) {
                    console.error(err);
                    dispatch(setNotify({ status: 'error', message: 'Произошла ошибка! ⚠️' }));
                }
            }
            else if (correct.length === 0) {
                dispatch(setNotify({ status: 'error', message: 'Попробуйте еще раз! ❌' }));
            }
            else {
                dispatch(setNotify({ status: 'info', message: `Правильных ответов: ${correct.length} из ${questions.length} 🎯` }));
            }
        }
    }

    const fileUploaderHandle = async (files, comment) => {
        //Первый файл из массива
        const file = files[0].file;
        const fileName = file.name.toLowerCase();
        const fileSize = file.size / 1024 / 1024;  //size всегда в байтах

        //Расширение + размер (50MB)
        const isValid = (fileName.endsWith('.rar') || fileName.endsWith('.zip') || fileName.endsWith('.7z')) && fileSize <= 50;

        if (isValid) {
            try {
                const res = await dispatch(requestCompleteLesson(user.id, lessonID, file, comment));
                if (res === 201)
                    dispatch(setNotify({ status: 'success', message: 'Задание отправлено! 🎯' }));
                else
                    dispatch(setNotify({ status: 'error', message: 'Произошла ошибка! ⚠️' }));
            }
            catch (err) {
                console.error(err);
                dispatch(setNotify({ status: 'error', message: 'Произошла ошибка! ⚠️' }));
            }
        }
        else {
            dispatch(setNotify({ status: 'error', message: 'Ошибка отправки файла! ❌' }));
        }
    }

    //Обработка html файла
    useEffect(() => {
        if (content) {
            //Подсветка кода
            Prism.highlightAll();

            //Поиске кнопки проверки ответов
            const checkButton = document.querySelector('.check-answers-btn');
            if (checkButton) {
                checkButton.addEventListener('click', checkButtonHandle);
            }

            //Поиск элемента загрузки файлов
            const uploadFiles = document.querySelector('.upload-files');
            if (uploadFiles) {
                setShowUploader(true);
            }

            //Очистка обработчика при размонтировании
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