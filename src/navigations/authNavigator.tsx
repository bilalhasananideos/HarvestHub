import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getItem, setItem } from '../utils/localStorage';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignIn from '../screens/SignIn/SignInScreen';
import SignUp from '../screens/SignUp/SignUpScreen';
import ForgotPassword from '../screens/ForgotPassword/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  React.useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const value = await getItem("isFirstLaunch");

    if (value === null) {
      // First time
      await setItem("isFirstLaunch", false);
      setIsFirstLaunch(true);  // show onboarding
    } else {
      setIsFirstLaunch(false); // skip onboarding
    }
  };

  if (isFirstLaunch === null) {
    return null; // or loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;