import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { logo, sms, eye, eyeOff, google, apple } from '../../assets';
import { scale, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { fontSizes, hp, wp } from '../../theme/responsive';
import auth, { getAuth } from '@react-native-firebase/auth';
import { registerApi } from '../../store/services/Services';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserStates } from '../../store/actions/UserActions';
import { setItem } from '../../utils/localStorage';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function SignUp({ navigation }: any) {
  const dispatch = useDispatch();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const user = useSelector(state => state.userReducer.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
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
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // // Simulate API call
      // // await new Promise(resolve => setTimeout(resolve, 2000));
      // Alert.alert('Success', 'Account created successfully!');
      // navigation.navigate('SignIn');
      register()
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Sign up failed');
    } finally {
      // setLoading(false);
    }
  };

  const firebaseRegister = async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user; // logged in user
    } catch (error) {
      console.log("Firebase Login Error:", error);
      throw error;
    }
  };  

  const register = async () => {

    const firebaseUser = await firebaseRegister(email, password);
 
    const firebaseToken = await firebaseUser.getIdToken();
    // console.log("firebase", firebaseToken);

    await registerApi({
      name: name,
      firebase_token: firebaseToken,
      type: 'user'
    })
    .then((resp) => {
      console.log("resp", resp)
      if (resp.message != "Registration failed") {
        // navigation.navigate('SignIn');
        const authObj = {
          user: { ...resp },
          token: resp.access_token,
          device_id: resp.device_id,
        }
        authObj['defaultRoute'] = 'Home';
        setItem('key', authObj);
        dispatch(updateUserStates({
          isLoggedIn: true,
          token: resp.access_token,
          device_id: resp.device_id,
          user: {
              ...user,
              ...resp.user
          }
        }));        
      }
      return null;
    })
    .catch((err) => {
      console.log("err", err)
    })
    .finally(() => {
      setLoading(false);
    })
  }

  const onGoogleSignin = async () => {
    setLoading(true)
    try {
      setIsSocialLoading('google');
      await GoogleSignin.hasPlayServices();

      const googleUser = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(googleUser?.data?.idToken);

      const firebaseUser = await auth().signInWithCredential(googleCredential);

      const firebaseIdToken = await firebaseUser.user.getIdToken();

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
    } catch (error: any) {
      console.log("err", error)
    } finally {
      setIsSocialLoading('');
      setLoading(false)
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

    } catch (error) {
      console.log('AppleAuthError------>', error);
    } finally {
      setIsSocialLoading('');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      // behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : -280}
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started!</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
              <Image source={sms} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.text.hint}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
              autoCorrect={false}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

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
                placeholder="Create a strong password"
                placeholderTextColor={colors.text.hint}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({...errors, password: undefined});
                }}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              textContentType="newPassword"
              autoComplete="password-new"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
              <Image source={sms} style={styles.inputIcon} />
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={colors.text.hint}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
                }}
                secureTextEntry={!showConfirmPassword}
                autoCorrect={false}
                returnKeyType='done'
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image 
                  source={showConfirmPassword ? eyeOff : eye} 
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.inverse} size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity onPress={onGoogleSignin} style={styles.socialButton}>
                <Image source={google} style={styles.socialButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onAppleSignin} style={styles.socialButton}>
                <Image source={apple} style={styles.socialButton} />
              </TouchableOpacity>
          </View>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signinLink}>Sign In</Text>
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
    paddingTop: hp(6),
    paddingBottom: hp(4),
  },
  logo: {
    width: wp(45),
    height: hp(10),
    resizeMode: 'contain',
    marginBottom: hp(2),
  },
  title: {
    fontSize: fontSizes.fs30,
    fontFamily: typography.fontFamily.Bold,
    color: colors.primary.main,
    fontWeight:'500',
    textAlign:'left'
  },
  subtitle: {
    fontSize: fontSizes.fs16,  
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
    textAlign:'left'
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
    marginBottom: hp(4),
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
  signupButton: {
    backgroundColor: colors.primary.main,
    borderRadius: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
  },
  signinText: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Regular,
    color: colors.text.secondary,
  },
  signinLink: {
    fontSize: scale(14),
    fontFamily: typography.fontFamily.Medium,
    color: colors.primary.main,
  },
});