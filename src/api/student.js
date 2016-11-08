import express from 'express';
import StudentStore from '../store/student-store';

let app = express();

app.get('/', (req, res) => {
    let student = StudentStore.getStudentById(req.query.id);
    if (typeof student === 'undefined') {
        return res.failureJson('The student could not be found.');
    }
    res.successJson({
        student: {
            id: student.id,
            name: student.name,
            items: student.items
        }
    });
});

export default app;
