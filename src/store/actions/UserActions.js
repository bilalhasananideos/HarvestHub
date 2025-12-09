export const AUTHENTICATE = 'USER_AUTHENTICATE';
export const REGISTER = 'USER_REGISTER';

export const SOCIAL_AUTH = 'SOCIAL_AUTHENTICATE';
export const SOCIAL_REGISTER = 'SOCIAL_REGISTER';

export const LOGOUT = 'USER_LOGOUT';
export const MY_PROFILE = 'MY_PROFILE';
export const USER_VIEW = 'USER_VIEW';
export const DELETE_PROFILE = 'DELETE_PROFILE';
export const USER_UPDATE = 'USER_UPDATE';
export const BUSINESS_UPDATE = 'BUSINESS_UPDATE';
export const BUSINESS_SERVICE_UPDATE = 'BUSINESS_SERVICE_UPDATE';
export const SET_SCHEDULE = 'SET_SCHEDULE';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';

export const USER_LIST = 'USER_LIST';

export const GET_SLOTS = 'GET_SLOTS';
export const DATE_SLOTS = 'DATE_SLOTS';
export const GET_ACTIVITY = 'GET_ACTIVITY';

export const UPDATE_USER = 'USER_STATE_UPDATE';
export const RESET_USER_STATE = 'RESET_USER_STATE';

export const UPDATE_DEVICE = 'UPDATE_DEVICE';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const GET_ACCOUNT = 'GET_ACCOUNT';
export const DEL_ACCOUNT = 'DEL_ACCOUNT';

export const SUBSCRIBE = 'SUBSCRIBE';

export const updateUserStates = (payload) => ({ type: UPDATE_USER, payload });

export const resetUserState = () => ({
    type: RESET_USER_STATE,
});

  
export const businessUpdateAction = (payload, redirect = true) => ({ type: BUSINESS_UPDATE, payload, redirect });
export const serviceUpdateAction = (payload) => ({ type: BUSINESS_SERVICE_UPDATE, payload });

export const loginAction = (payload) => ({ type: AUTHENTICATE, payload });
export const registerAction = (payload) => ({ type: REGISTER, payload });

export const socialLoginAction = (payload) => ({ type: SOCIAL_AUTH, payload });
export const socialRegisterAction = (payload) => ({ type: SOCIAL_REGISTER, payload });

export const changePassword = (payload) => ({ type: CHANGE_PASSWORD, payload });
export const forgotPassword = (payload) => ({ type: FORGOT_PASSWORD, payload });

export const subscribeAction = (payload) => ({ type: SUBSCRIBE, payload });
export const logoutAction = () => ({ type: LOGOUT });

export const setSchedule = (payload = {}) => ({ type: SET_SCHEDULE, payload });

export const userUpdate = (payload = {}) => ({ type: USER_UPDATE, payload });
export const myProfile = () => ({ type: MY_PROFILE });
export const toggleFavorite = (payload = {}) => ({ type: TOGGLE_FAVORITE, payload });
export const userView = (id, navigate = 'ProviderDetail') => ({ type: USER_VIEW, id, navigate });
export const userList = (payload = {}) => ({ type: USER_LIST, payload });
export const deleteProfile = () => ({ type: DELETE_PROFILE });

export const getSlots = (id) => ({ type: GET_SLOTS, id });
export const getDateSlots = (payload) => ({ type: DATE_SLOTS, payload });

export const getNotifications = () => ({ type: GET_ACTIVITY });

export const createAccountAction = (payload) => ({ type: CREATE_ACCOUNT, payload });
export const getAccountAction = () => ({ type: GET_ACCOUNT });
export const delAccountAction = () => ({ type: DEL_ACCOUNT });
