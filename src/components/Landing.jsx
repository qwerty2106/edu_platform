import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"

const Landing = () => {
    const navigate = useNavigate();
    return (
        <Container fluid className="bg-dark text-white " style={{ height: "100vh" }}>
            <h1>Landing Page</h1>

            <button onClick={() => navigate('/auth/login')} className="btn btn-primary">Begin</button>
        </Container>
    )
}

export default Landing;