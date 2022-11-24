import { Header } from "./Header";
import {StudyPlanForm} from './StudyPlanForm'
import { CourseTable } from "./CourseTable"
import {LoginForm} from "./LoginForm"
import {Row , Col , Button} from 'react-bootstrap'
import { useState , useEffect } from "react";
import {toast } from 'react-toastify';
import API from "../API";
import StudyPlan from "../StudyPlan";
import {Link} from "react-router-dom"

function StudyPlanRoute(props)
{
  const [studyPlanState, setStudyPlanState] = useState(null);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [sumCredit,setSumCredit]=useState(0)
  const [errMessage, setErrMessage] = useState('');
  const [delErrMessage, setDelErrMessage] = useState('');
  const [showColor, setShowColor] = useState(false);
  const [showStudyPlanForm,setShowStudyPlanForm]=useState(false)
  const [courses,setCourses]=useState([])
  const [reloadData,setReloadData]=useState(false)


  useEffect(() => {
      getStudyPlan();
      getCourses();
  }, [reloadData]);

  useEffect(() => {
    if(errMessage!=='')
      errMessage.type='error' ?   toast.error(errMessage.msg,{
        // Set to 15sec
          position: toast.POSITION.TOP_CENTER}) :  toast.success(errMessage.msg,{
            // Set to 15sec
              position: toast.POSITION.TOP_CENTER})

  }, [errMessage]);

  useEffect(() => {
    if(delErrMessage!=='')
      toast.error(delErrMessage.msg,{
        // Set to 15sec
          position: toast.POSITION.TOP_CENTER}) 

  }, [delErrMessage]);

  const resetMessages=()=>
  {
    setErrMessage('')
    setDelErrMessage('')
  }

  const getCourses = async() => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  const getStudyPlan = async () => {
    setShowColor(false)
    setReloadData(false)
    const studyPlan=await API.getStudyPlan();
    if(studyPlan.id!=null)
    {
      setStudyPlanState(studyPlan);
      setSumCredit(studyPlan.totalCredit)
      const courses=await API.getStudyPlanCourses(studyPlan.id);
      setStudyPlanCourses(courses);
      setShowStudyPlanForm(true)
    } 
    else
    {
      setStudyPlanState(null);
      setSumCredit(0)
      setStudyPlanCourses([]);
    } 
  };

  const addStudyPlan = async (studyPlan) => {

      setShowColor(false)
      if(checkStudyPlanCredit(studyPlan.minCredit,studyPlan.maxCredit))
      {
        let courseCodes = studyPlanCourses.map(course => course.code);
        const newstudyPlan=new StudyPlan('',props.user.code,studyPlan.type,studyPlan.minCredit,studyPlan.maxCredit,studyPlan.totalCredit,courseCodes)
     
        const err=await API.addStudyPlan(newstudyPlan);
        if(err===null)
        {
          setReloadData(true)
         setErrMessage({msg:'study plan created successfully',type:'success'})
        }
        else
        {
         setErrMessage({msg:'error in database',type:'error'})
        }
       
      }
   

  };

  const checkStudyPlanCredit=(minCredit,maxCredit)=>
  {
    resetMessages('')
    setShowColor(false)
    if(sumCredit<minCredit || sumCredit>maxCredit)
    {
      setErrMessage({msg:`error in number of credits.it should be min ${minCredit} and max ${maxCredit}`,type:'error'})
      return false
    }
    return true
        
  }

  

  const deleteStudyPlan = async () => {
    const err=await API.deleteStudyPlan();
    if(err===null)
       {
        setShowStudyPlanForm(false)
        setReloadData(true)     
       // setErrMessage({msg:'study plan deleted successfully',type:'success'})
       }
       else
       {
        setErrMessage({msg:'error in database',type:'error'})
       }
  };



  const updateStudyPlan =async  (studyPlan) => {  
    setShowColor(false)
    if(checkStudyPlanCredit(studyPlan.minCredit,studyPlan.maxCredit))
    {
      let courseCodes = studyPlanCourses.map(course => course.code);
      const editedstudyPlan=new StudyPlan(studyPlanState.id,studyPlanState.studentCode,studyPlan.type,studyPlan.minCredit,studyPlan.maxCredit,studyPlan.totalCredit,courseCodes)
       const err=await API.updateStudyPlan(editedstudyPlan);

       if(err===null)
       {
        setReloadData(true)
        setErrMessage({msg:'study plan updated successfully',type:'success'})
       }
       else
       {
        setErrMessage({msg:'error in database',type:'error'})
       }
       
    }

  };


  const handleStudyPlanValidation=(course) =>
  {
    resetMessages('')
    setShowColor(true)
    let isValid=true;

    if(studyPlanCourses.some(x => x.code===course.code))
    {
      isValid = false;
      setErrMessage({msg:`course ${course.code} already exists in study plan`,type:'error'})
    }
    if (course.preparatoryCourse!==null && !studyPlanCourses.some(x => x.code===course.preparatoryCourse)) 
    {
      isValid = false;
      setErrMessage({msg:`course ${course.code} cannot be added. it has a preparatory course which is not in study plan`,type:'error'})
    }
       
    if(course.incompatibleCourses.length>0)
    {
      course.incompatibleCourses.forEach(code => {
        if(studyPlanCourses.some(x => x.code===code))
        {
          isValid=false;
          setErrMessage({msg:`course ${course.code} cannot be added. it is incompatible with one course which is in study plan`,type:'error'})
        }
           
      });
    }

    if(course.maxStudents && course.enrolledCount=== course.maxStudents)
    {
      isValid=false;
      setErrMessage({msg:`course ${course.code} cannot be added. it already reaches its enrolled count limitation`,type:'error'})
    }

  return isValid

  }

  const handleRemovingfromStudyPlanValidation=(course) =>
  {
    resetMessages('')
    setShowColor(true)
    let isValid=true;
    if (studyPlanCourses.some(x => x.preparatoryCourse===course.code)) 
    {
      isValid = false;
      setDelErrMessage({msg:`course ${course.code} cannot be deleted. it is a preparatory course for a course in studyplan`,type:'error'})
    }
       
    return isValid

  }

  const addCoursetoStudyPlan= (course)=>
  {
    if(handleStudyPlanValidation(course))
    {
      setStudyPlanCourses(oldcourses => [...oldcourses, course])
      setSumCredit(sumCredit+course.credit)
    }
   /*  else
    {
      toast.error(errMessage,{
        // Set to 15sec
        position: toast.POSITION.TOP_CENTER});
    }  */
  }

  const removeCoursefromStudyPlan= (course)=>
  {
    if(handleRemovingfromStudyPlanValidation(course))
    {
      setStudyPlanCourses((oldcourses) => oldcourses.filter(e => e.code !== course.code));
      setSumCredit(sumCredit-course.credit)
    }
   /*  else
    {
      toast.error(errMessage,{
        // Set to 15sec
        position: toast.POSITION.TOP_CENTER});
    } */
      
    
  }



    return(
      <>
         <Header loggedIn={props.loggedIn} logout={props.logout} message={props.message} user={props.user}/>
        <Row className="justify-content-md-center p-2" style={{ marginTop:80 }}>
        <Col md={10}>
    
        {props.loggedIn   && !studyPlanState &&
        <Button variant='primary' onClick={()=>setShowStudyPlanForm(true)}>create my study plan</Button>
       } 
        </Col>
        </Row>
        <Row className="justify-content-md-center p-2">
          <Col md={10}>
          {props.loggedIn  &&  showStudyPlanForm && 
          <StudyPlanForm studyPlan={studyPlanState} studyPlanCourses={studyPlanCourses} sumCredit={sumCredit} removeCourse={removeCoursefromStudyPlan} addStudyPlan={addStudyPlan} updateStudyPlan={updateStudyPlan} deleteStudyPlan={deleteStudyPlan} getStudyPlan={getStudyPlan} errMessage={errMessage} showColor={showColor} setShowColor={setShowColor} delErrMessage={delErrMessage} ></StudyPlanForm>
          }
          </Col>
        </Row>
        <Row className="justify-content-md-center p-2 mt-2" >
            <Col md={10}>
                <CourseTable courses={courses} loggedIn={props.loggedIn} addCoursetoStudyPlan={addCoursetoStudyPlan} errMessage={errMessage} showColor={showColor} showStudyPlanForm={showStudyPlanForm}></CourseTable>
            </Col>    
        </Row>
 
        </>
    );   
}


function LoginRoute(props) {
    return(
      <>
        <Header />
        <Row className="justify-content-md-center">
          <Col xs={5}>
            <h1>Login</h1>
          </Col>
        </Row>
        <Row style={{ marginTop:30 }}>
          <Col>
            <LoginForm login={props.login} message={props.message} setMessage={props.setMessage}/>
          </Col>
        </Row>
      </>
    );
  }

  function DefaultRoute() {
    return(
      <>
        <Row>
          <Col>
            <p>This is not the route you are looking for!</p>
            <Link to="/">
            <Button variant="primary">Go Home!</Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }

 

export {StudyPlanRoute, LoginRoute , DefaultRoute}
