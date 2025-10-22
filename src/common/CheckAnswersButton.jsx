import { useDispatch } from "react-redux";
import { setNotify } from "../redux/app-reducer";

const CheckAnswersButton = () => {
    const dispatch = useDispatch();
    const handleCheck = () => {
        const correct = document.querySelectorAll('input[correct]:checked');
        const questions = document.querySelectorAll('input[correct]');

        if (correct.length === questions.length)
            dispatch(setNotify({ status: 'success', message: 'Excellent! All answers are correct!' }));
        else if (correct.length === 0)
            dispatch(setNotify({ status: 'error', message: 'No correct answers. Try again!' }));
        else
            dispatch(setNotify({ status: 'info', message: `You got ${correct.length} correct answers out of ${questions.length}` }));
    };
    return <button className="btn btn-primary" onClick={handleCheck}>Check</button>
};


export default CheckAnswersButton;