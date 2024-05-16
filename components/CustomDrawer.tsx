import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, Image, Text, View, BackHandler } from 'react-native';
// import TestDashboardScreen from '../newscreens/TestDashboard';
// import TestSettingScreen from '../newscreens/TestSetting';
import Login from '../newscreens/LoginPage';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { styles } from '../objects/commonCSS';
import Admin from '../newscreens/Admin';
import i18n from '../language/i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { resetGenericPassword } from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../newscreens/Dashboard';
import SettingScreen from '../newscreens/Setting';
import DeviceInfo from 'react-native-device-info';
// Remember install gesturehandler and reanimated

const Drawer = createDrawerNavigator();


function CustomDrawerContent(props: any) {
  const navigation = useNavigation();
  const version = DeviceInfo.getVersion();
  const [loggedOut, setLoggedOut] = React.useState(false);

  const handleLogout = () => {
    resetGenericPassword();
    navigation.navigate(Login as never);
    AsyncStorage.removeItem('username');
    AsyncStorage.removeItem('password');
    AsyncStorage.removeItem('fcmtoken');
    setLoggedOut(true);
  };

  return (
    <View style={{ height: Dimensions.get("screen").height / 100 * 93 }}>
      <View style={{ flex: 0.25, flexDirection: "row", paddingTop: 10 }}>
        <Image source={require('../assets/logo.png')} style={{ flex: 1, height: Dimensions.get("screen").height / 100 * 10, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
        <Text style={styles.Header}>DOMAIN CONNECT</Text>
      </View>

      <DrawerContentScrollView contentContainerStyle={{ flex: 1 }} {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={i18n.t('Left-Navigation.LogOut')}
          onPress={handleLogout}
          icon={() =>
            <Ionicons name="log-out-sharp" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />}
        />
      </DrawerContentScrollView>

      <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center" ,flex:0.2}}>
      
      <Text style={{color:"gray" , fontSize:10}}> Version : {version}</Text>
                        
        <Text style={styles.fontsmall}>Develop by Domain Connect @2024</Text>

      </View>
    </View>
  );
};

export function CustomDrawer() {
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = React.useState(i18n.t('Left-Navigation.Dashboard'));

  React.useEffect(() => {
    setInitialRoute(i18n.t('Left-Navigation.Dashboard'));
  }, [i18n.locale]);


  return (
    <Drawer.Navigator initialRouteName={initialRoute} screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: "#666699",
      },
      headerTitleStyle: { color: "#FFF" },
      headerTintColor: '#fff',
      headerTitleAlign: 'left',
      drawerActiveBackgroundColor: "rgb(226, 223, 255)",
    }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={i18n.t('Left-Navigation.Dashboard')} component={DashboardScreen}
        options={{
          headerTitle: i18n.t('Left-Navigation.Dashboard'),
          headerRight: () => (
            <View style={{
              flex: 1, flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            </View>
          ),
          drawerIcon: ({ focused, size }) => (<Ionicons name="home" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />),
        }} />

      {/* <Drawer.Screen name={i18n.t('Left-Navigation.Admin')} component={Admin}
        options={{
          headerTitle: i18n.t('Left-Navigation.Admin'),
          headerRight: () => (
            <View style={{
              flex: 1, flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            </View>
          ),
          drawerIcon: ({ focused, size }) => (<FontAwesome name="user-tie" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />),
        }} /> */}

      <Drawer.Screen name={i18n.t('Left-Navigation.Setting')} component={SettingScreen}  
        options={{
          headerTitle: i18n.t('Left-Navigation.Setting'),
          headerRight: () => (
            <View style={{
              flex: 1, flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            </View>
          ),
          drawerIcon: ({ focused, size }) => (<Ionicons name="settings-outline" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />),
        }} />
    </Drawer.Navigator>
  );
}


export default CustomDrawer;