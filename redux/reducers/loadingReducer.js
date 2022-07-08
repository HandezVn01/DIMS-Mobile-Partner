import ACTIONS from '../actions';
const initialState = {
    data: [],
    loading: false,
    error: undefined,
};

function loadingReducer(state = initialState, action) {
    switch (action.type) {
        // Fetch user
        case ACTIONS.FETCH:
            return {
                ...state,
                loading: true,
            };

        case ACTIONS.SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case ACTIONS.FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default loadingReducer;
