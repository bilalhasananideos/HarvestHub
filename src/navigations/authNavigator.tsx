import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignIn from '../screens/SignIn/SignInScreen';
import SignUp from '../screens/SignUp/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const hasSeenOnboarding = false
  // const hasSeenOnboarding = useSelector((state: any) => state.auth.hasSeenOnboarding);
  
  console.log('AuthNavigator - hasSeenOnboarding:', hasSeenOnboarding);
  
  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? 'SignIn' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator; 

