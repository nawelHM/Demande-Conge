import { createStore, combineReducers } from 'redux';

// Import your actual Redux reducer here (replace 'userReducer' with your reducer function)
import userReducer from './user/reducer';

const rootReducer = combineReducers({
  user: userReducer // Make sure 'userReducer' is the correct Redux reducer function
});

export const store = createStore(rootReducer);
