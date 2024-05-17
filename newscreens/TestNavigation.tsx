import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
// import TestDashboardScreen from './TestDashboard';
// import TestSettingScreen from './TestSetting';
import i18n from '../language/i18n';

const Tab = createBottomTabNavigator();

const TestTabNavigation = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === i18n.t('Bottom-Navigation.Dashboard')) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === i18n.t('Bottom-Navigation.Setting')) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: { 
            height: Dimensions.get("screen").height/100*11,
            backgroundColor:"#d9d9d9"
            
          },
        })}
      >
        {/* <Tab.Screen options={{ unmountOnBlur: true, }} name={i18n.t('Bottom-Navigation.Dashboard')} component={TestDashboardScreen} />
        <Tab.Screen options={{ unmountOnBlur: true, }} name={i18n.t('Bottom-Navigation.Setting')} component={TestSettingScreen} /> */}
      </Tab.Navigator>
  );
}

export default TestTabNavigation;
