import { combineReducer } from 'redux';

import { FETCH_PERSONAL_DATA } from '../actions/personal';

const setPersonalData = (state = {data: []}, action) => {


console.log(action.type);
debugger;

    switch (action.type) {
    case FETCH_PERSONAL_DATA:
        return Object.assign({}, action);
    default :
        return state;
    }
};

const rootReducer = combineReducer({
    setPersonalData
});

export default rootReducer;