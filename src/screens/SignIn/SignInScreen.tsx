import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { logo, sms, eye, eyeOff, google, apple } from '../../assets';
import { scale, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { fontSizes, hp, wp } from '../../theme/responsive';
import auth, { getAuth } from '@react-native-firebase/auth';
import { guestLoginApi, loginApi, registerApi } from '../../store/services/Services';
import { updateUserStates } from '../../store/actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { setItem } from '../../utils/localStorage';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { googleLogin } from '../../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SignIn({ navigation }: any) {
  const dispatch = useDispatch();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  const user = useSelector(state => state.userReducer.user);

  const [email, setEmail] = useState(__DEV__ ? 'shareef@yopmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Admin$123' : '');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const [isSocialLoading, setIsSocialLoading] = useState<'apple' | 'google' | ''>('');

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [],
      // scopes: ['openid', 'email', 'profile'],
      webClientId: 
        '943734294750-tegb8f7s9url0o2ih6iektkbd1a5ul81.apps.googleusercontent.com', // WEB CLIENT ID
      iosClientId:
        '943734294750-2b0s5seffmei1v7llmnjhjgvp38s1uk2.apps.googleusercontent.com', // iOS CLIENT ID
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
    });
  }, []);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleLogin = async () => {
  //   if (!validateForm()) return;
    
  //   setLoading(true);
  //   try {
  //     // Simulate API call
  //     // await new Promise(resolve => setTimeout(resolve, 2000));
  //     Alert.alert('Success', 'Welcome back!');
  //   } catch (err: any) {
  //     Alert.alert('Error', err.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const firebaseLogin = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      // console.log("user credential", userCredential)
      return userCredential.user; // logged in user
    } catch (error) {
      console.log("Firebase Login Error:", error);
      throw error;
    }
  };  

  // ---------------------------
  // Get Firebase Token if logged in
  // ---------------------------
  const getFirebaseToken = async () => {
    try {
      const user = auth().currentUser;

      if (!user) return '';

      return await user.getIdToken();
    } catch (err) {
      console.log('Firebase token error:', err);
      return '';
    }
  };
  // new approach
  // const getFirebaseToken = async () => {
  //   const authInstance = getAuth();
  //   const user = authInstance.currentUser;

  //   if (!user) return '';

  //   return await user.getIdToken();
  // };

  // ---------------------------
  // Main Login Function
  // ---------------------------
  const handleLogin = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      // Step 1: Firebase Login
      const firebaseUser = await firebaseLogin(email, password);
  
      // Step 2: Token Get
      const firebaseToken = await getFirebaseToken();
      console.log("firebase", firebaseToken)
  
      if (!firebaseToken) {
        Alert.alert("Firebase error", "Token not generated.");
        return;
      }
  
      // Step 3: Send token to backend
      const response = await registerApi({
        firebase_token: firebaseToken,
        type: "user",
      });
      // const response = await loginApi({
      //   email,
      //   device_id: 'ios',
      //   type: "user",
      // });
  
      console.log("API Response:", response);
  
      if (response?.message === "User authenticated successfully") {

        const authObj = {
          user: response.user,
          token: response.access_token,
          device_id: response.device_id,
        }
        authObj['defaultRoute'] = 'Home';
        setItem('key', authObj);
        console.log("authobject", authObj, {
          user: response,
          user2: { ...response },
          token: response.access_token
        })
        dispatch(updateUserStates({
          isLoggedIn: true,
          token: response.access_token,
          device_id: response.device_id,
          user: {
              ...user,
              ...response.user
          }
        }));

      } else {
        Alert.alert("Login failed", response?.message || "Unknown error");
      }
  
    } catch (e) {
      console.log("Login Error:", e);
      Alert.alert("Login Error", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };  

  // const login = async () => {
  //   const res = await loginApi({ // normal function
  //     firebase_token: '',
  //     type: 'user'
  //   })
  //   // await loginApi({
  //   //   email: email,
  //   //   device_id: 'ios', // use this key without firebase only
  //   //   type: 'user'
  //   // })
  //   .then((resp) => {
  //     if (resp.message == "User login successfully") {
  //       console.log("resp", resp);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("err", err)
  //   })
  //   .finally(() => {
  //     setLoading(false);
  //   })
  // }

  const onGoogleSignin = async () => {
    setLoading(true);
    try {
      setIsSocialLoading('google');
      await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();

      // console.log("userInfo", userInfo)
      // // const {idToken, user} = userInfo.data
      // // console.log('tpken', idToken, user);
      // // const token = auth.GoogleAuthProvider.credential(idToken);
      // // const {additionalUserInfo} = await auth().signInWithCredential(token);
    
      // // console.log("token", token)
      // // console.log("add", additionalUserInfo)
      // const response = await registerApi({
      //   firebase_token: userInfo?.data?.idToken,
      //   type: "user",
      // });
      const googleUser = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(googleUser?.data?.idToken);

      const firebaseUser = await auth().signInWithCredential(googleCredential);

      const firebaseIdToken = await firebaseUser.user.getIdToken();
      console.log("gogole user", googleUser)
      console.log("google credential", googleCredential)
      console.log('firesbae user', firebaseUser)
      console.log("firebase id token", firebaseIdToken)

      const response = await registerApi({
        firebase_token: firebaseIdToken,
        type: "user",
      });
      console.log("API Response:", response);
      if (response?.message === "User authenticated successfully") {
        global.login == 'google'
        const authObj = {
          user: response.user,
          token: response.access_token,
          device_id: response.device_id,
        }
        authObj['defaultRoute'] = 'Home';
        setItem('key', authObj);
        console.log("authobject", authObj, {
          user: response,
          user2: { ...response },
          token: response.access_token
        })
        dispatch(updateUserStates({
          isLoggedIn: true,
          token: response.access_token,
          device_id: response.device_id,
          user: {
              ...user,
              ...response.user
          }
        }));
      }
      else {
        console.log("ersponse", response, response.message)
      }

      // const res = await dispatch(socialLogin({payload}));

      // if (res.meta.requestStatus === 'fulfilled') {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{name: 'HomeScreen'}],
      //   });
      // }
    } catch (error: any) {
      console.log("err", error)
    } finally {
      setIsSocialLoading('');
      setLoading(false);
    }
  };

  const onAppleSignin = async () => {
    // https://harvest-hub-f93cf.firebaseapp.com/__/auth/handler
    setLoading(true);
    try {
      if (!appleAuth.isSupported)
        throw new Error(
        'AppleAuth is not supported on the device. Currently Apple Authentication works on iOS devices running iOS 13 or later',
      );
      
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce, fullName} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // // Sign the user in with the credential
      // const results = await auth().signInWithCredential(appleCredential);

      // if (fullName?.givenName && fullName.familyName) {
      //   // Build the display name from the returned full name
      //   const displayName = `${fullName.givenName || ''} ${
      //     fullName.familyName || ''
      //   }`.trim();

      //   await results.user.updateProfile({
      //     displayName: displayName,
      //   });
      // }

      // const payload = {
      //   email: results.user.email,
      //   name: results.user.displayName ?? results.user?.email?.split('@')[0],
      //   profile_img:
      //     results.user?.photoURL ??
      //     'https://apiv2.koyal.pk/storage/default/Main/default-image.png',
      //   where_from: 'apple',
      // };

      // console.log(payload);

      // setIsSocialLoading('apple');

      // Firebase Sign-in
      const firebaseUserCred = await auth().signInWithCredential(appleCredential);

      // Get Firebase ID Token — used in your backend
      const firebaseIdToken = await firebaseUserCred.user.getIdToken();

      console.log("Apple Firebase User", firebaseUserCred);
      console.log("Firebase ID Token", firebaseIdToken);

      // Prepare your API payload
      const payload = {
        firebase_token: firebaseIdToken,
        type: "user",
      };

      setIsSocialLoading("apple");

      // Send backend login request
      const response = await registerApi(payload);
      console.log("API Response:", response);

      // SUCCESS CASE (Same structure as Google)
      if (response?.message === "User authenticated successfully") {
        global.login = 'apple';   // FIXED — assignment

        const authObj = {
          user: response.user,
          token: response.access_token,
          device_id: response.device_id,
          defaultRoute: "Home",
        };

        await setItem("key", authObj);

        dispatch(updateUserStates({
          isLoggedIn: true,
          token: response.access_token,
          device_id: response.device_id,
          user: {
            ...response.user
          }
        }));

        console.log("Apple Login Success", authObj);
      } 
      else {
        console.log("Apple Login Failed:", response?.message);
      }

      // const res = await dispatch(socialLogin({payload}));

      // if (res.meta.requestStatus === 'fulfilled') {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{name: 'HomeScreen'}],
      //   });
      // }
    } catch (error) {
      console.log('AppleAuthError------>', error);
    } finally {
      setIsSocialLoading('');
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setGuestLoading(true);
    try {
      const response = await guestLoginApi()
      console.log("API Response:", response);
  
      if (response?.message === "New guest created") {

        const authObj = {
          user: response.user,
          token: response.access_token,
          device_id: response.device_id,
        }
        authObj['defaultRoute'] = 'Home';
        setItem('key', authObj);
        console.log("authobject", authObj, {
          user: response,
          user2: { ...response },
          token: response.access_token
        })
        dispatch(updateUserStates({
          isLoggedIn: true,
          token: response.access_token,
          device_id: response.device_id,
          user: {
              ...user,
              ...response.user
          }
        }));

      } else {
        Alert.alert("Login failed", response?.message || "Unknown error");
      }
    } catch (error) {
      console.log("err",error)
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : -280}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Let’s get started!</Text>
          <Text style={styles.subtitle}>Create an account to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Image source={sms} style={styles.inputIcon} />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.hint}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({...errors, email: undefined});
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Image source={sms} style={styles.inputIcon} />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.hint}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({...errors, password: undefined});
                }}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                returnKeyType='done'
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image 
                  source={showPassword ? eyeOff : eye} 
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.inverse} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, guestLoading && styles.loginButtonDisabled]}
            onPress={guestLogin}
            disabled={guestLoading}
          >
            {guestLoading ? (
              <ActivityIndicator color={colors.text.inverse} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Continue as a Guest</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            {/* <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}></Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onGoogleSignin} style={styles.socialButton}>
            <Image source={google} style={styles.socialButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAppleSignin} style={styles.socialButton}>
            <Image source={apple} style={styles.socialButton} />
          </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: hp(8),
    paddingBottom: hp(4),
  },
  logo: {
    width: wp(40),
    height: hp(10),
    resizeMode: 'contain',
    marginBottom: hp(2),
  },
  title: {
    fontSize: fontSizes.fs28,
    fontFamily: typography.fontFamily.Bold,
    color: colors.primary.main,
    fontWeight:'500',
    textAlign:'left'
  },
  subtitle: {
    fontSize: fontSizes.fs16,
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    textAlign: 'left',
  },
  formContainer: {
    backgroundColor: colors.background.paper,
    marginHorizontal: wp(6),
    borderRadius: wp(8),
    padding: wp(6),
    shadowColor: colors.overlay.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.primary,
    marginBottom: hp(1),
    fontWeight:'500',

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: wp(4),
    height: hp(6.5),
  },
  inputError: {
    borderColor: colors.status.error,
  },
  inputIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    marginRight: wp(3),
    tintColor: colors.text.secondary,
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.primary,
    paddingVertical: hp(1),
  },
  eyeButton: {
    padding: wp(2),
  },
  eyeIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    tintColor: colors.text.secondary,
  },
  errorText: {
    fontSize: scale(12),
    fontFamily: typography.fontFamily.Regular,
    color: colors.status.error,
    marginTop: hp(0.5),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp(2),
  },
  forgotPasswordText: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Medium,
    color: colors.primary.main,
  },
  loginButton: {
    backgroundColor: colors.primary.main,
    borderRadius: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: scale(16),
    fontFamily: typography.fontFamily.Medium,
    color: colors.text.inverse,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    marginHorizontal: wp(3),
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  socialButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    shadowColor: colors.overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: scale(18),
    fontFamily: typography.fontFamily.Bold,
    color: colors.text.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
  },
  signupText: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  signupLink: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Medium,
    color: colors.primary.main,
  },
  loginText: {
    color: '#fff',
    fontSize: fontSizes.fs18,
    fontWeight: '600',
    fontFamily: typography.fontFamily.Medium,
  },

  forgotPasswordLink: {
    alignItems: 'flex-end',
    marginTop: hp(0.5),
    
  },

});