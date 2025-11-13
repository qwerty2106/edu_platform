import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Prism from "prismjs";
import rehypeRaw from "rehype-raw";
import CheckAnswersButton from "../common/CheckAnswersButton";
import Preloader from "../common/Preloader";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../redux/app-reducer";
import { requestCompleteLesson } from "../redux/courses-reducer";
import { useParams } from "react-router-dom";
import { getUser } from "../redux/auth-selectors";

const Lesson = (props) => {
    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    //Загрузка (преобразование файла)
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const { courseID, moduleID, lessonID } = useParams();
    const user = useSelector(getUser);

    useEffect(() => {
        if (!props.lesson) {
            setLoading(false);
            return;
        };
        //Кодировка некорректных символов в названии файла
        const encodedPath = encodeURI(props.lesson.content_path);
        setLoading(true);
        fetch(encodedPath)
            .then(res => res.text()) //Запись файла в строчку
            .then(text => setContent(text))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [props.lesson]);


    const checkAnswers = () => {
        const correct = document.querySelectorAll('input[correct]:checked');
        const questions = document.querySelectorAll('input[correct]');

        if (questions.length !== 0) {
            if (correct.length === questions.length) {
                dispatch(setNotify({ status: 'success', message: 'Вы справились на все 100%! 🎉' }));
                dispatch(requestCompleteLesson(user.id, courseID, moduleID, lessonID, true));
            }
            else if (correct.length === 0) {
                dispatch(setNotify({ status: 'error', message: 'Попробуйте еще раз!' }));
            }
            else {
                dispatch(setNotify({ status: 'info', message: `Правильных ответов: ${correct.length} из ${questions.length}` }));
            }
        }
    };

    //Подсветка кода
    useEffect(() => {
        if (content) {
            Prism.highlightAll();
            const checkButtonContainer = document.getElementById('check-answers-button');
            if (checkButtonContainer) {
                const button = document.createElement('button');
                button.className = 'btn btn-primary btn-sm';
                button.textContent = 'Проверить ответы';
                button.addEventListener('click', checkAnswers);
                checkButtonContainer.appendChild(button);
            }
        }

    }, [content]);

    if (isLoading) return <Preloader />
    return content
        ? <div>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            {/* <CheckAnswersButton /> */}
        </div >
        : <h1>No lesson yet!</h1>
}

export default Lesson;