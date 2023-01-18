// ** Navigation imports
import apps from './apps'
import pages from './pages'
import dashboards from './dashboards'
import uiElements from './ui-elements'
import formsAndTables from './forms-tables'
import customer from './customer'
import admin from './admin'

// ** Merge & Export

const navDrawer = []
navDrawer['admin'] = [...admin]
navDrawer['client'] = [...customer]

export default navDrawer