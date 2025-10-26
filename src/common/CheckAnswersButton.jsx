import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../redux/app-reducer";
import { requestCompleteLesson } from "../redux/courses-reducer";
import { useParams } from "react-router-dom";
import { getUser } from "../redux/auth-selectors";

const CheckAnswersButton = () => {
    const dispatch = useDispatch();
    const { courseID, lessonID } = useParams();
    const user = useSelector(getUser);
    console.log(user.id, courseID, lessonID);
    const handleCheck = () => {
        const correct = document.querySelectorAll('input[correct]:checked');
        const questions = document.querySelectorAll('input[correct]');

        if (correct.length === questions.length) {
            dispatch(setNotify({ status: 'success', message: 'Excellent! All answers are correct!' }));
            dispatch(requestCompleteLesson(user.id, courseID, lessonID));
        }

        else if (correct.length === 0)
            dispatch(setNotify({ status: 'error', message: 'No correct answers. Try again!' }));
        else
            dispatch(setNotify({ status: 'info', message: `You got ${correct.length} correct answers out of ${questions.length}` }));
    };
    return <button className="btn btn-primary" onClick={handleCheck}>Check</button>
};


export default CheckAnswersButton;