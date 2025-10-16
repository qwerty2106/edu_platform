import { Slide, toast, ToastContainer } from "react-toastify";

const CheckAnswersButton = () => {
    const handleCheck = () => {
        const correct = document.querySelectorAll('input[correct]:checked');
        const questions = document.querySelectorAll('input[correct]');

        toast.info(`Correct answers: ${correct.length} of ${questions.length}`, { transition: Slide })
    };

    return <div>
        <button className="btn btn-primary" onClick={handleCheck}>Check</button>
        <ToastContainer hideProgressBar={true} autoClose={2000} />
    </div>
};

export default CheckAnswersButton;