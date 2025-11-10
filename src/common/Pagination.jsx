import { Pagination } from 'react-bootstrap';

const MyPagination = ({ itemsCount, pageSize, currentPage, onPageChange }) => {
    const pagesCount = Math.ceil(itemsCount / pageSize);

    if (pagesCount <= 1)
        return null;

    let items = [];
    for (let number = 1; number <= pagesCount; number++) {
        items.push(number);
    }

    return (
        <Pagination size='md'><Pagination.Prev onClick={() => { currentPage > 1 && onPageChange(currentPage - 1) }} />
            {items.map(i =>
                <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>{i}</Pagination.Item>)}
            <Pagination.Next onClick={() => { currentPage < pagesCount && onPageChange(currentPage + 1) }} />
        </Pagination>)

}
export default MyPagination;