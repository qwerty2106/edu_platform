import { Col, Container, ListGroup } from 'react-bootstrap';
import { PersonFill, TerminalFill, ChatDotsFill, PencilSquare, PencilFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUser } from '../redux/auth-selectors';

const Sidebar = () => {
  const user = useSelector(getUser);
  return (
    <Col xs={2} className='bg-dark'>
      <ListGroup variant='flush'>

        <NavLink to="/app/courses" className="text-decoration-none" end>
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <TerminalFill style={{ width: '20px', height: '20px' }} />
              <span>Курсы</span>
            </Container>
          </ListGroup.Item>
        </NavLink>

        {
          user.role === "teacher" ?
            <NavLink to={`/app/works`} className="text-decoration-none">
              <ListGroup.Item action>
                <Container className='d-flex gap-3 align-items-center p-2'>
                  <PencilFill style={{ width: '20px', height: '20px' }} />
                  <span>Проверка</span>
                </Container>
              </ListGroup.Item>
            </NavLink> : null
        }

        {
          user.role === "student" ?
            <NavLink to={`/app/profile/${user.id}`} className="text-decoration-none">
              <ListGroup.Item action>
                <Container className='d-flex gap-3 align-items-center p-2'>
                  <PersonFill style={{ width: '20px', height: '20px' }} />
                  <span>Профиль</span>
                </Container>
              </ListGroup.Item>
            </NavLink> : null

        }

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