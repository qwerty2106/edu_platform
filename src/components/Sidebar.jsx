import { Col, Container, ListGroup } from 'react-bootstrap';
import { PersonFill, TerminalFill, ChatDotsFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUser } from '../redux/auth-selectors';

const Sidebar = () => {
  const user = useSelector(getUser);
  return (
    <Col xs={2} className='bg-dark p-0' style={{ height: '100vh' }}>
      <ListGroup variant='flush'>

        <NavLink to="/app/courses" className="text-decoration-none" end>
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <TerminalFill style={{ width: '20px', height: '20px' }} />
              <span>Курсы</span>
            </Container>
          </ListGroup.Item>
        </NavLink>


        <NavLink to={`/app/profile/${user.id}`} className="text-decoration-none">
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <PersonFill style={{ width: '20px', height: '20px' }} />
              <span>Профиль</span>
            </Container>
          </ListGroup.Item>
        </NavLink>

        <NavLink to="/app/chats" className="text-decoration-none">
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <ChatDotsFill style={{ width: '20px', height: '20px' }} />
              <span>Чат</span>
            </Container>
          </ListGroup.Item>
        </NavLink>
      </ListGroup>
    </Col >
  )
}


export default Sidebar;