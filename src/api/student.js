import express from 'express';
import StudentStore from '../store/student-store';

let app = express();

app.get('/', (req, res) => {
    let student = StudentStore.getStudentById(req.query.id);
    let regex = new RegExp("^[a-zA-Z0-9]+$");

    if(!regex.test(req.query.id)){
        return res.failureJson('Invalid Characters in Student ID');
    }else if (typeof student === 'undefined') {
        return res.failureJson('The student could not be found.');
    }
    res.successJson({
        student: {
            id: student.id,
            name: student.name,
            items: student.items.map(item => {
                return {
                    address: item.address,
                    modelAddress: item.modelAddress,
                    status: item.status
                };
            })
        }
    });
});

export default app;
