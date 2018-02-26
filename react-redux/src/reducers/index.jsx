import { combineReducers } from "redux";

import { FETCH_PERSONAL_DATA, BIND_PERSONAL_DATA } from '../actions/personal';


const setPersonalData = (state = {}, action) => {

    switch (action.type) {
    case FETCH_PERSONAL_DATA:
        return Object.assign({}, action);
    default :
        return state;
    }
};

const renderPersonalData = (state = {}, action) => {

    switch (action.type) {
        case BIND_PERSONAL_DATA:
            return Object.assign({}, action);
        default :
            return state;
        }

}

const rootReducer = combineReducers({
    setPersonalData,
    renderPersonalData
});

export default rootReducer;