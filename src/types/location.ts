interface IlocationCoordinates {
  human_address: string;
  latitude: string;
  longitude: string;
}

export interface ILocationData {
  address: string;
  applicant: string;
  approved: string;
  block: string;
  blocklot: string;
  cnn: string;
  expirationdate: string;
  facilitytype: string;
  fooditems: string;
  latitude: string;
  location: IlocationCoordinates;
  locationdescription: string;
  longitude: string;
  lot: string;
  objectid: string;
  permit: string;
  priorpermit: string;
  received: string;
  schedule: string;
  status: string;
  x: string;
  y: string;
}
