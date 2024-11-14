export const BASEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const STATE_URLs = {
  allStates: `${BASEURL}/api/v1/states`,
  addNewState: `${BASEURL}/api/v1/state`,
  editState: `${BASEURL}/api/v1/state`,
  stateInfo: `${BASEURL}/api/v1/state`,
  deleteState: `${BASEURL}/api/v1/state`,
};
export const CITY_URLs = {
  allCities: `${BASEURL}/api/v1/cities`,
  addNewCity: `${BASEURL}/api/v1/city`,
  editCity: `${BASEURL}/api/v1/city`,
  cityInfo: `${BASEURL}/api/v1/city`,
  deleteCity: `${BASEURL}/api/v1/city`,
};
export const LOCATION_URLs = {
  allLocations: `${BASEURL}/api/v1/locations`,
  addNewLocation: `${BASEURL}/api/v1/location`,
  editLocation: `${BASEURL}/api/v1/location`,
  locationInfo: `${BASEURL}/api/v1/location`,
  deleteLocation: `${BASEURL}/api/v1/location`,
  deleteLocationImage: `${BASEURL}/api/v1/location/image`,
  updateLocationImage: `${BASEURL}/api/v1/location/image`,
  addMoreLocationImage: `${BASEURL}/api/v1/location/image`,
};
export const ADMIN_URLs = {
  createAdmin: `${BASEURL}/api/v1/admin/create`,
  login: `${BASEURL}/api/v1/admin/login`,
  logout: `${BASEURL}/api/v1/logout`,
  getMyProfile: `${BASEURL}/api/v1/me`,
};
export const LEAD_URLs = {
  createLead: `${BASEURL}/api/v1/lead`,
  getLeads: `${BASEURL}/api/v1/leads`,
  updateLead: `${BASEURL}/api/v1/lead`,
  deleteLead: `${BASEURL}/api/v1/lead`,
};
