import { nav_menu } from "../actionTypes"; 

const initialState = true;

const Navmenu = (state = initialState,action) => {
    switch (action.type) {
        case nav_menu:
            return action.data

        default:
            return state
    }
}

export default Navmenu;