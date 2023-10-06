import VenueOptions from '../../assets/venueOptions.json';


type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Venue = Unpacked<typeof VenueOptions>;


export function getVenue(sport: ISport): Venue | undefined {
  return VenueOptions.find(item => item.sportValue === sport.value)
}