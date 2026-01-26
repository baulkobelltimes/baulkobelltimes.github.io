// ICS Timetable Parser Utility

export const parseTimetable = (jcaldata) => {
  const classarray = [];
  const datearray = [];

  const firstmondayvevent = findFirstMonday(jcaldata);
  const firsteventdate = new Date(firstmondayvevent.toDateString());
  const lasteventdate = new Date(addDays(firstmondayvevent, 4).toDateString());

  let veventparseloop = 1;
  while (veventparseloop < jcaldata.length) {
    const currentvevent = jcaldata[veventparseloop][1];
    if (!currentvevent || !currentvevent[0]) {
      veventparseloop++;
      continue;
    }
    
    const currentveventdate = new Date(new Date(currentvevent[0][3]).toDateString());

    if ((currentveventdate <= lasteventdate) && (currentveventdate >= firsteventdate)) {
      const currentveventperiod = currentvevent[4]?.[3]?.split("\n")[1]?.replace("Period: ", "") || '';
      const currentveventname = currentvevent[5]?.[3] || '';
      const currentveventlocation = currentvevent[6]?.[3]?.replace("Room: ", "") || '';
      const currentveventteacher = capitalizeWords(currentvevent[4]?.[3]?.split("\n")[0]?.replace("Teacher:  ", "") || '');

      if (currentveventperiod.length <= 8) {
        if ((parseInt(currentveventperiod.slice(-1)) >= 1) && (parseInt(currentveventperiod.slice(-1)) <= 8)) {
          const periodNum = currentveventperiod.slice(-1);
          const tempclassdetails = [currentveventdate, periodNum, currentveventname, currentveventlocation, currentveventteacher];
          classarray.push(tempclassdetails);
          if (!isInArray(datearray, currentveventdate)) {
            datearray.push(currentveventdate);
          }
        }
      } else if (currentveventperiod === 'Roll Call') {
        const tempclassdetails = [currentveventdate, '0', currentveventname, currentveventlocation, currentveventteacher];
        classarray.push(tempclassdetails);
        if (!isInArray(datearray, currentveventdate)) {
          datearray.push(currentveventdate);
        }
      }
    }
    veventparseloop++;
  }
  
  return createTimetableJson(classarray, datearray);
};

const addDays = (date, days) => {
  const result = new Date(date.valueOf());
  result.setDate(result.getDate() + days);
  return result;
};

const isInArray = (array, value) => {
  return array.some(item => item.getTime() === value.getTime());
};

const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const findFirstMonday = (jcaldata) => {
  for (let i = 0; i < jcaldata.length; i++) {
    if (jcaldata[i][1] && jcaldata[i][1][0]) {
      const date = new Date(jcaldata[i][1][0][3]);
      if (date.getDay() === 1) {
        return date;
      }
    }
  }
  return new Date();
};

const createTimetableJson = (classarray, datearray) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timetabledict = {};
  let x = 0;

  for (let i = 0; i < datearray.length; i++) {
    const tempdaydict = {};
    let daycompleted = false;

    while (!daycompleted && x < classarray.length) {
      const classlistitemtemp = classarray[x];
      if (classlistitemtemp[0].getTime() === datearray[i].getTime()) {
        const periodKey = classlistitemtemp[1];
        tempdaydict[periodKey] = [
          classlistitemtemp[2],
          classlistitemtemp[3],
          classlistitemtemp[4]
        ];

        if (classarray[x + 1] !== undefined) {
          x++;
        } else {
          timetabledict[days[datearray[i].getDay()]] = tempdaydict;
          daycompleted = true;
        }
      } else {
        timetabledict[days[datearray[i].getDay()]] = tempdaydict;
        daycompleted = true;
      }
    }
  }
  
  return timetabledict;
};

export default parseTimetable;
