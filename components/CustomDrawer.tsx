import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, Image, Platform, Text, View } from 'react-native';
import TestDashboardScreen from '../newscreens/TestDashboard';
import TestSettingScreen from '../newscreens/TestSetting';
import Login from '../newscreens/LoginPage';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../objects/commonCSS';


// Remember install gesturehandler and reanimated

const Drawer = createDrawerNavigator();





function CustomDrawerContent(props: any) {
  const navigation = useNavigation();


  return (
    <><View style={{ height: Dimensions.get("screen").height / 100 * 93 }}>
      <View style={{ flex: 0.25, flexDirection: "row", paddingTop: 10 }}>
        <Image source={require('../assets/logo.png')} style={{ flex: 1, height: Dimensions.get("screen").height / 100 * 10, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
        <Text style={styles.Header}>DOMAIN CONNECT</Text>
      </View>

      <DrawerContentScrollView contentContainerStyle={{ flex: 1 }} {...props}
      >
        <DrawerItemList {...props} />
        <DrawerItem label="Log Out" onPress={() => { navigation.navigate(Login as never); }} icon={() => <Ionicons name="log-out-sharp" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />} />
      </DrawerContentScrollView>

      <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
        <Text style={styles.fontsmall}>Develop by Domain Connect @2024</Text>

      </View>

    </View></>
  );
};

export function CustomDrawer() {


  return (

    <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{
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
      <Drawer.Screen name="Dashboard" component={TestDashboardScreen}
        options={{
          headerTitle: 'Dashboard',
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

      <Drawer.Screen name="Setting" component={TestSettingScreen}
        options={{
          headerTitle: 'Setting',
          headerRight: () => (
            <View style={{
              flex: 1, flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            </View>
          ),
          drawerIcon: ({ focused, size }) => (<Ionicons name="settings-outline" size={35} color="black" style={{ marginLeft: 5, marginRight: 5 }} />),
        }} />




    </Drawer.Navigator>
  );
}
export default CustomDrawer;