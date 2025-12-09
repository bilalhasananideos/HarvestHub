import { call, put } from 'redux-saga/effects';
// import { navigate } from '../../navigation/RootNavigation';
import { getItem, setItem } from '../../utils/localStorage';
import { updateUserStates } from '../actions/UserActions';

export function* init(): any {

//   yield call( getInfo );
//   yield call( getServices );
  const response = yield call( getItem, 'key' );
    console.log("response", response)
//   yield put(updateStates({ splash: false }));
  if( response ){
    yield put( updateUserStates(response) );
  }
}
