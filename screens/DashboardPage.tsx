import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Login from './LoginPage';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import viewImage from './viewImage';

interface NotificationData {
  logID: string;
  textValue: string;
  base64Image: string;
  imgUrl: string;
  qrText: string;
  createdTime: string;
  // other properties
}

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [processGetData, setProcessGetData] = useState(false);
  const [userID, setUserID] = React.useState<string | null>("Unknown");
  const [userName, setUserName] = React.useState<string | null>("Unknown");
  const [fetchedData, setFetchedData] = useState<NotificationData[]>([]); // fetch data from server
  var setQRText: string;

  // Pagination Part
  const [itemFinish, setItemFinish] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> {
    (async()=> {
        setFetchedData([]);
        AsyncStorage.getItem('userID').then( (value) => setUserID(value), );
        setProcessGetData(true);
        await fetchUserDetailApi();
        await fetchNotificationLogApi(currentPage);
    })();
  }, [])

  // logout
  const logout = () => {
    navigation.navigate(Login as never);
  }

  // set data to Flatlist
  const renderItem = ({ item }: { item: NotificationData }) => {
    if(item.qrText==null){
        setQRText="";
    }else{
        setQRText=item.qrText;
    }
    return (
        <TouchableOpacity onPress={() => viewFullImage(item.qrText)}>
            <View style={styles.listItem} key={parseInt(item.logID)}>
                <View style={[styles.cardBody,{flexDirection: 'row',paddingHorizontal: 0,}]}>
                    <View style={{padding:10}}>
                    {setQRText=="" ? (
                        <></>
                    ) : (
                        // <Image style={{width: 50, height: 50,}} source={{uri: setImgLink}}/>
                        <QRCode
                            size={50}
                            value={setQRText}
                        />
                    )}
                    </View>
                    <View style={{alignItems: 'flex-start',justifyContent: 'center',flex: 1,flexGrow: 1,}}>
                        <Text style={styles.textHeader}>Msg: {item.textValue}</Text>
                        <Text style={styles.textDescription}>Time: {item.createdTime}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  };

  // when data is empty
  const noitem = () => {
    return (
        <View style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#e0e0eb',padding: 10,borderRadius: 10,height: 70,marginVertical: 2,marginHorizontal: 5,}}>
            <Text>No Notification</Text>
        </View>
    );
  };

  function viewFullImage(qrText:string){
    if(qrText==null){
        Snackbar.show({
            text: "No QR Code in this log.",
            duration: Snackbar.LENGTH_SHORT,
        });
    }else{
        AsyncStorage.setItem('qrText', qrText);
        navigation.navigate(viewImage as never);
    }
  }

  // get user detail from server
  const fetchUserDetailApi = async() => {
    var getuserID = await AsyncStorage.getItem('userID');
    
    axios.post(URLAccess.userFunction, {"readDetail":"1", "userID":getuserID})
    .then(response => {
        if(response.data.status=="1"){
            setUserName(response.data.data[0].userName);
        }else{
            Snackbar.show({
                text: 'Something is wrong. Can not get the data from server!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    })
    .catch(error => {
        Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_SHORT,
        });
    });
  };

  // get notification log from server
  const fetchNotificationLogApi = async(page: number) => {
    var getuserID = await AsyncStorage.getItem('userID');
    
    axios.post(URLAccess.notificationFunction, {
        "read":"1", 
        "userID":getuserID, 
        "page":page.toString(), 
        "itemPerPage":itemPerPage.toString()
    })
    .then(response => {
        if(response.data.status=="1"){
            setFetchedData((prevData) => [...prevData, ...response.data.data]);
            return setProcessGetData(false);
        }else if(response.data.status=="3"){
            setItemFinish(true);
            return setProcessGetData(false);
        }else{
            Snackbar.show({
                text: 'Something is wrong. Can not get the data from server!',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    })
    .catch(error => {
        Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_SHORT,
        });
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setFetchedData([]);
    setCurrentPage(0);
    setItemFinish(false);
    setRefreshing(false);
  };

  const loadMore = async() => {
    const passPage= currentPage+1;
    setCurrentPage(passPage);
    await fetchNotificationLogApi(passPage);
  }

  return (
    <MainContainer>
        <View style={styles.mainView}>
            <View style={styles.HeaderView}>
                <Text style={styles.PageName}>Dashboard</Text>
            </View>
            <View style={styles.logoutView}>
                <Ionicons name="log-out-outline" size={34} color="gray" onPress={()=>logout()} style={{marginBottom:5,marginLeft:5}} />
            </View>
        </View>
        {processGetData==true ? (
        <View style={[styles.container]}>
            <ActivityIndicator size="large" />
        </View>
        ) : (
        <View>
            <View style={styles.container}>
                <QRCode value={userID !== null ? userID : undefined} />
                <Text style={[styles.textTitle,{fontSize:14}]}><Text style={{fontWeight:"normal"}}>Name:</Text> {userName ?? "null"}</Text>
            </View>
            <View style={styles.subContainer}>
                <Text style={styles.textTitle}>Notification:</Text>
            </View>
            <View style={{height:Dimensions.get("screen").height/100*45}}>
                <FlatList
                    data={fetchedData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.logID}
                    ListEmptyComponent={noitem}
                    // horizontal
                    onEndReached={loadMore}
                    ListFooterComponent={() => itemFinish && (
                    <View style={[styles.listItem,{height:40}]}>
                        <View style={styles.cardBody}>
                            <Text style={[styles.textHeader,{textAlign: 'center',fontWeight:"normal"}]}>
                                No more Data
                            </Text>
                        </View>
                    </View>
                    )}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                />
            </View>
        </View>
        )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
setScrollView: {
    flex: 1,
},
container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 20,
},
subContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 5,
},
input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
},
mainView:{
    width: '100%',
    height: 80, 
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: "#666699",
},
HeaderView :{
    flex: 1, 
    padding: 10,
    gap: 4, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    marginHorizontal: 4,
},
PageName: {
    color: "#FFFFFF",
    fontSize: 22,
},
logoutView: {
    width: 40,
    height: 40, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    borderRadius: 20,
    marginRight: 20
},
button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
},
text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
},
listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0eb',
    padding: 10,
    borderRadius: 10,
    // height: 70,
    marginVertical: 2,
    marginHorizontal: 5,
},
cardBody: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
},
textHeader: { 
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 4,
},
textDescription: {
    fontSize: 12,
    marginBottom: 6,
},
textTitle: {
    fontSize:18, 
    color:"black", 
    fontWeight:"bold"
},
});

export default DashboardScreen;
