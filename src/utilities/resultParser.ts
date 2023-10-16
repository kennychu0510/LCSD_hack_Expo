import { load } from 'cheerio';

export enum Status {
  AVAILABLE = 'A',
  UNAVAILABLE = 'U',
}

export type ITimeSlot = {
  status: string;
  start: string;
  end: string;
  facilityName: string;
};

export type ISession = {
  venue: string;
  timeSlots: ITimeSlot[];
};

export function getSession(input: string): ISession | null {
  try {
    const $ = load(input);
    const venue = $('tr:nth-child(2) > td.resultTable-Header2').text();
    const availableTimeSlots: Omit<ITimeSlot, 'facilityName' | 'status'>[] = [];
    const timeSlots: ITimeSlot[] = [];

    const timeSlotRow = $('#searchResultTable > table > tbody > tr:nth-child(1) .gwt-HTML');
    for (const timeSlotCheerio of timeSlotRow) {
      const timeSlotString = $(timeSlotCheerio).text();
      const [startString, endString] = timeSlotString.split('|');
      const start = parseTimeString(startString);
      const end = parseTimeString(endString);
      availableTimeSlots.push({
        start,
        end,
      });
    }

    const resultRows = $('#searchResultTable > table > tbody > tr').slice(2);
    for (const row of resultRows) {
      const facilityName = $(row).children('td:nth-child(2)').text();
      const timeslotRows = $(row).children('td').slice(2);

      for (let i = 0; i < timeslotRows.length; i++) {
        const timeslotRow = timeslotRows[i];
        const status = $(timeslotRow).text();
        const timeSlotData: ITimeSlot = {
          ...availableTimeSlots[i],
          facilityName,
          status: getStatus(status),
        };
        timeSlots.push(timeSlotData);
      }
    }

    return {
      venue,
      timeSlots,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

function parseTimeString(time: string): string {
  return time.trim().replace(':', '');
}

function getStatus(input: string): Status {
  if (input.trim().length > 0) {
    return Status.UNAVAILABLE;
  }
  return Status.AVAILABLE;
}
