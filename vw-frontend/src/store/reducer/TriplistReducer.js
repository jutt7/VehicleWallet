const initialState = {
    code: null,
    tripList: null,
    message: null,
    loadingFlag: { pageloading: true },
    actionType: null,
    seleted_trip_for_update: null,
    all_trips: null,
    goBackFlag: false,
};



const triplistReducer = (state = initialState, action) => {
    if (action.type === "GOT_TRIPLIST") {
        let currState = { ...state };
        if (action.payload.code) { currState.code = action.payload.code; } else { currState.code = 500 }
        currState.code = action.payload.code;
        currState.tripList = action.payload.tripList;
        currState.message = action.payload.message;
        currState.actionType = action.type;
        return currState;
    }
    if (action.type === "ERROR") {
        console.log(action.type)
        let currState = { ...state };
        currState.code = action.payload.code
        currState.tripList = []
        currState.message = action.payload.message;
        currState.actionType = action.type;
        return currState;
    }
    return state
}

export default triplistReducer;