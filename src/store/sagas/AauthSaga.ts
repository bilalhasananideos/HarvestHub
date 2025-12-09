import { call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  LOGOUT_REQUEST,
} from '../types';

import {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logoutSuccess,
  logoutFailure,
} from '../actions/authActions';

import {
  loginApi,
  signupApi,
} from '../api/authApi';

function* loginWorker({ payload }) {
  try {
    const data = yield call(loginApi, payload);
    if (data.token) {
      yield call(AsyncStorage.setItem, 'token', data.token);
    }
    yield put(loginSuccess(data));
  } catch (error) {
    yield put(loginFailure(error?.message || 'Login failed'));
  }
}

function* signupWorker({ payload }) {
  try {
    const data = yield call(signupApi, payload);
    yield put(signupSuccess(data));
  } catch (error) {
    yield put(signupFailure(error?.message || 'Signup failed'));
  }
}

function* logoutWorker() {
  try {
    console.log('🔄 Starting logout process...');
    
    // Close WebSocket connection before logout
    try {
      const WS = require('../../utilities/webSocket/defaultSocket').default;
      WS.closeSocket();
      console.log('✅ WebSocket closed');
    } catch (wsError) {
      console.log('⚠️ WebSocket close error (non-critical):', wsError);
    }
    
    // Sign out from AWS Cognito
    yield call(Auth.signOut);
    console.log('✅ Signed out from AWS Cognito');

    // Clear AsyncStorage
    yield call(AsyncStorage.clear);
    console.log('✅ Cleared AsyncStorage');

    // Reset preferred location
    yield call(AsyncStorage.setItem, 'preferredLocation', '');

    // Dispatch logout success to clear auth state
    yield put(logoutSuccess());

    // Dispatch remove user to clear user state (loggedIn, idToken, accessToken)
    yield put({ type: 'REMOVE_USER' });

    console.log('✅ Logout successful - Redux state cleared');
  } catch (error) {
    console.error('❌ Logout error:', error);
    yield put(logoutFailure(error?.message || 'Logout failed'));
  }
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginWorker);
  yield takeLatest(SIGNUP_REQUEST, signupWorker);
  yield takeLatest(LOGOUT_REQUEST, logoutWorker);
}