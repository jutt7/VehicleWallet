// ** Navigation imports

import customer from "./customer";
import admin from "./admin";
import gasStation from "./gasStation";
import supervisor from "./supervisor";

// ** Merge & Export
const navDrawer = [];

navDrawer["admin"] = [...admin];
navDrawer["client"] = [...customer];
navDrawer["gas station"] = [...gasStation];
navDrawer["supervisor"] = [...supervisor];

export default navDrawer;
