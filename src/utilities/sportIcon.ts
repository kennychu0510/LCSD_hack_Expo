import sportIcons from '../../assets/sportIcons';

type SportsWithIcon = keyof typeof sportIcons;
const SportWithIconKeys = Object.keys(sportIcons);

console.log(SportWithIconKeys);

function assertSport(sport: string): sport is SportsWithIcon {
  return SportWithIconKeys.includes(sport);
}

export function getSportIcon(sport: string) {
  const sportKey = sport.replace(/\s/g, '');

  if (assertSport(sportKey)) {
    return sportIcons[sportKey];
  }
  return sportIcons.lcsd_logo;
}
