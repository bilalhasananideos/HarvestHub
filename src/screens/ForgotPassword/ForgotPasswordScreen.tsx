import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { loginImage, logo, sms } from '../../assets';
import { scale, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { fontSizes, hp, wp } from '../../theme/responsive';
import { Platform } from 'react-native';
import { resetPassword } from '../../services/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState(__DEV__ ? 'sep6@yopmail.com' : '');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(email.trim());
      
      if (result.success) {
        setEmailSent(true);
        Alert.alert(
          'Reset Email Sent',
          'Please check your email for password reset instructions.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.log('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={loginImage}
          style={styles.bgImage}
          imageStyle={styles.bgImageStyle}
        >
          <Image source={logo} style={styles.logo} />

          <View style={styles.content}>
            <Text style={styles.heading}>Forgot Password?</Text>
            <Text style={styles.subText}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>

            <View style={styles.inputContainer}>
              <Image source={sms} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!emailSent}
              />
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {emailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  Password reset email sent! Please check your inbox.
                </Text>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
                  <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.resetButton, loading && { opacity: 0.7 }]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Email</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.loginLink} onPress={handleBackToLogin}>
              <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7FFDD',
  },
  logo: {
    width: wp('33'),
    height: hp('10'),
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    top: hp('7'),
  },
  bgImage: {
    height: screenHeight,
    justifyContent: 'flex-end',
  },
  bgImageStyle: {
    width: wp('80'),
    height: screenHeight,
    resizeMode: 'contain',
  },
  content: {
    padding: wp(5),
    paddingBottom: hp(2),
  },
  heading: {
    fontSize: scale(30),
    fontWeight: '700',
    color: 'rgba(40, 42, 46, 1)',
    marginBottom: hp(1),
    fontFamily: typography.fontFamily.Medium,
  },
  subText: {
    fontSize: screenHeight < 700 ? scale(12) : scale(14),
    color: 'rgba(135, 135, 135, 1)',
    marginBottom: screenHeight < 700 ? hp(3) : hp(4),
    fontFamily: typography.fontFamily.Regular,
    lineHeight: screenHeight < 700 ? scale(18) : scale(20),
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F6FFF1',
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: '#D2E5C4',
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp(6),
  },
  icon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    marginRight: wp(3),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    color: '#222',
    paddingVertical: hp(1.5),
  },
  resetButton: {
    width: '100%',
    backgroundColor: colors.secondary.main,
    borderRadius: wp(8),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  resetButtonText: {
    color: '#fff',
    fontSize: fontSizes.fs18,
    fontWeight: '600',
    fontFamily: typography.fontFamily.Medium,
  },
  errorText: {
    color: colors.status.error,
    fontSize: scale(14),
    textAlign: 'center',
    marginBottom: hp(2),
    fontFamily: typography.fontFamily.Regular,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  successText: {
    color: colors.status.success || '#4CAF50',
    fontSize: scale(16),
    textAlign: 'center',
    marginBottom: hp(2),
    fontFamily: typography.fontFamily.Medium,
  },
  backButton: {
    backgroundColor: colors.secondary.main,
    borderRadius: wp(8),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    marginTop: hp(1),
  },
  backButtonText: {
    color: '#fff',
    fontSize: fontSizes.fs16,
    fontWeight: '600',
    fontFamily: typography.fontFamily.Medium,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  loginLinkText: {
    color: colors.secondary.main,
    fontSize: scale(16),
    fontFamily: typography.fontFamily.Medium,
    textDecorationLine: 'underline',
  },
});
