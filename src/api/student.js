import express from 'express';
import StudentStore from '../store/student-store';
import { addAction } from '../lib/database';
import xlsx from 'xlsx';
let app = express();

app.get('/', (req, res) => {
    let student = StudentStore.getStudentById(req.query.id);
    let regex = new RegExp("^[a-zA-Z0-9]+$");

    if(!regex.test(req.query.id)){
        return res.failureJson('Invalid Characters in Student ID');
    }else if (typeof student === 'undefined') {
        return res.failureJson('The student could not be found.');
    }
    res.successJson(student);
});

app.get('/all', (req, res) => {
    res.successJson(StudentStore.getStudents());
});

app.post('/', (req, res) => {
    let workbook = xlsx.read(req.body.data, {type: 'binary'});
    let studentJSON;
    try{
        studentJSON = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {range:1});
    }catch (e) {
        res.status(400);
        return res.failureJson('File not in the correct format!');
    }
    for (let key in studentJSON) {
        if (studentJSON.hasOwnProperty(key)) {
            let s = studentJSON[key];
            let student = {
                id: s['Student ID'],
                name: s['Student'],
                status: s['Status'],
                email: s['E-mail'],
                major: s['Major']
            };
            if (student.id === undefined || student.name === undefined || student.status === undefined ||
                    student.email === undefined || student.major === undefined) {
                res.status(400);
                return res.failureJson('File not in the correct format!');
            }
            if (StudentStore.isCurrentStudent(student) && StudentStore.isNewStudent(student)) {
                addAction('NEW_STUDENT', student);
            }else {
                addAction('UPDATE_STUDENT', student);
            }
        }
    }
    res.successJson();
});
export default app;
