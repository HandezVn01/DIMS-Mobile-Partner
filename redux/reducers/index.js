import { combineReducers } from 'redux';
import auth from './authReducer';
import loadingReducer from './loadingReducer';
import menuReducer from './MenuItemReducer';
export default combineReducers({
    auth,
    loadingReducer,
    menuReducer,
});
