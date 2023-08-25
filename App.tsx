import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, SafeAreaView } from 'react-native';
import Login from './screens/LoginPage';
import Register from './screens/RegisterPage';
import { GetFCMToken, NotificationListner, requestUserPermission } from './components/pushNotification';
import TabNavigation from './screens/TabNavigation';
import Dashboard from './screens/DashboardPage';

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
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;