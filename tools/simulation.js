import commandLineArgs from 'command-line-args';
import Chance from 'chance';
import crypto from 'crypto';
import { Dispatcher } from 'consus-core/flux';
import CheckinStore from '../.dist/store/checkin-store';
import CheckoutStore from '../.dist/store/checkout-store';
import ItemStore from '../.dist/store/item-store';
import ModelStore from '../.dist/store/model-store';
import StudentStore from '../.dist/store/student-store';
import { createAddress } from 'consus-core/identifiers';

const seed = 1337;
const chance = new Chance(1337);

const options = commandLineArgs([
    {
        name: 'years',
        alias: 'y',
        type: Number,
        defaultValue: 1
    },
    {
        name: 'students',
        type: Number,
        defaultValue: 2500
    },
    {
        name: 'studentsPerYear',
        type: Number,
        defaultValue: 300
    },
    {
        name: 'models',
        type: Number,
        defaultValue: 400
    },
    {
        name: 'modelsPerYear',
        type: Number,
        defaultValue: 20
    },
    {
        name: 'items',
        type: Number,
        defaultValue: 750
    },
    {
        name: 'itemsPerYear',
        type: Number,
        defaultValue: 50
    },
    {
        name: 'checkoutsPerYear',
        type: Number,
        defaultValue: 8250
    }
]);

let years = options.years;

let actions = [];
let studentIds = [];
let modelAddresses = [];
let itemAddresses = [];

function addAction(type, data = Object.create(null)) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    actions.push({
        type,
        data
    });
}

for (let year = 1; year <= years; year++) {
    let students = year === 1 ? options.students : options.studentsPerYear;
    for (let i = 0; i < students; i++) {
        studentIds.push(studentIds.length + 1);
        addAction('NEW_STUDENT', {
            id: studentIds.length,
            name: chance.name()
        });
    }

    let models = year === 1 ? options.models : options.modelsPerYear;
    for (let i = 0; i < models; i++) {
        modelAddresses.push(createAddress(i, 'model'));
        addAction('NEW_MODEL', {
            name: chance.word()
        });
    }

    let items = year === 1 ? options.items : options.itemsPerYear;
    for (let i = 0; i < items; i++) {
        itemAddresses.push(createAddress(i, 'item'));
        addAction('NEW_ITEM', {
            modelAddress: modelAddresses[i % modelAddresses.length]
        });
    }

    let checkouts = options.checkoutsPerYear;
    for (let i = 0; i < checkouts; i++) {
        addAction('NEW_CHECKOUT', {
            studentId: studentIds[i % studentIds.length],
            itemAddresses: [itemAddresses[i % itemAddresses.length]]
        });
        addAction('CHECKIN', {
            studentId: studentIds[i % studentIds.length],
            itemAddress: itemAddresses[i % itemAddresses.length]
        });
    }
}

Dispatcher.handleAction('CLEAR_ALL_DATA');

let start = Date.now();

actions.forEach(action => {
    Dispatcher.handleAction(action.type, action.data);
});

console.log(`
Simulation completed!

Years: ${options.years}
Initial Students: ${options.students}
Initial Models: ${options.models}
Initial Items: ${options.items}
New Students Per Year: ${options.studentsPerYear}
New Models Per Year: ${options.modelsPerYear}
New Items Per Year: ${options.itemsPerYear}
New Checkouts Per Year: ${options.checkoutsPerYear}
Total Students: ${StudentStore.getStudents().length}
Total Models: ${ModelStore.getModels().length}
Total Items: ${ItemStore.getItems().length}
Total Checkouts: ${CheckoutStore.getCheckouts().length}

Time to process actions: ${Date.now() - start}ms`);
