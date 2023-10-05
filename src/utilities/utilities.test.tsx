import { getSportIcon } from './sportIcon';

describe('sport icon', () => {
  test('return false for sports without icons', () => {
    expect(getSportIcon('ropeCourse')).toBe(null);
  });
  test('return non null if sport icon exists', () => {
    expect(getSportIcon('badminton')).not.toBe(null);
  });
});
