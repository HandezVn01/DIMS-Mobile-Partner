import ACTIONS from '../actions';
const initialState = {
    data: [],
};

function getMenuReducer(state = initialState, action) {
    switch (action.type) {
        // Fetch user
        case ACTIONS.FETCH_MENU:
            return {
                ...state,
            };

        case ACTIONS.SUCCESS_MENU:
            return {
                ...state,
                data: action.payload,
            };
        case ACTIONS.FAILED_MENU:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default getMenuReducer;
