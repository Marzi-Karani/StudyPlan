'use strict';

class studyPlanDAO
{
     sqlite = require('sqlite3');
     Course = require("./CourseDTO");

     constructor() {
        this.db = new this.sqlite.Database('StudyPlan.db', (err) => {
            if (err) throw err;
        });
    }

    addStudyPlan(studentId,studentCode,type,minCredit, maxCredit,totalCredit) {
        return new Promise((resolve, reject) => {

            const sql = `INSERT INTO studyPlan(studentId, studentCode, type, minCredit, maxCredit,totalCredit)
                         VALUES (?, ?, ?, ?, ?,?)`;
            this.db.run(sql, [studentId, studentCode, type, minCredit, maxCredit,totalCredit], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(this.lastID); 
               
            }  
 
            });
        });
    }

    async addCoursestoStudyPlan(studentId,studentCode,type,minCredit, maxCredit,totalCredit,couseCodes)
    {
        let studyPlanId=await this.addStudyPlan(studentId,studentCode,type,minCredit, maxCredit,totalCredit);

        return new Promise((resolve, reject) => {
        const sql2 = `INSERT INTO studyPlanCourses(studyPlanId, courseCode)
        VALUES (?, ?)`;
       // this.db.serialize(()=>{
        couseCodes.forEach(code => {         
                this.db.run(sql2, [studyPlanId, code], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                }
        )});

        resolve(true)
    //});
    })
    }

    getStudyPlan(userId)
    {
        return new Promise((resolve, reject) => {
            const sql = "SELECT studyPlan.*,json_group_array(studyPlanCourses.courseCode) as courses  FROM studyPlan left join studyPlanCourses on studyPlan.Id=studyPlanCourses.studyPlanId   where studentId=?";
            this.db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err)
                return
            }
            else {
               // const courses =rows.map(row => new this.Course(row.code, row.name, row.credit,row.maxStudents,row.preparatoryCourse,row.enrolledcount,JSON.parse(row.incompatibleCourses)   ));
                resolve(row);
            }
        });
    });
    }

    getStudyPlanCourses(studyPlanId)
    {
        return new Promise((resolve, reject) => {
            const sql = "SELECT course.* FROM course inner join studyPlanCourses  on course.code=studyPlanCourses.courseCode  where studyPlanId=? order by course.name";
            this.db.all(sql, [studyPlanId], (err, rows) => {
            if (err) {
                reject(err)
                return
            }
            else {
                const courses =rows.map(row => new this.Course(row.code, row.name, row.credit,row.maxStudents,row.preparatoryCourse ,null,null ));
                resolve(courses);
            }
        });
    });
    }



    async deleteStudyPlan(userId)
    {
        const studyPlan=await this.getStudyPlan(userId)
        if(studyPlan!=null && studyPlan!=undefined)
        {
            const result=await this.deleteStudyPlanCourses(studyPlan.id)
            if(result)
            {
                return new Promise((resolve, reject) => {
                const sql = "delete  FROM studyPlan  where id=? ";
                this.db.run(sql, [studyPlan.id], (err) => {
                 if (err) {
                    reject(err)
                    return
                    }
                 else {
                     resolve(true);
                    }
                });
            });
            }
        }

    }

     deleteStudyPlanCourses(studyPlanId)
    {
        return new Promise((resolve, reject) => {

            const sql = "delete  FROM studyPlanCourses  where studyPlanId=? ";
            this.db.run(sql, [studyPlanId], (err) => {
            if (err) {
                reject(err)
                return
            }
            else {
                resolve(true);
            }
        });
    });
    }

    async updateStudyPlan(id,studentId,studentCode,type,minCredit, maxCredit,totalCredit,courseCodes)
    {
        return new Promise((resolve, reject) => {
            this.db.serialize(()=>{

                const sql = "update studyPlan set studentId=? , studentCode=? , type=? , minCredit=? ,maxCredit=?, totalCredit=?  where id=? ";
                this.db.run(sql, [studentId,studentCode,type,minCredit, maxCredit,totalCredit,id], (err) => {
                    if (err) { reject(err) }
                });

                const sql2 = "delete  FROM studyPlanCourses  where studyPlanId=? ";
                this.db.run(sql2, [id], (err) => {
                if (err) {
                reject(err) }
                });
                
                const sql3 = `INSERT INTO studyPlanCourses(studyPlanId, courseCode) VALUES (?, ?)`;
                courseCodes.forEach(code => {
                    this.db.run(sql3, [id, code], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    })
                });

                resolve(true)

            })
        })

    }

    async updateStudyPlanCourses(id,studentId,studentCode,type,minCredit, maxCredit,totalCredit,courseCodes)
    {
            await this.updateStudyPlan(id,studentId,studentCode,type,minCredit, maxCredit,totalCredit);

            const deleteResult=await this.deleteStudyPlanCourses(id)
            if(deleteResult)
            {
                const sql2 = `INSERT INTO studyPlanCourses(studyPlanId, courseCode)
                VALUES (?, ?)`;
             
                    this.db.serialize(()=>{
                        courseCodes.forEach(code => {
                        this.db.run(sql2, [id, code], function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        })
                    })
                });
            }

        
           
        }



}

module.exports=studyPlanDAO;