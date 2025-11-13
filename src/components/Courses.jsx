import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getCourses, getCoursesCount, getLoadingCourses } from '../redux/courses-selectors';
import { requestCourses } from '../redux/courses-reducer';
import Preloader from '../common/Preloader';
import MyPagination from '../common/Pagination';
import { getUser } from '../redux/auth-selectors';
import Course from './Course';


class Courses extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 1, page: 1, filterType: 'my' };
    }
    componentDidMount() {
        this.loadCourses();
    }
    //Загрузка курсов
    loadCourses = () => {
        const { page, pageSize, filterType } = this.state;
        this.props.requestCourses(page, pageSize, filterType, this.props.user.id);
    }
    //Смена пагинации
    onPageChangeHandle = (page) => {
        this.setState({ page }, () => this.loadCourses());
    }
    //Смена сортировки
    onSelectHandle = (eventKey) => {
        let filterType = eventKey === '1' ? 'all' : 'my';
        //Сброс на первую страницу после сортировки
        this.setState({ filterType, page: 1 }, () => this.loadCourses());
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
                <div className='d-flex gap-2'>
                    <MyPagination itemsCount={this.props.coursesCount} pageSize={this.state.pageSize} currentPage={this.state.page} onPageChange={this.onPageChangeHandle} />
                    <DropdownButton title={this.state.filterType === 'all' ? 'Все курсы' : 'Мои курсы'} onSelect={this.onSelectHandle} variant='dark'>
                        <Dropdown.Item eventKey='1' active={this.state.filterType === 'all'}>Все курсы</Dropdown.Item>
                        <Dropdown.Item eventKey='2' active={this.state.filterType === 'my'}>Мои курсы</Dropdown.Item>
                    </DropdownButton>
                </div>
                <div className='d-flex gap-3'>
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
        user: getUser(state),
    }
}


export default connect(mapStateToProps, { requestCourses })(Courses)