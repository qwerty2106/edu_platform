import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLesson } from "../redux/courses-selectors";
import parse from "html-react-parser";
import { Container, Spinner } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';

const LessonContent = () => {
    const { lessonID } = useParams(); //id урока из URL

    //Получение урока из store
    const lesson = useSelector(state => getLesson(state, lessonID));
    console.log(lesson)


    // Преобразование markdown файла в html
    const [content, setContent] = useState("");
    useEffect(() => {
        const encodedPath = encodeURI(lesson.content_path)
        fetch(encodedPath)
            .then(res => res.text())
            .then(text => setContent(text))
            .catch(err => console.log(err));
    }, [lesson])


    return (
        <div>
            {content
                ? <ReactMarkdown>{content}</ReactMarkdown>
                //Загрузка урока
                : <Container className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
                    <Spinner animation='border' variant='dark'></Spinner>
                </Container>}
        </div>
    )
}




export default LessonContent;