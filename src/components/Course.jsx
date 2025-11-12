import { useNavigate } from 'react-router-dom';
import { Col, Card, Button, Image } from 'react-bootstrap';
import { CalendarFill, CalendarWeek } from 'react-bootstrap-icons';

const UserSmallImage = (props) => {
    return (
        <Image src={props.path} roundedCircle width={45} height={45} style={{ marginRight: -10, objectFit: "cover" }} />
    )
}

const Course = (props) => {
    console.log(props.tech_stack)
    const navigate = useNavigate();
    const usersImages = props.user_images ? props.user_images.split(',') : [];
    const usersSmallImagesElements = usersImages.map(image => <UserSmallImage key={image} path={image} />);
    return (
        <Col>
            <Card className={(props.is_available == 1 ? 'border-primary' : 'border-danger') + ' border-2'} onClick={() => {
                if (props.is_available == 1)
                    navigate(`/app/courses/${props.id}`)
            }} style={{ cursor: props.is_available == 0 ? 'not-allowed' : 'pointer' }}>
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
                                    <span>{props.tech_stack.join(', ')}</span>
                                </div>
                                <div className='py-1'>
                                    <span className='fw-bold'>Уровень: </span>
                                    <span>{props.level}</span>
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
                                        <CalendarWeek size={14} />
                                        <span className='small'>{new Date(props.start_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(props.finish_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                </div>
                            </Card.Text>
                            <Button variant="light" disabled={props.is_available == 0} onClick={(e) => { e.stopPropagation(); navigate(`/app/courses/${props.id}`) }} >Читать больше</Button>
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

export default Course;