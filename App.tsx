import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Platform, SafeAreaView } from 'react-native';
import Login from './newscreens/LoginPage';
import Register from './screens/RegisterPage';
import { GetFCMToken, NotificationListner, requestUserPermission } from './components/pushNotification';
import TabNavigationScreen from './screens/TabNavigation';
import DashboardScreen from './screens/DashboardPage';
import ProfileScreen from './screens/Profile';
import viewImage from './screens/viewImage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { PaperProvider } from 'react-native-paper';
import whiteTheme from './objects/commonCSS';
import Welcome from './newscreens/Welcome';

const Stack = createNativeStackNavigator();
const isSimulator = DeviceInfo.isEmulatorSync();

const initializeFirebase = async () => {
  // const credentials = { ... }; // Your Firebase credentials

  // if (!firebase.apps.length) {
  //   await firebase.initializeApp(credentials);

    // If running on a simulator on an Intel Mac, set a bogus APNs token
    if (isSimulator) {
      await messaging().setAPNSToken('74657374696E67746F6B656E', 'unknown');
      console.log('Set APNS token for Intel Mac simulator');
    }
  // }
};

function App(): JSX.Element {
  LogBox.ignoreAllLogs();

  useEffect(()=> {
    requestUserPermission();
    initializeFirebase();
    GetFCMToken();
    NotificationListner();
  }, []);
  
  return (
    <PaperProvider theme={whiteTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false ,navigationBarColor:"white"}}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login}/>
            {/* <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="viewImage" component={viewImage} />
            <Stack.Screen name="Profile" component={ProfileScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;