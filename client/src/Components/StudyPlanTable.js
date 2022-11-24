import {Table , Button} from 'react-bootstrap'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'


function StudyPlanTable(props)
{
    const [rowIndex, setRowIndex] = useState(-1);

    return(
        <>
        <h4>My Study Plan :</h4>
         <Table striped bordered hover className='mt-3'>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credit</th>
                    <th></th>
               
                </tr>
            </thead>
            <tbody>              
                    {props.studyPlanCourses ?
                    props.studyPlanCourses.map((row,index) =>
                        <CourseRow course={row} key={row.code} index={index} removeCourse={props.removeCourse} rowIndex={rowIndex} setRowIndex={setRowIndex} showColor={props.showColor} errMessage={props.errMessage} delErrMessage={props.delErrMessage}></CourseRow>
 
                    ) : <CourseEmptyRow></CourseEmptyRow>
                    }
                           
            </tbody>
        </Table>
        </>
    );
}

function CourseRow(props)
{
    return(
        <tr className={(props.rowIndex === props.index && props.delErrMessage && props.showColor!==false) ? "rowError" : "" }>
        <CourseData course={props.course}></CourseData>
        <CourseActions course={props.course} removeCourse={props.removeCourse} index={props.index} setRowIndex={props.setRowIndex} ></CourseActions>
        </tr>
    )
}

function CourseEmptyRow()
{
    return(
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    )
}

function CourseData(props)
{
    return(
        <>
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
        <td>{props.course.credit}</td>
        </>
    )
}

function CourseActions(props) {

    const handle=(event)=>
    {
        props.removeCourse(props.course)
        props.setRowIndex(props.index)
    }

    return <td>
        <Button size='sm' variant='danger' onClick={handle}><i className="bi bi-trash3"></i></Button>
    </td>
}

export {StudyPlanTable} 