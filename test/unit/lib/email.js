// import { assert } from 'chai';
// import StudentStore from '../../../.dist/store/student-store';
// import * as email from '../../../.dist/lib/email';
// import sinon from 'sinon';
//
// describe("Email system", () => {
//     it("Sends an email to the correct students", () => {
//         let getStudentsWithOverdueItems = sinon.stub(StudentStore, "getStudentsWithOverdueItems");
//         getStudentsWithOverdueItems.returns([
//             {email: 'trevinhofmann@gmail.com'}
//         ]);
//         let spy = sinon.spy(email, 'sendMail');
//         return email.sendOverdueItemNotifications().then(() => {
//             assert.isTrue(spy.called, "Spy should be called");
//             StudentStore.getStudentsWithOverdueItems.restore();
//         });
//     }).timeout(15000);
// });
