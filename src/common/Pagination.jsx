import { Pagination } from 'react-bootstrap';

const MyPagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
    const pagesCount = Math.ceil(itemsCount / pageSize);
    let items = [];

    for (let number = 1; number <= pagesCount; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
                {number}
            </Pagination.Item>)
    }

    return (
        <Pagination size='md'>{items}</Pagination>
    )
}
export default MyPagination;