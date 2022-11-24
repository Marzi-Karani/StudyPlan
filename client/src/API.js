import Course from "./Course"
import StudyPlan from "./StudyPlan";

const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };

  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };
  
  const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }

const getAllCourses= async() => {
    const response= await fetch(SERVER_URL + '/api/courses')

    const courseJson= await response.json()
    if(response.ok)
    {
        return courseJson.map(course=> new Course(course.code,course.name,course.credit,course.maxStudents,course.preparatoryCourse,course.enrolledStudentCount,course.incompatibleCourses))
    }
    else
        throw courseJson

}


const addStudyPlan= async(studyPlan)=> {
    const response= await fetch(SERVER_URL + `/api/studyplan`,{
       method: 'Post',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'include',
       body : JSON.stringify(studyPlan)
    });
    if (response.ok) {
       return null;
    }
    else {
       const errMessage = await response.json();
       throw errMessage;
    }
 }

 const updateStudyPlan= async(studyPlan)=> {
  if(studyPlan!=null)
  {
    const response= await fetch(SERVER_URL + `/api/studyplan/${studyPlan.id}`,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body : JSON.stringify(studyPlan)
   });
   if (response.ok) {
      return null;
   }
   else {
      const errMessage = await response.json();
      throw errMessage;
   }
  }
 
}

 const getStudyPlan=async()=>{
    const response= await fetch(SERVER_URL + `/api/studyplan`,{
        credentials: 'include'
     });
     const studyPlanjson = await response.json();
     if (response.ok) {
        return new StudyPlan(studyPlanjson.id,studyPlanjson.studentCode,studyPlanjson.type,studyPlanjson.minCredit,studyPlanjson.maxCredit,studyPlanjson.totalCredit,studyPlanjson.courses);
     }
     else {
        const errMessage = await response.json();
        throw errMessage;
     }
 }

 const getStudyPlanCourses=async(id)=>{
    const response= await fetch(SERVER_URL + `/api/studyplan/${id}/courses`,{
        credentials: 'include'
     });
     const coursesJson = await response.json();
     if (response.ok) {
        return coursesJson.map(course=> new Course(course.code,course.name,course.credit,course.maxStudents,course.preparatoryCourse,course.enrolledStudentCount,course.incompatibleCourses))
     }
     else {
        const errMessage = await response.json();
        throw errMessage;
     }
 }

 const deleteStudyPlan = async () => {
    const response = await fetch(SERVER_URL +`/api/studyplan`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
  }



const API ={logIn,getUserInfo,logOut,getAllCourses,addStudyPlan,getStudyPlan,getStudyPlanCourses,deleteStudyPlan,updateStudyPlan}
export default API;
