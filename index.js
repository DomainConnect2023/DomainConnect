/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    HmsPushMessaging,
    RNRemoteMessage,
    HmsLocalNotification,
    HmsPushEvent,
  } from "@hmscore/react-native-hms-push";

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    let count = parseInt(await AsyncStorage.getItem('badgeCount'));
    count = count + 1;;
    await AsyncStorage.setItem('badgeCount', count.toString());
    if (Platform.OS === "ios") {
        PushNotificationIOS.setApplicationIconBadgeNumber(parseInt(await AsyncStorage.getItem('badgeCount')));
    }
});

if(Platform.OS === "android"){
  HmsPushMessaging.setBackgroundMessageHandler((dataMessage) => {
    HmsLocalNotification.localNotification({
      [HmsLocalNotification.Attr.title]: "[Headless] DataMessage Received",
      [HmsLocalNotification.Attr.message]: new RNRemoteMessage(
        dataMessage
      ).getDataOfMap(),
    })
      .then((result) => {
        console.log("[Headless] DataMessage Received", result);
      })
      .catch((err) => {
        console.log(
          "[LocalNotification Default] Error/Exception: " + JSON.stringify(err)
        );
      });
  
    return Promise.resolve();
  });

}

AppRegistry.registerComponent(appName, () => App);

