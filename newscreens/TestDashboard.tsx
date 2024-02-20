import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, StyleSheet, ActivityIndicator,StatusBar } from 'react-native';
import MainContainer from '../components/MainContainer';
import QRCode from 'react-native-qrcode-svg';
import { NotificationData } from '../objects/objects';
import { css } from '../objects/commonCSS';
import i18n from '../language/i18n';

const TestDashboardScreen = () => {
    
    const [processData, setProcessData] = useState(false);
    const [fetchedData, setFetchedData] = useState<NotificationData[]>([]);
    var setQRText: string;

    useEffect(() => {
        (async () => {
            fetchNotificationLogApi();
        })();
    }, []);

    const fetchNotificationLogApi = async () => {
        setProcessData(true);
        // var getuserID = await AsyncStorage.getItem('userID');
        setFetchedData([]);
        setFetchedData((prevData) => [...prevData, ...dummyData]);

        setProcessData(false);
    };

    const renderItem = ({ item }: { item: NotificationData }) => {
        if (item.qrText == null) {
            setQRText = "";
        } else {
            setQRText = item.qrText;
        }
        return (
            
            <TouchableOpacity onPress={() => {}}>
                <View style={css.listItem} key={parseInt(item.logID)}>
                    <View style={[css.cardBody, { flexDirection: 'row', paddingHorizontal: 0, }]}>
                        <View style={{ padding: 10 }}>
                            {setQRText == "" ? (
                                <></>
                            ) : (
                                // <Image style={{width: 50, height: 50,}} source={{uri: setImgLink}}/>
                                <QRCode
                                    size={50}
                                    value={setQRText}
                                />
                            )}
                        </View>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', flex: 1, flexGrow: 1, }}>
                            <Text style={css.textHeader}>{i18n.t('DashboardPage.Msg')}: {item.textValue}</Text>
                            <Text style={css.textDescription}>{i18n.t('DashboardPage.Time')}: {item.createdTime}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#666699" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView, { marginTop: -20 }]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>--- {i18n.t('DashboardPage.Dashboard')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: 0 }]}>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>--- {i18n.t('DashboardPage.Dashboard')}</Text>
                    </View>
                </View>
            )}

            {processData == true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{height:Dimensions.get("screen").height/100*77}}>
                    <View style={[css.container]}>
                        <View style={styles.absoluteContainer}></View>

                        <View style={styles.profileCard}>
                            <View style={[css.row,{padding: 10}]}>
                                <View>
                                    <QRCode value={"aaa123"} />
                                </View>
                                <View style={[styles.profileText,]}>
                                    <Text style={css.textHeader}>{i18n.t('DashboardPage.Name')}: AAA</Text>
                                    <Text style={css.textHeader}>{i18n.t('DashboardPage.Company')}: BBB</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={css.subContainer}>
                            <Text style={css.textTitle}>{i18n.t('DashboardPage.Notification')}:</Text>
                        </View>
                    </View>
                    <FlatList
                        data={fetchedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.logID}
                    />
                </View>
            )}
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#666699',
        width: Dimensions.get("screen").width,
        height: 100,
    },
    profileCard: {
        flexGrow: 1,
        padding: 20,
        width: "90%",
        backgroundColor: '#E6E8EA',
        borderRadius: 20,
    },
    profileText: {
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        padding: 15,
        flex: 1, 
        flexGrow: 1,
    },
});

export default TestDashboardScreen;

const dummyData: NotificationData[] = [
    {
      logID: '1',
      textValue: 'Notification 1',
      base64Image: 'base64encodedimage1',
      imgUrl: 'https://example.com/image1.jpg',
      qrText: 'QRCodeText1',
      createdTime: '2024-01-15T10:30:00Z',
    },
    {
      logID: '2',
      textValue: 'Notification 2',
      base64Image: 'base64encodedimage2',
      imgUrl: 'https://example.com/image2.jpg',
      qrText: 'QRCodeText2',
      createdTime: '2024-01-15T11:45:00Z',
    },
    {
      logID: '3',
      textValue: 'Notification 3',
      base64Image: 'base64encodedimage3',
      imgUrl: 'https://example.com/image3.jpg',
      qrText: 'QRCodeText3',
      createdTime: '2024-01-15T13:15:00Z',
    },
    {
      logID: '4',
      textValue: 'Notification 4',
      base64Image: 'base64encodedimage4',
      imgUrl: 'https://example.com/image4.jpg',
      qrText: 'QRCodeText4',
      createdTime: '2024-01-15T15:00:00Z',
    },
    {
      logID: '5',
      textValue: 'Notification 5',
      base64Image: 'base64encodedimage5',
      imgUrl: 'https://example.com/image5.jpg',
      qrText: 'QRCodeText5',
      createdTime: '2024-01-15T16:30:00Z',
    },
    {
      logID: '6',
      textValue: 'Notification 6',
      base64Image: 'base64encodedimage6',
      imgUrl: 'https://example.com/image6.jpg',
      qrText: 'QRCodeText6',
      createdTime: '2024-01-15T18:20:00Z',
    },
    {
      logID: '7',
      textValue: 'Notification 7',
      base64Image: 'base64encodedimage7',
      imgUrl: 'https://example.com/image7.jpg',
      qrText: 'QRCodeText7',
      createdTime: '2024-01-15T20:10:00Z',
    },
    {
      logID: '8',
      textValue: 'Notification 8',
      base64Image: 'base64encodedimage8',
      imgUrl: 'https://example.com/image8.jpg',
      qrText: 'QRCodeText8',
      createdTime: '2024-01-15T22:00:00Z',
    },
    {
      logID: '9',
      textValue: 'Notification 9',
      base64Image: 'base64encodedimage9',
      imgUrl: 'https://example.com/image9.jpg',
      qrText: 'QRCodeText9',
      createdTime: '2024-01-16T01:30:00Z',
    },
    {
      logID: '10',
      textValue: 'Notification 10',
      base64Image: 'base64encodedimage10',
      imgUrl: 'https://example.com/image10.jpg',
      qrText: 'QRCodeText10',
      createdTime: '2024-01-16T03:45:00Z',
    },
  ];