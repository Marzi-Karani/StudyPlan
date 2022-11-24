import { Form, Row, Col, Button , Alert} from 'react-bootstrap';
import { useState } from "react";
import {  useNavigate } from 'react-router-dom';

function LoginForm(props) {

    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        props.login(credentials)
        .then( () => navigate('/studyplan')  )
        .catch((err) => { 
            setErrorMessage(err); setShowAlert(true); 
      });
    };

    return (

        <Form  onSubmit={handleLogin}>
        <Row className="justify-content-md-center" >
                <Col md={4}>
                    <Form.Group className='mb-3' controlId='username'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6} />
                    </Form.Group>
                    <Row className="justify-content-md-center" >
                        <Col md={2}>
                        <Button  className="mt-3" type="submit">Login</Button>
                        </Col>
                           
                            </Row>

                            <Alert style={{ marginTop:20 }} variant='danger' dismissible
                    show={showAlert}   onClose={() => setShowAlert(false)}>{errorMessage}</Alert>
  
                    </Col>
                    </Row>

        </Form>


    );


}

export { LoginForm };