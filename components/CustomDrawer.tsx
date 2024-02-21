import * as React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions, Platform, View } from 'react-native';
import TestDashboardScreen from '../newscreens/TestDashboard';
import TestSettingScreen from '../newscreens/TestSetting';
import Login from '../newscreens/LoginPage';
import { useNavigation } from '@react-navigation/native';

// Remember install gesturehandler and reanimated

const Drawer = createDrawerNavigator();





function CustomDrawerContent(props: any) {
  const navigation = useNavigation();


  return (
    <DrawerContentScrollView contentContainerStyle={{flex: 1}} {...props} 
    // style={{backgroundColor:colorThemeDB.colors.primaryContainer}}
    >
      <DrawerItemList {...props} />
      <DrawerItem label="Log Out" onPress={()=>{navigation.navigate(Login as never)}}/>
    </DrawerContentScrollView>
  );
};

export function CustomDrawer() {

  
  return (
    <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: "#666699",
      },
      headerTitleStyle: {color: "#FFF"},
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
          <View style={{flex:1,flexDirection: "row",
          justifyContent: 'center',
          alignItems: 'center',}}>
            {/* <Ionicons name="search-circle-sharp" size={35} color="#FFF" style={{marginLeft:5,marginRight:5}} onPress={() => navigation.navigate(TestTabNavigation as never)} /> */}
            {/* <Ionicons name="log-out-outline" size={35} color="#FFF" style={{marginLeft:5,marginRight:10}} onPress={() => setIsSignedIn(false)} /> */}
          </View>
        ),
      }} />

<Drawer.Screen name="Setting" component={TestSettingScreen} 
      options={{
        headerTitle: 'Setting',
        headerRight: () => (
          <View style={{flex:1,flexDirection: "row",
          justifyContent: 'center',
          alignItems: 'center',}}>
            {/* <Ionicons name="search-circle-sharp" size={35} color="#FFF" style={{marginLeft:5,marginRight:5}} onPress={() => navigation.navigate(TestTabNavigation as never)} /> */}
            {/* <Ionicons name="log-out-outline" size={35} color="#FFF" style={{marginLeft:5,marginRight:10}} onPress={() => setIsSignedIn(false)} /> */}
          </View>
        ),
      }} />

      

      {/* <Drawer.Screen name="Grading" component={GradingScreen} options={{
        headerTitle: 'Grading',
        headerRight: () => (
          <View style={css.row}>
            <Ionicons name="search-circle-sharp" size={35} color="#FFF" style={{ marginLeft: 5, marginRight: 5 }} onPress={() => navigation.navigate(SearchScreen as never)} />
             <Ionicons name="log-out-outline" size={35} color="#FFF" style={{ marginLeft: 5, marginRight: 10 }} onPress={() => setIsSignedIn(false)} /> 
          </View>
        ),
      }} /> */}
      
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} /> */}
      {/* <Drawer.Screen name="PreviosDashboard" component={DashboardScreen} options={{
        headerTitle: 'Dashboard',
        headerRight: () => (
          <View>
            <Ionicons name="search-circle-sharp" size={40} color="#FFF" onPress={() => navigation.navigate(SearchScreen as never)} />
          </View>
        ),
      }} /> */}
    </Drawer.Navigator>
  );
}
export default CustomDrawer;