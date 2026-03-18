/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// ============================================
// Background message handler
// ============================================
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("BG MESSAGE:", remoteMessage);
  
    const {title, body} = remoteMessage.notification ?? remoteMessage.data;
  
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
      data: remoteMessage.data,
    });
  });
  
  // ============================================
  // Create Notification Channel
  // ============================================
  async function createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: 4,
    });
  }
  createChannel();

AppRegistry.registerComponent(appName, () => App);
