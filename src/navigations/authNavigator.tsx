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
    const value = await getItem('isFirstLaunch');
 
    if (value === null) {
      await setItem('isFirstLaunch', false);
      setIsFirstLaunch(true);
    } else {
      setIsFirstLaunch(false);
    }
  };
 
  if (isFirstLaunch === null) {
    return null;
  }
 
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isFirstLaunch ? 'Onboarding' : 'SignIn'}
    >
      {/* Always register all screens */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};
 
export default AuthNavigator;