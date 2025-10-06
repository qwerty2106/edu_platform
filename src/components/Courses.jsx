import React, { useState } from 'react';
import { Col, Container, Row, Card, Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCourses, getIsLoading } from '../redux/courses-selectors';
import { requestCourses } from '../redux/courses-reducer';
import { withAuthRedirect } from '../hoc/withAuthRedirect';

const Course = (props) => {
    const [isEnroll, setEnroll] = useState(false);

    const onSetEnroll = () => (isEnroll ? setEnroll(false) : setEnroll(true));
    const navigate = useNavigate();

    return (
        <Col xs={12} className='mb-3' md={4}>
            <Card style={{ width: '20rem' }} >
                <Card.Img variant="top" src="/images/courses/to-do-list.png" style={{ objectFit: "cover" }} />
                <Card.Body>
                    <Card.Title onClick={() => navigate(`/app/courses/${props.id}`)} style={{ cursor: 'pointer' }}>{props.title}</Card.Title>
                    <div>
                        {props.description}
                        <div className='py-2'>
                            <span className='fw-bold'>Stack: {props.stack}</span>
                        </div>
                    </div>
                    <div className='d-flex gap-2'>
                        <Button onClick={onSetEnroll} variant={isEnroll ? "outline-danger" : "light"}>{isEnroll ? "Leave course" : "Learn course"}</Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}



class Courses extends React.Component {
    componentDidMount() {
        this.props.requestCourses();  //Загрузка курсов
    }
    render() {
        //Спиннер (загрузка курсов)
        if (this.props.isLoading)
            return (
                <Container className='d-flex justify-content-center align-items-center h-100'>
                    <Spinner animation='border' variant='dark'></Spinner>
                </Container>
            )
        //Курсов нет (пустой массив)
        if (this.props.courses.length === 0) {
            return (
                <h1>No courses yet!</h1>
            )
        }
        //Список курсов
        const coursesElements = this.props.courses.map(course => <Course key={course.id} id={course.id} title={course.title} description={course.description} stack={course.stack} />)
        return (
            <div className='h-100 overflow-auto'>
                <Container>
                    <Row>
                        {coursesElements}
                    </Row>
                </Container >
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        courses: getCourses(state),
        isLoading: getIsLoading(state),
    }
}


export default connect(mapStateToProps, { requestCourses })(Courses)