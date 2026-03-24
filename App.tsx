import {StripeProvider} from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, Text, View, PermissionsAndroid, Platform} from 'react-native';
import RootNavigator from './src/navigations/rootNavigator';
import { logo } from './src/assets';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Toast from 'react-native-toast-message';

const App = () => {
    const [splashVisible,setSplashVisible]=useState(true);

    async function requestUserPermission() {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) getFCMToken();
          console.log('iOS Permission:', authStatus);
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getFCMToken()
            console.log('Notification permission granted for Android 13+');
          } else {
            console.log('Notification permission denied for Android 13+');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }

    async function getFCMToken() {
      // Register the device with FCM (especially important for iOS)
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        global.fcmToken = token
      } else {
        console.log('No FCM token received');
      }
    }

    // import { getMessaging, requestPermission } from '@react-native-firebase/messaging';

    // const messagingInstance = getMessaging();

    // // request notification permission
    // const authStatus = await requestPermission();

    // // check status
    // const enabled =
    // authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    // authStatus === messaging.AuthorizationStatus.PROVISIONAL;


    
    // import { getMessaging, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';
    //   const requestUserPermission = async () => {
    //     try {
    //       const messagingInstance = getMessaging();
    //       const authStatus = await requestPermission(messagingInstance);
    
    //       if (
    //         authStatus === AuthorizationStatus.AUTHORIZED ||
    //         authStatus === AuthorizationStatus.PROVISIONAL
    //       ) {
    //         console.log("iOS Permission:", authStatus);
    //       }
    //     } catch (e) {
    //       console.log("FCM Permission Error:", e);
    //     }
    //   };
    // }
    
    useEffect(() => {
    requestUserPermission()
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);
  let Splash_Screen = (

    <View style={styles.splash}>  
      <Image source={logo} style={styles.logo} /> 
    {/* <ImageBackground
      source={Splash}
      resizeMode="cover"
      style={styles.splash}></ImageBackground> */}
      </View>
  );
  return splashVisible?Splash_Screen:
  <StripeProvider publishableKey="pk_test_51SczxA7uMQwrI1OyqP3GQHOyQFnNzGxtio4d55ChFQHxzJNGegWvpKX2YgWRlIOVsJ5a8NGIlPQmo8tZopefFg1v00emteYl51">

    <GestureHandlerRootView>
      <Provider store={store}> 
        <RootNavigator />
      </Provider>
      <Toast />
    </GestureHandlerRootView>
    
  </StripeProvider>;
};

export default App;

const styles = StyleSheet.create({
    splash:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  logo:{
    height:200,  
    width:200,
    resizeMode:'contain'
  }
});
