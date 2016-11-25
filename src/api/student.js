import express from 'express';
import StudentStore from '../store/student-store';

let app = express();

app.get('/', (req, res) => {
    let regex = new RegExp("^[a-zA-Z0-9]*$");
    let student = StudentStore.getStudentById(req.query.id);
    if (typeof student === 'undefined') {
        return res.failureJson('The student could not be found.');
    }else if(!regex.test(req.query.id)){
        return res.failureJson('Invalid characters in student ID');
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
