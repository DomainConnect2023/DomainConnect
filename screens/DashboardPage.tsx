import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
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
import { NotificationData } from '../objects/objects';
import { css } from '../objects/commonCSS';

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
        setProcessGetData(true);
        setFetchedData([]);
        AsyncStorage.getItem('userID').then( (value) => setUserID(value), );
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
            <View style={css.listItem} key={parseInt(item.logID)}>
                <View style={[css.cardBody,{flexDirection: 'row',paddingHorizontal: 0,}]}>
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
                        <Text style={css.textHeader}>Msg: {item.textValue}</Text>
                        <Text style={css.textDescription}>Time: {item.createdTime}</Text>
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
    
    await axios.post(URLAccess.notificationFunction, {
        "read":"1", 
        "userID":getuserID, 
        "page":page.toString(), 
        "itemPerPage":itemPerPage.toString()
    })
    .then(async response => {
        if(response.data.status=="1"){
            setFetchedData((prevData) => [...prevData, ...response.data.data]);
        }else if(response.data.status=="3"){
            setItemFinish(true);
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
    setProcessGetData(false);
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
        <View style={[css.mainView,{marginTop:0}]}>
            <View style={css.HeaderView}>
                <Text style={css.PageName}>Dashboard</Text>
            </View>
            <View style={{flexDirection:'row',}}>
                <View style={css.listThing}>
                    <Ionicons 
                    name="log-out-outline" 
                    size={30} 
                    color="#FFF" 
                    onPress={()=>[logout()]} />
                </View>
            </View>
        </View>
        {processGetData==true ? (
        <View style={[css.container]}>
            <ActivityIndicator size="large" />
        </View>
        ) : (
        <View>
            <View style={[css.container,{height:Dimensions.get("screen").height/100*20}]}>
                <QRCode value={userID !== null ? userID : undefined} />
                <Text style={[css.textTitle,{fontSize:14}]}><Text style={{fontWeight:"normal"}}>Name:</Text> {userName ?? "null"}</Text>
            </View>
            <View style={{height:Dimensions.get("screen").height/100*53}}>
                <View style={css.subContainer}>
                    <Text style={css.textTitle}>Notification:</Text>
                </View>
                <View>
                    <FlatList
                        data={fetchedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.logID}
                        ListEmptyComponent={noitem}
                        // horizontal
                        onEndReached={loadMore}
                        ListFooterComponent={() => itemFinish && (
                        <View style={[css.listItem]}>
                            <View style={css.cardBody}>
                                <Text style={[css.textHeader,{textAlign: 'center',fontWeight:"normal"}]}>
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
        </View>
        )}
    </MainContainer>
  );
};

export default DashboardScreen;
