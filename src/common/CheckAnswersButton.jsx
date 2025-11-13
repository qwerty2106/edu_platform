import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../redux/app-reducer";
import { requestCompleteLesson } from "../redux/courses-reducer";
import { useParams } from "react-router-dom";
import { getUser } from "../redux/auth-selectors";

const CheckAnswersButton = () => {
    const dispatch = useDispatch();
    const { courseID, moduleID, lessonID } = useParams();
    const user = useSelector(getUser);
    console.log(user.id, courseID, lessonID);
    const handleCheck = () => {

        const checkButtonContainer = document.getElementById('check-answers-button');
        checkButtonContainer.innerHTML = '<button className="btn btn-primary btn-sm onClick={checkAnswers}">Проверить ответы</button>'

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
        }
    };
    // return <button className="btn btn-primary" onClick={handleCheck}>Check</button>
};


export default CheckAnswersButton;