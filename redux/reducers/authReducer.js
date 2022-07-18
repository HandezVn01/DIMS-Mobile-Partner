import ACTIONS from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState = {
    user: {},
    isLogged: false,
    isAdmin: false,
    isHost: false,
    hoteiId: '',
    token: '',
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogged: true,
                user: action.payload,
                hoteiId: action.hotelid,
                token: action.token,
            };
        case ACTIONS.LOGOUT:
            AsyncStorage.clear();

            return {
                ...state,
                isLogged: false,
                user: undefined,
                isHost: false,
            };
        case ACTIONS.GETUSER:
            return {
                ...state,
                isLogged: true,
                isHost: action.payload.isHost,
                hoteiId: action.hotelid,
                token: action.token,
            };
        case ACTIONS.RELOAD:
            const foundUser = localStorage.getItem('user');
            if (foundUser) {
                const user = JSON.parse(foundUser);
                return {
                    ...state,
                    isLogged: true,
                    user: user,
                };
            } else {
                return initialState;
            }
        default:
            return state;
    }
};

export default authReducer;
