import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, SafeAreaView } from 'react-native';
import Login from './screens/LoginPage';
import Register from './screens/RegisterPage';
import { GetFCMToken, NotificationListner, requestUserPermission } from './components/pushNotification';
import TabNavigationScreen from './screens/TabNavigation';
import DashboardScreen from './screens/DashboardPage';
import ProfileScreen from './screens/Profile';
import viewImage from './screens/viewImage';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  LogBox.ignoreAllLogs();

  useEffect(()=> {
    requestUserPermission();
    GetFCMToken();
    NotificationListner();
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="viewImage" component={viewImage} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;