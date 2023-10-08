import { getSession } from '../resultParser';
import fs from 'fs'
const sample1 = fs.readFileSync('src/sampleResults/sample1.html', { encoding: 'utf-8'})
const sample2 = fs.readFileSync('src/sampleResults/sample2.html', { encoding: 'utf-8'})

describe('result parser', () => {
  test('get venue correctly', () => {
    expect(getSession(sample1)?.venue).toEqual('Chai Wan Sports Centre - Squash Court');
    expect(getSession(sample2)?.venue).toEqual('Cornwall Street Squash & Table Tennis Centre - Squash Court');
  });

  test('get timeslot correctly', () => {
    expect(getSession(sample1)?.timeSlots.find(item => item.start === "1800" && item.facilityName === 'Facility/Court No. 1')?.status).toBe('U');
    expect(getSession(sample1)?.timeSlots.find(item => item.start === "2030" && item.facilityName === 'Facility/Court No. 2')?.status).toBe('A');
    expect(getSession(sample2)?.timeSlots.find(item => item.start === "1130" && item.facilityName === 'Facility/Court No. 16')?.status).toBe('A');
    expect(getSession(sample2)?.timeSlots.find(item => item.start === "1130" && item.facilityName === 'Facility/Court No. 4')?.status).toBe('U');
  });
});
