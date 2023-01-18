const initialState = {
    data: []
};

const monitoringMapData = (state = initialState, action) => {
    if (action.type === "GET_ MONITORING_MAP_DATA") {
        let currState = { ...state };
        currState.data = action.payload.data;
        return currState
    }
    else{
        return state
    }
}

export default monitoringMapData;