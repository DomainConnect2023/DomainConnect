/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import AsyncStorage from '@react-native-async-storage/async-storage';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    let count = parseInt(await AsyncStorage.getItem('badgeCount'));
    count = count + 1;;
    await AsyncStorage.setItem('badgeCount', count.toString());
    if (Platform.OS === "ios") {
        PushNotificationIOS.setApplicationIconBadgeNumber(parseInt(await AsyncStorage.getItem('badgeCount')));
    }
});

AppRegistry.registerComponent(appName, () => App);

