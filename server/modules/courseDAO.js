'use strict';


class courseDAO
{
     sqlite = require('sqlite3');
     Course = require("./CourseDTO");

     constructor() {
        this.db = new this.sqlite.Database('StudyPlan.db', (err) => {
            if (err) throw err;
        });
    }

    getAllCourses(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT course.*,json_group_array(distinct incompatibleCourses.Course2) as incompatibleCourses, count(studyPlanId) as enrolledcount FROM course left join studyPlanCourses on course.code=studyPlanCourses.coursecode left join incompatibleCourses on course.code=incompatibleCourses.course1 group by course.code order by name";
            this.db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            else {
                const courses =rows.map(row => new this.Course(row.code, row.name, row.credit,row.maxStudents,row.preparatoryCourse,row.enrolledcount,JSON.parse(row.incompatibleCourses)   ));
                resolve(courses);
            }
        });
    });
    }


}

module.exports=courseDAO;





