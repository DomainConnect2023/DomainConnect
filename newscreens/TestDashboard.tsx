import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, FlatList, TouchableOpacity, Dimensions, Platform, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import MainContainer from '../components/MainContainer';
import QRCode from 'react-native-qrcode-svg';
import { NotificationData } from '../objects/objects';
import { css } from '../objects/commonCSS';
import axios from 'axios';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../language/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestDashboardScreen = ({ navigation }: any) => {


    const [processData, setProcessData] = useState(false);
    const [fetchedData, setFetchedData] = useState<NotificationData[]>([]);
    var setQRText: string;

    // Pagination Part
    const [itemFinish, setItemFinish] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemPerPage, setItemPerPage] = useState<number>(20);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            setProcessData(true);
            setFetchedData([]);
            fetchNotificationLogApi(currentPage);
        })();

        
    }, []);

    const fetchNotificationLogApi = async (page: number) => {
        // var getuserID = await AsyncStorage.getItem('userID');
        var getuserID = "2";

        await axios.post(URLAccess.notificationFunction, {
            "read": "1",
            "userID": getuserID,
            "page": page.toString(),
            "itemPerPage": itemPerPage.toString()
        }).then(async response => {
            if (response.data.status == "1") {
                setFetchedData((prevData) => [...prevData, ...response.data.data]);

            } else if (response.data.status == "3") {
                setItemFinish(true);

            } else {
                Snackbar.show({
                    text: 'Something is wrong. Can not get the data from server!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }).catch(error => {
            Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_SHORT,
            });
        });

        // setFetchedData((prevData) => [...prevData, ...dummyData]);

        setProcessData(false);
    };


    const onRefresh = async () => {
        setRefreshing(true);
        setFetchedData([]);
        setCurrentPage(1);
        fetchNotificationLogApi(1);
        setItemFinish(false);
        setRefreshing(false);
    };

    const loadMore = async () => {
        const passPage = currentPage + 1;
        setCurrentPage(passPage);
        await fetchNotificationLogApi(passPage);
    }

    const renderItem = ({ item }: { item: NotificationData }) => {
        if (item.qrText == null) {
            setQRText = "";
        } else {
            setQRText = item.qrText;
        }
        return (
            <TouchableOpacity onPress={() => { }}>
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

    const tab1 = ({ navigation }: any) => {
        return (
            <View>

            </View>
        )
    }

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#666699" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                        <Ionicons name="menu" size={26} color={"white"}   />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('DashboardPage.Dashboard')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView]}>
                    <TouchableOpacity  style={{ paddingLeft: 20, }}  onPress={() => { navigation.openDrawer() }} >
                        <Ionicons name="menu" size={26} color={"white"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('DashboardPage.Dashboard')}</Text>
                    </View>
                </View>
            )}

            {processData == true ? (
                <View style={[css.container]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{ height: Dimensions.get("screen").height / 100 * 77 }}>
                    <View style={[css.container]}>
                        <View style={styles.absoluteContainer}></View>

                        <View style={styles.profileCard}>
                            <View style={[css.row, { padding: 10 }]}>
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
                        onEndReached={loadMore}
                        ListFooterComponent={() => itemFinish && (
                            <View style={[css.listItem]}>
                                <View style={css.cardBody}>
                                    <Text style={[css.textHeader, { textAlign: 'center', fontWeight: "normal" }]}>
                                        No more Data
                                    </Text>
                                </View>
                            </View>
                        )}
                        refreshControl={<RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                    // horizontal  -- change slide from top>bottom to left>right
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

