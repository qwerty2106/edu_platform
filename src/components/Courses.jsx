import React, { useState } from 'react';
import { Col, Container, Row, Card, Button, Ratio, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCourses, getCoursesCount, getCurrentPage, getLoadingCourses } from '../redux/courses-selectors';
import { requestCourses, setCurrentPage } from '../redux/courses-reducer';
import Preloader from '../common/Preloader';
import MyPagination from '../common/Pagination';
import { Calendar, CalendarFill } from 'react-bootstrap-icons';

const UserSmallImage = (props) => {
    return (
        <Image src={props.path} roundedCircle width={45} height={45} style={{ marginRight: -10, objectFit: "cover" }} />
    )
}

const Course = (props) => {
    const navigate = useNavigate();
    const usersImages = props.user_images ? props.user_images.split(',') : [];
    const usersSmallImagesElements = usersImages.map(image => <UserSmallImage key={image} path={image} />);
    return (
        <Col>
            <Card className='rounded-3' onClick={() => navigate(`/app/courses/${props.id}`)} style={{ cursor: 'pointer' }}>
                <div className='d-flex justify-content-between h-100 align-items-center'>
                    <div style={{ width: '75%', flexShrink: 0 }}>
                        <Card.Body>
                            <Card.Title className='fs-3 fs-md-6'>{props.title}</Card.Title>
                            <Card.Text className='flex-grow-1'>
                                <div className='py-2 text-break' style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 6,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {props.description}
                                </div>
                                <div className='py-1'>
                                    <span className='fw-bold'>Технологии: </span>
                                    <span>HTML, CSS</span>
                                </div>
                                <div className='py-1'>
                                    <span className='fw-bold'>Уровень: </span>
                                    <span>Начальный</span>
                                </div>

                                <div className='d-flex align-items-center gap-5 py-3'>
                                    {usersImages.length >= 1 &&
                                        <div className='d-flex'>
                                            {usersSmallImagesElements}

                                            <div
                                                className='d-flex align-items-center justify-content-center rounded-circle border border-white'
                                                style={{
                                                    width: '45px', height: '45px', marginRight: -10, background: '#f8f9fa', fontSize: '14px', fontWeight: '600', color: 'black'
                                                }}>+{props.max_students - usersImages.length}
                                            </div>

                                        </div>
                                    }
                                    <div className='d-flex gap-2 align-items-center p-1 p-md-0'>
                                        <CalendarFill size={14} />
                                        <span className='small'>{new Date(props.start_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(props.finish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                </div>
                            </Card.Text>
                            <Button variant="light" onClick={(e) => { e.stopPropagation(); navigate(`/app/courses/${props.id}`) }}>Читать больше</Button>
                        </Card.Body>
                    </div>
                    <div className='d-none d-lg-flex justify-content-center align-items-center' style={{ width: '25%', flexShrink: 0 }}>
                        <div>
                            <Card.Img variant="top" src={props.img} style={{ objectFit: "cover", height: '100%', width: '100%' }} />
                        </div>
                    </div>
                </div>
            </Card>
        </Col >
    )
}

class Courses extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 1, page: 1 };
    }
    componentDidMount() {
        this.props.requestCourses(this.state.page, this.state.pageSize);  //Загрузка курсов
    }
    handlePageChange = (page) => {
        this.props.setCurrentPage(page);
        this.props.requestCourses(page, this.state.pageSize);
    }
    render() {
        //Спиннер (загрузка курсов)
        if (this.props.isLoading)
            return <Preloader />

        //Курсов нет (пустой массив)
        if (this.props.courses.length === 0)
            return <h1>No courses yet!</h1>

        //Список курсов
        const coursesElements = this.props.courses.map(course => <Course key={course.id} {...course} />);

        return (
            <div className='h-100 overflow-auto'>
                <MyPagination itemsCount={this.props.coursesCount} pageSize={this.state.pageSize} currentPage={this.props.currentPage} onPageChange={this.handlePageChange} />
                <div className='d-flex flex-column gap-3'>
                    {coursesElements}
                </div>

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