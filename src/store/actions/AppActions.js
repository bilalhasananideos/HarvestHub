import { useSelector } from "react-redux";
import { selectJobs } from "../selectors/bookingSelector";

export const UPDATE_LOADER = 'UPDATE_LOADER';
export const SHOW_TOAST = 'SHOW_TOAST';
export const UPDATE_APP_STATE = 'UPDATE_APP_STATE';


export const INIT = 'INIT';
export const GET_FRANCHISE = 'GET_FRANCHISE';
export const GET_SERVICES = 'GET_SERVICES';
export const GET_QUESTIONS = 'GET_QUESTIONS';

export const GET_HOME = 'GET_HOME';
export const GET_CONTENT = 'GET_CONTENT';

export const showToast = (title) => {
    return {
        type: SHOW_TOAST,
        toast: {
            show: true,
            title,
        }
    };
}

export const updateStates = (payload) => ({ type: UPDATE_APP_STATE, payload });

export const enableLoader = () => ({ type: UPDATE_LOADER, loader: true });
export const disableLoader = () => ({ type: UPDATE_LOADER, loader: false });

export const getQuestions = (id) => ({ type: GET_QUESTIONS, id });
export const getFranchises = () => ( { type: GET_FRANCHISE } );

export const getHomeRecords = () => ( { type: GET_HOME } );
export const getContent = (slug) => ( { type: GET_CONTENT, slug } );
