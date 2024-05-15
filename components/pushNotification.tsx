import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Login from '../screens/LoginPage';
import { useNavigation } from '@react-navigation/native';
import TabNavigation from '../screens/TabNavigation';
import { PermissionsAndroid } from 'react-native';



export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

export async function GetFCMToken() {
    // console.log("run token step");
    let FCMToken = await AsyncStorage.getItem("fcmtoken");
    // console.log(FCMToken,"old token");
    if (!FCMToken) {
        try {
            const FCMToken = await messaging().getToken();
            if (FCMToken) {
                console.log(FCMToken, "new token");
                await AsyncStorage.setItem("service", 'GMS');
                await AsyncStorage.setItem("fcmtoken", FCMToken);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const NotificationListner = async () => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        const navigation = useNavigation();
        if (await AsyncStorage.getItem('userID') == "") {
            navigation.navigate(Login as never);
        }
        else {
            navigation.navigate(TabNavigation as never);
        }


    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,);

            }
        });

    messaging().onMessage(async remoteMessage => {
        console.log("notification on froground state....", remoteMessage);
    })
}