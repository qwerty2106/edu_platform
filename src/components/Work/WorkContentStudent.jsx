const WorkContentStudent = ({ currentWork }) => {
    return (
        <>
            {currentWork.comment_teacher &&
                <div>
                    <p className="mb-0 fw-bold">Комментарий ментора:</p>
                    <span>{currentWork.comment_teacher}</span>
                </div>
            }
        </>
    )
}

export default WorkContentStudent;