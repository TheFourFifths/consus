import { Store } from 'consus-core/flux';

let students = {};
students[123456] = {
    id: 123456,
    name: 'John von Neumann',
    itemAddresses: []
};
let studentsByActionId = new Object(null);

class StudentStore extends Store {

    getStudentById(id) {
        return students[id];
    }

    getStudentByActionId(actionId) {
        return studentsByActionId[actionId];
    }

}

const store = new StudentStore();

store.registerHandler('NEW_STUDENT', data => {
    let student = {
        id: students.length,
        name: data.name,
        itemAddresses: []
    };
    studentsByActionId[data.actionId] = student;
    students.push(student);
});

store.registerHandler('NEW_CHECKOUT', data => {
    let student = store.getStudentById(data.studentId);
    student.itemAddresses = student.itemAddresses.concat(data.itemAddresses);
});

export default store;
