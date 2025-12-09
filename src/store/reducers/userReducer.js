import { RESET_USER_STATE, UPDATE_USER } from '../actions/UserActions';

const initialState = {
    defaultRoute: 'index',
    
    isLoggedIn: false,
    token: null,
    device_id: null,

    user: {
        description: null,
        email: "",
        farm_visit: null,
        form_completed: false,
        id: null,
        name: "",
        type: "",
        image: "",
        phone: "",
        latitude: null,
        longitude: null,
        connected_status: false,
        onboarding_completed: false,
        farm_visit: 0,
        created_at: null,
    },

    notifications: {
        data: [],
        pagination: {}
    },
    wallet: {
        amount: 0,
        date: null
    },
    transactions: {
        data: [],
        pagination: {}
    },
    invoices: {
        data: [],
        pagination: {}
    },
    invoice: {},
    cards: [],
    verification: {
        visible: false,
        url: null,
        type: null,
        data: {}
    },
};

export default UserReducer = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload
            };

        case RESET_USER_STATE:
            console.log('RESET_USER_STATE');
            return { ...initialState };

        default:
            return state;
    }
};