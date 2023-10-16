import { SCRIPT_FUNCTIONS } from './common';
export const EXTRACT_SESSION = `js (function() {
  ${SCRIPT_FUNCTIONS}

    function parseTimeString(time) {
      return time.trim().replace(':', '');
    }

    function getStatus(input) {
      if (input.trim().length > 0) {
        return 'U';
      }
      return 'A';
    }


    const availableTimeSlots = [];
    const timeSlots = [];
    const venue = document.querySelector('tr:nth-child(2) > td.resultTable-Header2').innerText

    const timeSlotRow = document.querySelectorAll('#searchResultTable > table > tbody > tr:nth-child(1) .gwt-HTML')
    for (let row of timeSlotRow) {
      const timeslot = row.innerText
      const [startString, endString] = timeslot.split('|')
      const start = parseTimeString(startString);
      const end = parseTimeString(endString);
      availableTimeSlots.push({
        start,
        end,
      })
    }

    const resultRows = document.querySelectorAll('#searchResultTable > table > tbody > tr')
    for (let i = 2; i < resultRows.length; i++) {
      const row = resultRows[i]
      const facilityName = row.querySelector('td:nth-child(2)').innerText
      const timeslotRows = row.querySelectorAll('td')

      for (let i = 2; i < timeslotRows.length; i++) {
        const timeslotRow = timeslotRows[i];
        const status = timeslotRow.innerText
        const timeSlotData = {
          ...availableTimeSlots[i],
          facilityName,
          status: getStatus(status),
        };
        timeSlots.push(timeSlotData);
      }
    }
    _consoleLog({venue, timeSlots}, 'timeslots')
})();
  

`;
