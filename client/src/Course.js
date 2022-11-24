
function Course(code,name,credit,maxStudents,preparatoryCourse,enrolledCount,incompatibleCourses)
{
    this.code=code;
    this.name=name;
    this.credit=credit;
    this.maxStudents=maxStudents;
    this.preparatoryCourse=preparatoryCourse;
    this.enrolledCount=enrolledCount;
    this.incompatibleCourses=incompatibleCourses?incompatibleCourses.filter(n=>n):null;
}

export default Course;