import { Dimensions } from 'react-native';

export const BASEURL = 'https://virtualrealitycreators.com/harvesthub-backend/public/api/v1';

export const screenHeight = (percent) => {
	const windowHeight = Dimensions.get('window').height;
	return (windowHeight * percent) / 100;
};

export const screenWidth = (percent) => {
	const windowWidth = Dimensions.get('window').width;
	return (windowWidth * percent) / 100;
};

export const COLORS = {
	primary: '#dc5de0',
	onPrimary: '#fff',
	secondary: '#04b3dd',
	onSecondary: '#333258',
	secondaryGradient: ['#00B2DD', '#20C9F2', '#00B2DD'],
	secondaryLight: '#0fbbe4',

	surface: '#fff',
	surfaceInv: '#101420',
	onSurface: '#000',
	background: '#fff',
	text: '#1d2733',

	muted: '#b2b4b7',
	disable: '#989799',
	overlay: '#00000040',
	rating: '#ffb301',
	border: '#e5e5e5',
	danger: '#FF6961',

	black: '#000',
	white: '#fff',
	lightGray: '#e5e5e5',
	gray: '#e5e5e5',
	darkGray: '#999B9F',
};

export const FONTS = {
	PoppinsBold: 'Poppins-Bold',
	PoppinsSemiBold: 'Poppins-SemiBold',
	PoppinsRegular: 'Poppins-Regular',
	PoppinsMedium: 'Poppins-Medium',
};

export const FONTSIZE = {
	XXL: 22,
	XL: 20,
	L: 18,
	M: 16,
	S: 14,
	XS: 12,
	XXS: 10,
};

export const headerHeight = 50;








// import auth from '@react-native-firebase/auth';
// // import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import {appleAuth} from '@invertase/react-native-apple-authentication';
// import {sha256} from 'react-native-sha256';
// import {Platform} from 'react-native';
 
// export const faceBookLogin = async () => {
//   if (Platform.OS === 'android') {
//     LoginManager.setLoginBehavior('web_only');
//   }
 
//   // Attempt login with permissions
//   const result = await LoginManager.logInWithPermissions([
//     'public_profile',
//     'email',
//   ]);
//   console.log('result', result);
//   if (result.isCancelled) {
//     throw 'User cancelled the login process';
//   }
 
//   // Once signed in, get the users AccesToken
//   const data = await AccessToken.getCurrentAccessToken();
 
//   if (!data) {
//     throw 'Something went wrong obtaining access token';
//   }
 
//   // Create a Firebase credential with the AccessToken
//   const facebookCredential = auth.FacebookAuthProvider.credential(
//     data.accessToken,
//   );
 
//   // Sign-in the user with the credential
//   const {user} = await auth().signInWithCredential(facebookCredential);
//   return user;
// };
 
// export const appleIdlogin = async () => {
//   // Start the sign-in request
//   if (!appleAuth.isSupported)
//     throw new Error(
//       'AppleAuth is not supported on the device. Currently Apple Authentication works on iOS devices running iOS 13 or later',
//     );
//   const appleAuthRequestResponse = await appleAuth.performRequest({
//     requestedOperation: appleAuth.Operation.LOGIN,
//     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//   });
//   if (!appleAuthRequestResponse.identityToken)
//     throw new Error('Apple Sign-In failed - no identify token returned');
 
//   const {
//     identityToken,
//     nonce,
//     fullName: {givenName, familyName},
//   } = appleAuthRequestResponse;
//   const token = auth.AppleAuthProvider.credential(identityToken, nonce);
//   await auth().signInWithCredential(token);
//   return {
//     token,
//     name: `${givenName || ''} ${familyName || ''}`,
//     identityToken,
//   };
 
//   // Sign the user in with the credential
// };
 
// export const googleLogin = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     await GoogleSignin.configure({
//       // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//       // webClientId:
//       //   '925607838451-78r5q593erniv0rian0v8f7l1dkd3s6q.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//       androidClientId:
//         '925607838451-78r5q593erniv0rian0v8f7l1dkd3s6q.apps.googleusercontent.com',
//       iosClientId:
//         '925607838451-2cbsfsq0oenaj93jdivbnm7k8qhv4emu.apps.googleusercontent.com',
//       // webClientId:
//       //   '925607838451-k42tnhp3cbqod17u38g4j49hv00atu9b.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//       offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//       hostedDomain: '', // specifies a hosted domain restriction
//       forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//       accountName: '', // [Android] specifies an account name on the device that should be used
//       // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//       googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//       openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//       profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
//     });
//     await GoogleSignin.signOut();
//     const {user, idToken} = await GoogleSignin.signIn();
//     console.log(user, idToken);
//   } catch (error) {
//     console.log('error.code', error);
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // user cancelled the login flow
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // operation (e.g. sign in) is in progress already
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // play services not available or outdated
//     } else {
//       // some other error happened
//     }
//   }
// };
 
export const googleLogin = async () => {
  console.log('isdvbjksdbj');
  const logOutWithGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('logOutWithGoogle');
  };
 
  const hasPlayService = await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  if (!hasPlayService) throw new Error('play services not available');
  // if (Platform.OS == 'android') {
  //   const isSignIn = GoogleSignin.hasPreviousSignIn();
  //   if (isSignIn) await logOutWithGoogle();
  // }
  console.log('isSIngIN ');
  const {idToken, user} = await GoogleSignin.signIn();
  console.log('tpken', idToken, user);
  const token = auth.GoogleAuthProvider.credential(idToken);
  const {additionalUserInfo} = await auth().signInWithCredential(token);
 
  return {...token, ...user, isNewUser: additionalUserInfo?.isNewUser};
};
 
export const PhoneNumberLogin = async phoneNumber => {
  // Handle the button press
  try {
    const {confirm} = await auth().signInWithPhoneNumber(phoneNumber);
    return confirm;
  } catch (error) {
    console.log('eror', error);
  }
};
 
export const verifyCode = async ({confirm, code}) => {
  try {
    await confirm(code);
  } catch (error) {
    console.log('Invalid code.');
  }
};
 
export const emailSignUp = async ({email, password}) => {
  console.log('dffs', email, password);
  const data = await auth().createUserWithEmailAndPassword(email, password);
  return data;
};
 
export const emailLogin = async ({email, password}) => {
  const data = await auth().signInWithEmailAndPassword(email, password);
  return data;
};
 
export const forgotPasswordServices = async email =>
  auth().sendPasswordResetEmail(email);
 