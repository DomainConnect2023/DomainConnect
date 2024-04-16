import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Platform, SafeAreaView, ActivityIndicator, View, Dimensions, Alert } from 'react-native';
import Login from './newscreens/LoginPage';
import Register from './newscreens/RegisterPage';
// import TestDashboardScreen from './newscreens/TestDashboard';
// import TestSettingScreen from './newscreens/TestSetting';
import TestTabNavigation from './newscreens/TestNavigation';
import EditProfileScreen from './newscreens/EditProfile';
import { GetFCMToken, NotificationListner, requestUserPermission } from './components/pushNotification';
import TabNavigationScreen from './screens/TabNavigation';
import 'react-native-gesture-handler';
import ProfileScreen from './screens/Profile';
import viewImage from './screens/viewImage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { PaperProvider } from 'react-native-paper';
import whiteTheme from './objects/commonCSS';
import Welcome from './newscreens/Welcome';
import { CustomDrawer } from './components/CustomDrawer';
import Admin from './newscreens/Admin';
import Verify from './newscreens/Verify';
import { useState } from 'react';
import SessionManagement from './components/SessionManagement';
import DashboardScreen from './newscreens/Dashboard';
import SettingScreen from './newscreens/Setting';
import { hmsToken } from './components/hmsPushNotification';

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

  useEffect(() => {
    requestUserPermission();
    initializeFirebase();
    NotificationListner();
    hmsToken()
  }, []);

  const [loading, setLoading] = React.useState(true);
  const [initialRouteName, setInitialRouteName] = React.useState("Welcome");

  // Call SessionManagement function
  React.useEffect(() => {
    SessionManagement(setLoading, setInitialRouteName);
  }, []);

  return (
    <PaperProvider theme={whiteTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
            <ActivityIndicator size={80} color="#000000" />
          </View>
        ) : (
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false, navigationBarColor: "white" }}>
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Group screenOptions={{ navigationBarColor: "white", }}>
                <Stack.Screen name="TestTabNavigation" component={TestTabNavigation} />
                {/* <Stack.Screen name="TestDashboardScreen" component={TestDashboardScreen} /> */}
                <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                <Stack.Screen name="Admin" component={Admin} />
                <Stack.Screen name="Setting" component={SettingScreen} />
                {/* <Stack.Screen name="TestSettingScreen" component={TestSettingScreen} /> */}
                <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
                <Stack.Screen name="CustomDrawer" component={CustomDrawer} />
                <Stack.Screen name="Verify" component={Verify} />
              </Stack.Group>

              {/* <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="viewImage" component={viewImage} />
            <Stack.Screen name="Profile" component={ProfileScreen} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </PaperProvider>
  )
}

export default App;