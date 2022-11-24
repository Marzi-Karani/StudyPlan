'use strict'

function CourseDTO(code,name,credit,maxStudents,preparatoryCourse,enrolledStudentCount,incompatibleCourses)
{
    this.code=code;
    this.name=name;
    this.credit=credit;
    this.maxStudents=maxStudents;
    this.preparatoryCourse=preparatoryCourse;
    this.enrolledStudentCount=enrolledStudentCount;
    this.incompatibleCourses=incompatibleCourses;
}

module.exports=CourseDTO;