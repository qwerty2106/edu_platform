import React, { useState } from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCourses, getCoursesCount, getCurrentPage, getLoadingCourses } from '../redux/courses-selectors';
import { requestCourses, setCurrentPage } from '../redux/courses-reducer';
import Preloader from '../common/Preloader';
import MyPagination from '../common/Pagination';

const Course = (props) => {
    const [isEnroll, setEnroll] = useState(false);

    const onSetEnroll = () => (isEnroll ? setEnroll(false) : setEnroll(true));
    const navigate = useNavigate();
    console.log(props.img)
    return (
        <Col xs={12} className='mb-3' md={4}>
            <Card style={{ width: '20rem' }} >
                <Card.Img variant="top" src={props.img} style={{ objectFit: "cover" }} />
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
    handlePageChange = (page) => {
        this.props.setCurrentPage(page);
        this.props.requestCourses(page, 3);
    }
    render() {
        //Спиннер (загрузка курсов)
        if (this.props.isLoading)
            return <Preloader />

        //Курсов нет (пустой массив)
        if (this.props.courses.length === 0)
            return <h1>No courses yet!</h1>

        //Список курсов
        const coursesElements = this.props.courses.map(course => <Course key={course.id} {...course} />)

        return (
            <div className='h-100 overflow-auto'>
                <Container>
                    <MyPagination itemsCount={this.props.coursesCount} pageSize={3} currentPage={this.props.currentPage} onPageChange={this.handlePageChange} />
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
        isLoading: getLoadingCourses(state),
        coursesCount: getCoursesCount(state),
        currentPage: getCurrentPage(state),
    }
}


export default connect(mapStateToProps, { requestCourses, setCurrentPage })(Courses)