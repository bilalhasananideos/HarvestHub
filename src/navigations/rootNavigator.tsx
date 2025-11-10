import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import MybottomTabs from './bottomNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { fontSizes } from '../theme/responsive';
import Profile from '../screens/Profile';
import AuthNavigator from './authNavigator';



const Stack = createNativeStackNavigator();

const headerOptions = (title: string): NativeStackNavigationOptions => ({
  headerShown: true,
  title: title,
  headerBackButtonDisplayMode: 'minimal',
  headerTintColor: 'rgba(40, 42, 46, 1)',
  headerStyle: {
    backgroundColor: 'white',  
  },
  headerTitleAlign: 'center',
  headerBackTitle: 'Back',
  headerTitleStyle: {
    color: 'rgba(40, 42, 46, 1)',
    fontFamily: typography.fontFamily.Medium,
    fontSize: fontSizes.fs20,
  },
});
export default function RootNavigator() {
  
  return (
    <NavigationContainer>
    {false ? (  <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_left',
          headerShown: false,
        }}
      >
         
       
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          // key={`${isAuthenticated}-${formCompleted}-${onboardingCompleted}`}
          screenOptions={{ headerShown: false ,
          animation: 'slide_from_left',
          }}
          initialRouteName={ 'MybottomTabs'}
        >
        <Stack.Screen name="MybottomTabs" component={MybottomTabs} />
        <Stack.Screen name="Profile" component={Profile} options={headerOptions('Profile')} />
      </Stack.Navigator>
         )}
    </NavigationContainer>
    
  );
}
