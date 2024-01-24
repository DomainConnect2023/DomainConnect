/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    const count = await AsyncStorage.getItem('badgeCount');
    if(count!=null)
    {
        await AsyncStorage.setItem('badgeCount',count.toString());
        PushNotificationIOS.setApplicationIconBadgeNumber(parseInt(count) + 1);
    }

   

});

AppRegistry.registerComponent(appName, () => App);
