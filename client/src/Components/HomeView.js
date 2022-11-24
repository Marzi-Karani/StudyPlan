import { Header } from "./Header";
import { CourseTable } from "./CourseTable"
import {Row , Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import API from "../API";

function Home(props)
{

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getCourses();
      }, []);

      
    const getCourses = async() => {
        const courses = await API.getAllCourses();
        setCourses(courses);
      };
    return(
      <>
        <Header loggedIn={props.loggedIn} logout={props.logout} message={props.message} user={props.user}/>
        <Row className="justify-content-md-center" style={{ marginTop:80 }}>
            <Col xs={10}>
                <CourseTable courses={courses} loggedIn={props.loggedIn}></CourseTable>
            </Col>   
        </Row>   
        </>
    );   
}
export {Home}