import { Col, Container, ListGroup } from 'react-bootstrap';
import { PersonFill, TerminalFill, ChatDotsFill } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Col xs={2} className='bg-dark p-0' style={{ height: '100vh' }}>
      <ListGroup variant='flush'>

        <NavLink to="/courses" className="text-decoration-none">
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <TerminalFill style={{ width: '20px', height: '20px' }} />
              <span>Courses</span>
            </Container>
          </ListGroup.Item>
        </NavLink>


        <NavLink to="/profile" className="text-decoration-none">
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <PersonFill style={{ width: '20px', height: '20px' }} />
              <span>Profile</span>
            </Container>
          </ListGroup.Item>
        </NavLink>

        <NavLink to="/chat" className="text-decoration-none">
          <ListGroup.Item action>
            <Container className='d-flex gap-3 align-items-center p-2'>
              <ChatDotsFill style={{ width: '20px', height: '20px' }} />
              <span>Chat</span>
            </Container>
          </ListGroup.Item>
        </NavLink>
      </ListGroup>
    </Col >
  )
}
export default Sidebar;