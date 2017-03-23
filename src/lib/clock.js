import moment from 'moment-timezone';
import { sendOverdueItemNotifications } from './email.js';

const ONE_DAY = 1000*60*60*24;

//initialization code
function getInitialTimeoutTime(){
    let timestamp = moment.tz(Date.now(), 'America/Chicago');
    let hour = parseInt(timestamp.format('H'));
    // check for times past 18:00 (6:00pm)
    if (hour >= 18) {
        // increment to the next day
        timestamp = timestamp.add(1, 'd');
    }
    timestamp.hour(18).minute(0).second(0);
    return parseInt(timestamp.format('X')) - (Date.now()/1000);
}

setTimeout(() => {
    //set-up timeout to send notifications every day.
    setInterval(sendOverdueItemNotifications, ONE_DAY);
}, getInitialTimeoutTime());

export function isBeforeNow(timestamp){
    return timestamp < Date.now() / 1000;
}
