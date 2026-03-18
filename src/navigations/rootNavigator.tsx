import React, { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import MybottomTabs from './bottomNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { fontSizes } from '../theme/responsive';
import Profile from '../screens/Profile';
import AuthNavigator from './authNavigator';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetail';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import MessageScreen from '../screens/MessageScreen';
import VendorProfile from '../screens/VendorProfile';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../utils/localStorage';
import { updateUserStates } from '../store/actions/UserActions';
import WriteReviewScreen from '../screens/WriteReviewScreen';
import CartScreen from '../screens/CartScreen';
import AddAddress from '../screens/AddAddress';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidVisibility, EventType } from '@notifee/react-native';
import ChangePasswordScreen from '../screens/ChangePassword';
import OrderSuccess from '../screens/OrderSuccess';

const handleRemoteNotificationReceived = async (notification, data) => {
  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    data: data ?? {},
    android: {
      channelId: 'default',
      visibility: AndroidVisibility.PUBLIC,
    },
  });
};

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
  const dispatch = useDispatch();
  const token = useSelector(state => state.userReducer.token);
  const isLoggedIn = !!token; // true if token exists

  const checkToken = async () => {
    const response = await getItem('key');
    console.log("data", response)
    if( response ){
      dispatch( updateUserStates(response) );
    }
  }

  // Foreground
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);

      // if (currentScreen.name === 'ChatScreen') return; // avoid popup in chat

      const conversation = remoteMessage?.data;
      handleRemoteNotificationReceived(remoteMessage.notification, conversation);
    });

    // Foreground click events
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const conversation = detail.notification?.data;
        // navigationRef.navigate("ChatScreen", { conversation });
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeNotifee();
    };
  }, []);

  useEffect(() => {
    checkToken()
  }, [])
  
  return (
    <NavigationContainer>
    {!isLoggedIn ? (  <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
        }}
      >
         
       
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          // key={`${isAuthenticated}-${formCompleted}-${onboardingCompleted}`}
          screenOptions={{ headerShown: false ,
          animation: 'slide_from_right',
          }}
          initialRouteName={ 'MybottomTabs'}
        > 
        <Stack.Screen name="MybottomTabs" component={MybottomTabs} />
        <Stack.Screen name="Profile" component={Profile} options={headerOptions('Profile')} />
        <Stack.Screen  name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen  name="ProductDetailScreen" component={ProductDetailScreen} options={headerOptions('Product details')} />
        <Stack.Screen  name="AllOrdersScreen" component={AllOrdersScreen} options={headerOptions('My Orders')} />
        <Stack.Screen  name="MessageScreen" component={MessageScreen} options={headerOptions('Message')} />
        <Stack.Screen  name="VendorProfile" component={VendorProfile} options={headerOptions('Vendor Profile')} />
        <Stack.Screen  name="WriteReviewScreen" component={WriteReviewScreen} options={headerOptions('Write a Review')} />
        <Stack.Screen  name="AddAddress" component={AddAddress} options={headerOptions('Add Address')} />
        <Stack.Screen  name="OrderSuccess" component={OrderSuccess} />
        <Stack.Screen  name="ChangePasswordScreen" component={ChangePasswordScreen} options={headerOptions('Change Password')} />
        <Stack.Screen  name="Cart" component={CartScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
         )}
    </NavigationContainer>
    
  );
}
