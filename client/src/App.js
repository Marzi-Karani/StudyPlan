import './App.css';
import {StudyPlanRoute , LoginRoute, DefaultRoute}  from './Components/StudyPlanView'
import { Home } from './Components/HomeView';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import API from './API';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {


  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);


  



  useEffect(() => {
    const checkAuth = async () => {
      const user=await API.getUserInfo(); // we have the user info here
      if(user!==undefined)
      {
        setUser(user);
        setLoggedIn(true);
      }
    
    };
    checkAuth();
  }, []);







  const handleLogin = async (credentials) => {
    try {
      setMessage('')
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      console.log(err);
      throw err;
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setUser(null);
    setLoggedIn(false);
    setMessage('');
  };


  return (
    
    <BrowserRouter>
    <Routes>
    <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginRoute login={handleLogin} message={message} setMessage={setMessage} />
          } />
    <Route path='/' element={
             loggedIn ?  <Navigate replace to='/studyplan' />   
            : <Home  loggedIn={loggedIn} logout={handleLogout} user={user} />} 
          />
    <Route path='/studyplan' element={
             loggedIn ?  <StudyPlanRoute user={user} loggedIn={loggedIn} logout={handleLogout}    /> 
                      : <Navigate replace to='/' />} 
          />
    <Route path='*' element={ <DefaultRoute/> } />
    </Routes>
    <ToastContainer />
    </BrowserRouter>
  );


  
}



export default App;
