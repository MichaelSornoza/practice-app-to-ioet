const fs = require('fs');

const PATH = './resources/data.txt';

const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const timeInNumber = time => Number(time.slice(0, 2)) + Number(time.slice(time.search(':') + 1, time.length)) / 60;

const obtainTime = (entrance, exit) => {
    if (exit == 0) {
        return 24 - entrance;
    } else {
        return exit > entrance ? exit - entrance: entrance - exit;
    }
}

const obtainPrice = (initHour, workedTime, day) => {
    if (isWeekend(day)) {
        if(initHour > 18) {
            return workedTime * 25;
        } else if(initHour > 9) {
            return workedTime * 20;
        } else {
            return workedTime * 30;
        }
    } else {
        if(initHour > 18) {
            return workedTime * 20;
        } else if(initHour > 9) {
            return workedTime * 15;
        } else {
            return workedTime * 25;
        }
    }
}
 
const isInRange = day => {
    
    for (let i = 0; i < DAYS.length; i++) {
        if(day == DAYS[i]) {
            return true;
        } else {
            if(i == DAYS.length-1) {
                return false;
            }
        }
    }

}
const isWeekend = day => day == 'SA' || day == 'SU' ? true : false;

fs.readFile(PATH, 'utf8', (error, data) => {
    if (error) throw error;

    const ORDER_DATA = data.split('\n');

    ORDER_DATA.map(el => {
        const HORARY = el.slice(el.search('=') + 1, el.length).split(',');
        let mountToPay = 0;
        let name = el.slice(0, el.search('='));

        HORARY.map(i => {
            let day = i.slice(0 ,2);
            if(isInRange(day)) {
                let workedHours = i.slice(2, i.length).split('-');
                let time = obtainTime(timeInNumber(workedHours[0]), timeInNumber(workedHours[1]));
                let valuePerDay = obtainPrice(timeInNumber(workedHours[0]), time, day);
                mountToPay += valuePerDay;
            } else {
                console.log('Has ocurred an error in the data input, check data');
            }
        });
        console.log(`The mount to pay ${name} is: ${mountToPay}`);
    });
});