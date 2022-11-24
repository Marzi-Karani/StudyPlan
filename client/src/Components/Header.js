import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar , Container ,Col } from 'react-bootstrap'
import { NavLink ,useLocation } from "react-router-dom";
import '../App.css'

  //style={{color: 'white'}}
function Header(props)
{

  const location = useLocation();

    return(
    <Navbar className='Navbar-color' expand="sm" variant="light" fixed="top">
      <Container fluid>
      <Col className="col-md-6">
         <Navbar.Brand href="#">
       <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-mortarboard-fill" viewBox="0 0 16 16">
        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
       </svg>
       <span className='p-2' >Study Plan Portal</span>
       </Navbar.Brand>
       </Col>

      {location.pathname!=='/login' ?
       <Col className="d-flex justify-content-md-end">
       <Navbar.Text className="mx-2">
          {props.user && props.user.name && `Welcome, ${props.user.name}!`}
        </Navbar.Text>
       <ShowIcon loggedIn={props.loggedIn} logout={props.logout}></ShowIcon>
     
        </Col> :<></>
      }
       </Container>
    </Navbar>
    )
}

    function ShowIcon(props)
    {
      
      if(!props.loggedIn)
         {
          return(
              <NavLink to='/login' style={{color:'black'}}>Login</NavLink> 
          )
          }
          else
          {
            return(
            <NavLink to='/' onClick={() => props.logout()}>
            <span className="ms-auto" style={{color: 'black'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
            <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            </span>
               </NavLink>
            )
          }
    }


export {Header}