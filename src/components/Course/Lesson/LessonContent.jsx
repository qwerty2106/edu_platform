import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Prism from "prismjs";
import rehypeRaw from "rehype-raw";
import Preloader from "../../../common/Preloader";
import 'prism-themes/themes/prism-atom-dark.css';


const LessonContent = (props) => {
    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    //Загрузка (преобразование файла)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.lesson) {
            setLoading(false);
            return;
        };

        //Кодировка некорректных символов в названии файла
        const encodedPath = encodeURI(`/static${props.lesson.content_path}`);
        setLoading(true);
        fetch(encodedPath)
            .then(res => res.text()) //Запись файла в строчку
            .then(text => setContent(text))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
    }, [props.lesson]);



    //Подсветка кода
    useEffect(() => {
        if (content)
            Prism.highlightAll();

    }, [content]);

    if (isLoading) return <Preloader />
    return content
        ? <div>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div >
        : <h1>No lesson yet!</h1>
}

export default LessonContent;