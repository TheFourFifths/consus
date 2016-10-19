import express from 'express';
import StudentStore from '../store/student-store';

let app = express();

app.get('/', (req, res) => {
    let student = StudentStore.getStudentById(req.query.id);
    res.successJson({
        student: {
            id: student.id,
            name: student.name,
            itemAddresses: student.itemAddresses
        }
    });
});

export default app;
