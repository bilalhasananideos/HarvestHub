import React, { useState } from 'react';
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
} from 'react-native';
import { logo, sms, eye, eyeOff, google, apple } from '../../assets';
import { scale, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { fontSizes, hp, wp } from '../../theme/responsive';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SignIn({ navigation }: any) {
  const [email, setEmail] = useState(__DEV__ ? 'shareef@yopmail.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Admin$123' : '');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

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

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Welcome back!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
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
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Image source={sms} style={styles.inputIcon} />
              <TextInput
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
            <TouchableOpacity onPress={()=>console.log('Google Sign In')} style={styles.socialButton}>
            <Image source={google} style={styles.socialButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>console.log('Apple Sign In')} style={styles.socialButton}>
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