import { Col, Container, Row, Card, Button } from 'react-bootstrap';

const Course = () => {
    return (
        <Col xs={12} className='mb-3' md={3}>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="gray.jpg" />
                <Card.Body>
                    <Card.Title>Course title</Card.Title>
                    <Card.Text>Info about course</Card.Text>
                    <Button variant="light">Enroll course</Button>
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