import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Platform, SafeAreaView, ActivityIndicator, View, Dimensions, Alert } from 'react-native';
import Login from './newscreens/LoginPage';
import Register from './newscreens/RegisterPage';
import TestTabNavigation from './newscreens/TestNavigation';
import EditProfileScreen from './newscreens/EditProfile';
import { GetFCMToken, NotificationListner, requestUserPermission } from './components/pushNotification';
import TabNavigationScreen from './screens/TabNavigation';
import 'react-native-gesture-handler';
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
import MessageDetail from './newscreens/MessageDetail';
import localStorage from './components/localStorage';
import CustomBottomTabNavigator from './components/BottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../DomainConnect/language/i18n';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const isSimulator = DeviceInfo.isEmulatorSync();
const STORAGE_KEY = '@app_language';
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
  const [hasHms, setHasHms] = useState(false);

  useEffect(() => {
    const checkHms = async () => {
      const hmsAvailable = await DeviceInfo.hasHms();
      setHasHms(hmsAvailable);
    };
    const loadLanguage = async () => {
      try {
          const language = await AsyncStorage.getItem(STORAGE_KEY);
          if (language) {
              i18n.locale = language;
              setLocale(language);
          }
      } catch (error) {
          console.error('Failed to load language', error);
      }
  };

  loadLanguage();
    checkHms();
  }, []);

  const gmsToken = async () => {
    GetFCMToken();
    requestUserPermission();
    NotificationListner();
    initializeFirebase();
  }

  const checkMobileService = async () => {
    if (hasHms == true) {
      hmsToken()
    } else {
      gmsToken()
    }
  }

  useEffect(() => {
    checkMobileService()
    localStorage()
  },[])

  const [loading, setLoading] = React.useState(true);
  const [initialRouteName, setInitialRouteName] = React.useState("Welcome");
  const [locale, setLocale] = React.useState(i18n.locale);

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
            {/* <Stack.Screen name="Verify" component={Verify} / */}

            
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Group screenOptions={{ navigationBarColor: "white", }}>
                <Stack.Screen name="TestTabNavigation" component={TestTabNavigation} />
                <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                <Stack.Screen name="Admin" component={Admin} />
                <Stack.Screen name="Setting" component={SettingScreen} />
                <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
                <Stack.Screen name="CustomDrawer" component={CustomDrawer} />
                <Stack.Screen name="Verify" component={Verify} />
                <Stack.Screen name="CustomBottomTabNavigator" component={CustomBottomTabNavigator} />
                <Stack.Screen name="MessageDetail" component={MessageDetail} />
  
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