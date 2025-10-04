import { useState } from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Course = () => {
    const [isEnroll, setEnroll] = useState(false);

    const onSetEnroll = () => (isEnroll ? setEnroll(false) : setEnroll(true));
    const navigate = useNavigate();



    return (
            <Col xs={12} className='mb-3' md={3}>
                <Card style={{ width: '18rem' }} >
                    <Card.Img variant="top" src="gray.jpg" />
                    <Card.Body>
                        <Card.Title onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>Course title</Card.Title>
                        <Card.Text>Info about course</Card.Text>
                        <div className='d-flex gap-2'>
                            <Button onClick={onSetEnroll} variant={isEnroll ? "outline-danger" : "light"}>{isEnroll ? "Leave course" : "Learn course"}</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
    )
}

const CourseContainer = () => {
    return (
        <Container bg-dark>
            <Row>
                <Course />
            </Row>
        </Container>
    )
}

export default CourseContainer