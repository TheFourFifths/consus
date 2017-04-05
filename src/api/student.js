import express from 'express';
import StudentStore from '../store/student-store';
import { addAction } from '../lib/database';
import xlsx from 'xlsx';
import config from 'config';
let app = express();

app.get('/', (req, res) => {
    let student = StudentStore.getStudentByRfid(parseInt(req.query.rfid));
    let regex = new RegExp("^[a-zA-Z0-9]+$");

    if(!regex.test(req.query.rfid)){
        return res.failureJson('Invalid Characters in Student ID');
    }else if (typeof student === 'undefined') {
        return res.failureJson('The student could not be found.');
    }
    res.successJson(student);
});

app.get('/all', (req, res) => {
    res.successJson(StudentStore.getStudents());
});

app.patch('/', (req, res) => {
    addAction('UPDATE_STUDENT', {
        id: parseInt(req.query.id),
        name: req.body.name,
        status: req.body.status,
        email: req.body.email,
        major: req.body.major,
        rfid: parseInt(req.body.rfid)
    }).then(() => {
        res.successJson(StudentStore.getStudentById(req.query.id));
    });
});

app.post('/excel', (req, res) => {
    let workbook = xlsx.read(req.body.data, {type: 'binary'});
    let studentJSON;
    try{
        studentJSON = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {range:1});
    }catch (e) {
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

app.patch('/rfid', (req, res) => {
    if (!req.query.studentId) {
        return res.failureJson('Numeric student ID required when associating a studentId and RFID');
    }
    if (!req.body.rfid) {
        return res.failureJson('Rfid number required when associating a studentId and RFID');
    }
    let student = StudentStore.getStudentById(parseInt(req.query.studentId));
    if(student === undefined || student === null){
        return res.failureJson('The student ID does not exist.');
    }
    if(!StudentStore.isUniqueRfid(req.body.rfid)){
        return res.failureJson('The rfid is already associated with a student.');
    }
    if(student){
        let s = {
            id: student.id,
            name: student.name,
            status: student.status,
            email: student.email,
            major: student.major,
            rfid: parseInt(req.body.rfid)
        };
        addAction('UPDATE_STUDENT', s);

    }
    res.successJson(StudentStore.getStudentById(parseInt(req.query.studentId)));
});

app.post('/', (req, res) => {
    if(!req.body.studentId){
        return res.failureJson('A studentId is required to make a new Student');
    }
    if(!req.body.major){
        return res.failureJson('A major is required to make a new Student');
    }
    if(!req.body.email){
        return res.failureJson('An email is required to make a new Student');
    }
    if(!req.body.name){
        return res.failureJson('A name is required to make a new Student');
    }
    let student = {
        id: parseInt(req.body.studentId),
        name: req.body.name,
        email: req.body.email,
        major: req.body.major,
        rfid: parseInt(req.body.rfid),
        status: config.get('student.active_status')
    };
    console.log(student);
    if(StudentStore.isNewStudent(student)){
        addAction('NEW_STUDENT', student);
        return res.successJson();
    }else{
        return res.failureJson('The studentId(' + student.id + ') passed in is already in use!');
    }

});
export default app;
