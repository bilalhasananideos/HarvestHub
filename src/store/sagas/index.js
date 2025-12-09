// import { all } from 'redux-saga/effects';
// // import authSaga from './authSaga';
// // import profileSaga from './profileSaga';
// // // import userSaga from './userSaga';
// import AppSaga from './AppSaga';

// export default function* rootSaga() {
//   yield all([
//     AppSaga(),
//     // authSaga(),
//     // profileSaga(), // working
//   ]);
// }

import { all, call } from 'redux-saga/effects';

function* initSaga() {
  // This is only a placeholder for now
  // You can add initial API calls or logic later
  console.log("Root saga initialized");
}

export default function* rootSaga() {
  yield all([
    call(initSaga),
  ]);
}
