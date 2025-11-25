import { Clipboard2X } from "react-bootstrap-icons";

const EmptyScreen = () => {
    return (
        <div className='d-flex justify-content-center align-items-center w-100 min-vh-100 gap-3'>

            <div>
                <Clipboard2X style={{ height: '100px', width: '100px'}} />
            </div>
            <div className="d-flex flex-column align-items-center">
                <h1>Пока здесь пусто...</h1>
                <span>Но это ненадолго! Ресурсы скоро появятся</span>
            </div>


        </div>
    )
}
export default EmptyScreen;