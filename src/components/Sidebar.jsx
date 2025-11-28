import { Col, Container, ListGroup } from 'react-bootstrap';
import { PersonFill, TerminalFill, ChatDotsFill, PencilFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUser } from '../redux/auth-selectors';

const Sidebar = () => {
  const user = useSelector(getUser);
  return (
    <Col xs={2} className='bg-dark'>
      <ListGroup variant='flush' className='border-0'>

        <ListGroup.Item action className='p-0 border-top'>
          <NavLink to="/app/courses" className="text-decoration-none">{({ isActive }) => (
            <div className='d-flex gap-3 align-items-center p-4' style={{ backgroundColor: isActive ? '#343a40' : '', color: isActive ? '#ffffff' : '#dee2e6' }}>
              <TerminalFill style={{ width: '20px', height: '20px' }} />
              <span>Курсы</span>
            </div>)}
          </NavLink>
        </ListGroup.Item>

        <ListGroup.Item action className='p-0'>
          <NavLink to={`/app/works/${user.id}`} className="text-decoration-none">{({ isActive }) => (
            <div className='d-flex gap-3 align-items-center p-4' style={{ backgroundColor: isActive ? '#343a40' : '', color: isActive ? '#ffffff' : '#dee2e6' }}>
              <PencilFill style={{ width: '20px', height: '20px' }} />
              <span>Работы</span>
            </div>)}
          </NavLink>
        </ListGroup.Item>

        {
          user.role === "student" ?
            <ListGroup.Item action className='p-0'>
              <NavLink to={`/app/profile/${user.id}`} className="text-decoration-none">{({ isActive }) => (
                <div className='d-flex gap-3 align-items-center p-4' style={{ backgroundColor: isActive ? '#343a40' : '', color: isActive ? '#ffffff' : '#dee2e6' }}>
                  <PersonFill style={{ width: '20px', height: '20px' }} />
                  <span>Профиль</span>
                </div>)}
              </NavLink>
            </ListGroup.Item> : null
        }

        <ListGroup.Item action className='p-0 border-bottom'>
          <NavLink to="/app/chats" className="text-decoration-none">{({ isActive }) => (
            <div className='d-flex gap-3 align-items-center p-4' style={{ backgroundColor: isActive ? '#343a40' : '', color: isActive ? '#ffffff' : '#dee2e6' }}>
              <ChatDotsFill style={{ width: '20px', height: '20px' }} />
              <span>Чат</span>
            </div>)}
          </NavLink>
        </ListGroup.Item>
      </ListGroup>
    </Col >
  )
}


export default Sidebar;