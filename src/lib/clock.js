import moment from 'moment-timezone';
import { sendOverdueItemNotifications } from './email.js';
import config from 'config';

const ONE_DAY = 1000*60*60*24;

//initialization code
function getInitialTimeoutTime(){
    let timestamp = moment.tz(Date.now(), config.get('timezone'));
    let hour = parseInt(timestamp.format('H'));
    let minute = parseInt(timestamp.format('m'));
    // check for times past 23:55 (11:55pm)
    if (hour > config.get('checkin.due_hour') || (hour === config.get('checkin.due_hour') && minute >= config.get('checkin.due_minute'))) {
        // increment to the next day
        timestamp = timestamp.add(1, 'd');
    }
    timestamp.hour(config.get('checkin.due_hour')).minute(config.get('checkin.due_minute')).second(0);
    return parseInt(timestamp.format('X')) - (Date.now()/1000);
}

setTimeout(() => {
    //set-up timeout to send notifications every day.
    setInterval(sendOverdueItemNotifications, ONE_DAY);
}, getInitialTimeoutTime());

export function isBeforeNow(timestamp){
    return timestamp < Date.now() / 1000;
}

export function dueDateToTimestamp(dueDate) {
    let timestamp;
    let timezone = 'America/Chicago';
    if (typeof dueDate === 'string') {
        // this means longterm checkout
        timestamp = moment.tz(dueDate, timezone);
    } else {
        // this means the equipment is due today, i.e. not longterm
        timestamp = moment.tz(dueDate * 1000, timezone);
    }
    let hour = parseInt(timestamp.format('H'));
    let minute = parseInt(timestamp.format('m'));
    // check for times past 23:55 (11:55pm)
    if (hour > config.get('checkin.due_hour') || (hour === config.get('checkin.due_hour') && minute >= config.get('checkin.due_minute'))) {
        // increment to the next day
        timestamp = timestamp.add(1, 'd');
    }
    timestamp.hour(config.get('checkin.due_hour')).minute(config.get('checkin.due_minute')).second(0);
    return parseInt(timestamp.format('X'));
}
