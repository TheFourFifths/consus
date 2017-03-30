import config from 'config';
import nodemailer from 'nodemailer';
import StudentStore from '../store/student-store';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get('notifications.gmail.user'),
        pass: config.get('notifications.gmail.password')
    }
});

export function sendMail(emails) {
    let bcc = emails.join(',');
    let subject = 'Tech Support Notification: Overdue Equipment';
    let body = 'Hello,%0A%0AOur records indicate that you have overdue equipment that was checked out from Tech Support. Please visit us soon to return the equipment.%0A%0AThank you!';
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: config.get('notifications.gmail.user'),
            to: config.get('notifications.gmail.recipient'),
            subject: 'Tech Support Notification',
            html: `
                <h1>Tech Support Notification</h1>
                <p>
                    Please click on the following link to send a notification email to students with overdue items:
                    <a href="mailto:?bcc=${bcc}&subject=${subject}&body=${body}">Click here to send!</a>
                </p>
            `
        }, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export function sendOverdueItemNotifications(){
    let emails = StudentStore.getStudentsWithOverdueItems().map(student => student.email);
    return this.sendMail(emails);
}

export { transporter };
