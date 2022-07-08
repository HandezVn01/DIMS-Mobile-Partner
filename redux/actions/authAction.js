import ACTIONS from '.';
export const dispatchLogin = (payload) => {
    return {
        type: ACTIONS.LOGIN,
        payload,
    };
};
export const dispatchGetUser = (payload) => {
    return {
        type: ACTIONS.GETUSER,
        payload,
    };
};
export const dispatchRegister = (payload) => {
    return {
        type: ACTIONS.REGISTER,
        payload,
    };
};
export const dispatchReLoad = () => {
    return {
        type: ACTIONS.RELOAD,
    };
};

export const dispatchLogout = () => {
    return {
        type: ACTIONS.LOGOUT,
    };
};
export const dispatchFecth = () => {
    return {
        type: ACTIONS.FETCH,
    };
};
export const dispatchSuccess = () => {
    return {
        type: ACTIONS.SUCCESS,
    };
};
export const dispatchFailed = () => {
    return {
        type: ACTIONS.FAILED,
    };
};
