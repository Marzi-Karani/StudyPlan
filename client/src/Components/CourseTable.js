import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Table , Button} from 'react-bootstrap'
import {Fragment , useState } from 'react'
import '../App.css'


function CourseTable(props)
{
    const [state, setState] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    return(
        <>
        <h4>List of Courses :</h4>
        <Table striped bordered hover className='mt-3'>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credit</th>
                    <th>Enrolled Students</th>
                    <th>Max Students</th>
                    {props.loggedIn ? <th></th> : null}
               
                </tr>
            </thead>
            <tbody>
                {
                    props.courses.map((course,index) =>
                    <Fragment key={`${index}${course.code}`}>
                        <CourseRow course={course} key={course.code} index={index}  setState={setState} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} loggedIn={props.loggedIn} addCoursetoStudyPlan={props.addCoursetoStudyPlan} errMessage={props.errMessage} showColor={props.showColor} showStudyPlanForm={props.showStudyPlanForm}></CourseRow>
                        {course.showInfo ? (
                        <DetailsRow course={course} loggedIn={props.loggedIn} ></DetailsRow>
                        ) : null}
                    </Fragment>
                    )
                }
               
            </tbody>
        </Table>
        </>
    )
}

 const handleClick = (props) => {
    
    const course = props.course;

    if (course.showInfo) {
        delete course.showInfo;
    } else {
      course.showInfo=true;
    }
    props.setState((pre) => {
        return pre + 1;
      });
  }; 

function CourseRow(props)
{
    return(
        <tr style={{ cursor: "pointer" }}  onClick={() => handleClick(props)} className={(props.selectedIndex === props.index && props.errMessage && props.showColor!==false) ? "rowError" : "" } >
        <CourseData course={props.course}></CourseData>
        {props.loggedIn ? <CourseActions course={props.course} addCoursetoStudyPlan={props.addCoursetoStudyPlan} index={props.index} setSelectedIndex={props.setSelectedIndex} errMessage={props.errMessage} showStudyPlanForm={props.showStudyPlanForm}></CourseActions> : null}
        </tr>
    )
}


 function DetailsRow(props)
{
   return(
    <>
    <PreparatoryRow course={props.course} loggedIn={props.loggedIn}></PreparatoryRow>
    <IncompatibleRow course={props.course} loggedIn={props.loggedIn}></IncompatibleRow>
    </>
   )
}
function IncompatibleRow(props)
{

    return(
        props.course.incompatibleCourses.length>0 ? (<tr style={{backgroundColor:'#dff1f0'}}>
            <td colSpan={props.loggedIn ? 6 :5}>Incompatible Courses:   {props.course.incompatibleCourses.toString()}</td>
        </tr>): null
    )
}

function PreparatoryRow(props)
{
    return(
        props.course.preparatoryCourse ? (<tr style={{backgroundColor:'#dff1f0'}}>
            <td colSpan={props.loggedIn ? 6 :5}>Preparatory Course:   {props.course.preparatoryCourse}</td>
        </tr>): null
    )
}


function CourseData(props)
{
    return(
        <>
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
        <td>{props.course.credit}</td>
        <td>{props.course.enrolledCount}</td>
        <td>{props.course.maxStudents}</td>
        </>
    )
}

/* function DetailsData(props)
{
    return(
        <>
        <td colSpan='5'>incompatible Course:   {props.course}</td>
        </>
    )
}
 */
function CourseActions(props) {

    const handle=(event)=>
    {
         
        props.addCoursetoStudyPlan(props.course)
        props.setSelectedIndex(props.index)
        //if(props.errMessage)
         //   toast.error(props.errMessage,{position: toast.POSITION.TOP_CENTER});
    }
    return <td>
        <Button size='sm' variant='primary' disabled={!props.showStudyPlanForm} onClick={handle}><i className="bi bi-plus"></i></Button>
    </td>
}

export {CourseTable}