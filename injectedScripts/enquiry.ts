import { SCRIPT_FUNCTIONS } from './common';

export const setDropdown = (options: EnquiryInputOption) => {
  const optionsJSON = JSON.stringify(options);
  return /* js */ `
    (()=>{
      ${SCRIPT_FUNCTIONS}
      async function main() {
        try {
          
          const pathName = window.location.pathname;
          if (pathName.includes('/leisurelink/application/c ckCode.do')) {
            _consoleLog('Please Enter Enquiry Page', 'error');
            return;
          } else if (pathName.includes('/lcsd/leisurelink/common/timeout.jsp')) {
            _consoleLog('Please Reload Page', 'error');
            return;
          }

          const optionsJSON = ${optionsJSON};
          const { sport, facility_type, area, venue, date, venueName } = optionsJSON;

          const frame = document.querySelector('frame[name="main"]').contentDocument;
          const datePanel = await waitForElm('#DatePanel > select', frame);
          
          await setElementValue(datePanel, date);
          const sessionTimePanel = await waitForElm('#sessionTimePanel > select', frame);
          const facilityPanel = await waitForElm('#facilityPanel > select', frame);
          const facilityTypePanel = await waitForElm('#facilityTypePanel > select', frame);
          const areaPanel = await waitForElm('#areaPanel > select', frame);
          const prefPanel = await waitForElm('#preferencePanel', frame);
          const venuePanel = await waitForElm('.selectTextSize select', prefPanel);
          const locationPanel = await waitForElm('.formFieldSelectComponent40 > div > select', prefPanel);
          const locationOptions = locationPanel.options;
          const enquireButton = await waitForElm('.actionBtnContinue', frame);
          const resultsTable = await waitForElm('#searchResultTable', frame);
          const errorPanel = await waitForElm('#errorPanel', frame);

          
          /* 
          facility panel -> facility type panel
          facility type panel -> area panel
          area panel -> preference panel
          */

          for (let session_time of sessionTimePanel.options) {
            if (!session_time.value) continue;
            await setElementValue(datePanel, date);
            await setElementValue(facilityPanel, sport);
            await waitForLoading(facilityTypePanel);

            if (facilityTypePanel.options.length > 1) {
              await setElementValue(facilityTypePanel, facility_type);
            }

            await waitForLoading(areaPanel);

            await setElementValue(sessionTimePanel, session_time.value);

            if (areaPanel.options.length > 1) {
              await setElementValue(areaPanel, area);
              await waitForLoading(venuePanel);
            }

            await sleep(100)

            await setElementValue(venuePanel, venue);

          for (let option of locationOptions) {
            if (!option.value) continue;
            await setElementValue(locationPanel, option.value);
            
            enquireButton.click();
            await waitForChange(frame, 'page');
            if (errorPanel.style.display === '') {
              const query = session_time.innerHTML + ' ' + venueName + ' ' + option.innerHTML;
              const message = '<div style="color:red;"> No available sessions for ' + query + ' </div><br>';
              _consoleLog(message, 'results');
              continue;
            }
            
            const showBookingDetailsButton = await waitForElm('.gwt-HTML div', frame);
            showBookingDetailsButton.click();
            await waitForChange(resultsTable, 'results table');

            const availableTimeSlots = [];
            const timeSlots = [];
            const venue = resultsTable.querySelector('tr:nth-child(2) > td.resultTable-Header2').innerText

            const timeSlotRow = resultsTable.querySelectorAll('.timeSlotTable > tbody > tr:first-child .gwt-HTML')

            for (let i = 0; i < timeSlotRow.length; i++) {
                const row = timeSlotRow[i]
                const timeslot = row.innerText
                const [startString,endString] = timeslot.split('|')
                const start = parseTimeString(startString);
                const end = parseTimeString(endString);
                availableTimeSlots.push({
                    start,
                    end,
                })
            }

            const resultRows = resultsTable.querySelectorAll('.timeSlotTable > tbody > tr')
            for (let i = 2; i < resultRows.length; i++) {
                const row = resultRows[i]
                const facilityName = row.querySelector('td:nth-child(2)').innerText

                const timeslotRows = row.querySelectorAll('td')

                for (let j = 2; j < timeslotRows.length; j++) {
                    const timeslotRow = timeslotRows[j];
                    const status = timeslotRow.innerText
                    const timeSlotData = {
                        ...availableTimeSlots[j - 2],
                        facilityName,
                        status: getStatus(status),
                    };
                    timeSlots.push(timeSlotData);

                }
            }
            _consoleLog({venue, timeSlots}, 'results')
          }
          
        }
          _consoleLog('', 'done');
        } catch (error) {
          _consoleLog(error.message, 'error');
        }
      }
      main();
    })();
  `;
};
