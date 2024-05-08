import MainContainer from "../components/MainContainer"
import { StatusBar, Platform, View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator, Image, AppState, RefreshControl } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from "../objects/commonCSS"
import React, { useEffect, useState, useRef } from 'react';
import RNFetchBlob from "rn-fetch-blob";
import i18n from '../language/i18n';
import { URLAccess } from "../objects/URLAccess";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Notification } from "../objects/objects";
import { useFocusEffect } from "@react-navigation/native";


const Message = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [itemFinish, setItemFinish] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchedData, setFetchedData] = useState<Notification[]>([]);
    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    useEffect(() => {
        (async () => {
            
            await FetchNotificationData(currentPage);
            setLoading(false);
        })();
        if (Platform.OS === 'ios') {
            const listener = AppState.addEventListener('change', appcheck);
            return () => {
                listener.remove();
            }
        }
        else {
            const listener = AppState.addEventListener('change', appcheck);

            return () => {
                listener.remove();
            }
        }
    }, []);

    const appcheck = async (nextAppState: any) => {
        if (Platform.OS === "ios") {
            if (nextAppState == 'active') {
                console.log("APPSTATE OPEN IOS");
                onRefresh();
            }
        }
        else {
            if (nextAppState == 'active') {
                console.log("APPSTATE OPEN ANDROID");
                onRefresh();
            }
        }

    }

    const FetchNotificationData = async (page: number) => {
        let link =await AsyncStorage.getItem('IpAddress');
        const username = await AsyncStorage.getItem('username');
        
        await RNFetchBlob.config({
            trusty: true
        }).fetch('POST', "https://"+link + '/api/NotificationLog', { 'Content-Type': "application/json", },
            JSON.stringify({
                "username": username,
                "page": page.toString()
            })).then(async res => {
                
                setFetchedData((prevData) => [...prevData, ...JSON.parse(res.data)]);
                

            })
            .catch(error => {
                console.log(error);
            })
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setFetchedData([]);
        setCurrentPage(0);
        setItemFinish(false);
        setRefreshing(false);
    };

    const loadMore = async () => {
        const passPage = currentPage + 1;
        setCurrentPage(passPage);
        await FetchNotificationData(passPage);
    }

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear()

    const todayData = fetchedData.filter(item => {
        const dateTimeParts = item.created_at.split("T");
        const dateParts = dateTimeParts[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        return year === todayYear.toString() && month === todayMonth.toString() && day === todayDate.toString()
    })

    const otherData = fetchedData.filter(item => {
        const dateTimeParts = item.created_at.split("T");
        const dateParts = dateTimeParts[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        return year !== todayYear.toString() || month !== todayMonth.toString() || day !== todayDate.toString()
    });

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const renderTodayData = ({ item }: any) => {
        if (item.type === 'monthYear') {
            return (
                <Text style={styles.Time}>{i18n.t('Message.Today')}</Text>
            );
        } else {
            const date = item.created_at
            const convertTo12HourFormat = (timeString: string) => {
                const timeParts = timeString.split(":");
                let hours = parseInt(timeParts[0], 10);
                const minutes = timeParts[1];
                let ampm = "AM";

                if (hours >= 12) {
                    ampm = "PM";
                }

                if (hours > 12) {
                    hours -= 12;
                } else if (hours === 0) {
                    hours = 12;
                }

                return `${hours}:${minutes} ${ampm}`;
            };

            const dateTimeParts = date.split("T");
            const datePart = dateTimeParts[0];
            const timePart = dateTimeParts[1].substring(0, 5);
            const formattedTime = convertTo12HourFormat(timePart);

            const time = `${datePart} ${formattedTime}`;
            return (
                <TouchableOpacity onPress={() => navigation.navigate('MessageDetail', { item })}>
                    <View style={styles.MessageContainer}>
                        <View style={styles.UserName}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>{item.header}</Text>
                                <Text style={{ fontSize: 12, alignSelf: 'center', fontWeight: 'bold', color: '#646464', marginRight: 10 }}>{time}</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#808080', width: '90%' }} numberOfLines={1} ellipsizeMode="tail" >{item.textValue}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    const flatListTodayData = todayData.reduce((acc: any, item: any) => {
        const dateTimeParts = item.created_at.split("T");
        const dateParts = dateTimeParts[0].split("-");
        const month = dateParts[1];
        const year = dateParts[0];
        const key = `${year}-${month}`;
        if (!acc.find((entry: any) => entry.type === 'monthYear' && entry.key === key)) {
            acc.push({ type: 'monthYear', key, month, year });
        }
        acc.push(item);
        return acc;
    }, []);

    const renderData = ({ item }: any) => {
        if (item.type === 'monthYear') {
            const monthName = month[parseInt(item.month, 10) - 1];
            return (
                <Text style={styles.Time}>{monthName} {item.year}</Text>
            );
        } else {
            const date = item.created_at
            const convertTo12HourFormat = (timeString: string) => {
                const timeParts = timeString.split(":");
                let hours = parseInt(timeParts[0], 10);
                const minutes = timeParts[1];
                let ampm = "AM";

                if (hours >= 12) {
                    ampm = "PM";
                }

                if (hours > 12) {
                    hours -= 12;
                } else if (hours === 0) {
                    hours = 12;
                }

                return `${hours}:${minutes} ${ampm}`;
            };

            const dateTimeParts = date.split("T");
            const datePart = dateTimeParts[0];
            const timePart = dateTimeParts[1].substring(0, 5);
            const formattedTime = convertTo12HourFormat(timePart);

            const time = `${datePart} ${formattedTime}`;
            return (
                <TouchableOpacity onPress={() => navigation.navigate('MessageDetail', { item })}>
                    <View style={styles.MessageContainer}>
                        <View style={styles.UserName}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>{item.header}</Text>
                                <Text style={{ fontSize: 12, alignSelf: 'center', fontWeight: 'bold', color: '#646464', marginRight: 10 }}>{new Date(item.created_at).toLocaleString("en-US",{hour12:true,year:'numeric',month:"2-digit",day:'2-digit',hour:'numeric',minute:'numeric'})}</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#808080', width: '90%' }} numberOfLines={1} ellipsizeMode="tail" >{item.textValue}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    const flatListData = otherData.reduce((acc: any, item: any) => {
        const dateTimeParts = item.created_at.split("T");
        const dateParts = dateTimeParts[0].split("-");
        const month = dateParts[1];
        const year = dateParts[0];
        const key = `${year}-${month}`;
        if (!acc.find((entry: any) => entry.type === 'monthYear' && entry.key === key)) {
            acc.push({ type: 'monthYear', key, month, year });
        }
        acc.push(item);
        return acc;
    }, []);

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#FFFFFF" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView, { backgroundColor: 'transparent' }]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" size={26} color={"black"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={[css.PageName, { color: '#000000' }]}>{i18n.t('Message.Message')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.goBack() }} >
                        <Ionicons name="arrow-back" size={26} color={"black"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={[css.PageName, { color: '#000000' }]}>{i18n.t('Message.Message')}</Text>
                    </View>
                </View>
            )}
            {loading ? (
                <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <FlatList
                                data={flatListTodayData}
                                renderItem={renderTodayData}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <FlatList
                                data={flatListData}
                                renderItem={renderData}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={() => (
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Image source={require("../assets/DomainUIDesign/inbox.png")} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 100 }} />
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Oops!</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('Message.Not-Message')}</Text>
                                    </View>
                                )}
                                ListFooterComponent={() => itemFinish && (
                                    <View style={[css.listItem]}>
                                        <View style={css.cardBody}>
                                            <Text style={[css.textHeader, { textAlign: 'center', fontWeight: "normal" }]}>
                                            {i18n.t('Message.No-More')}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                onEndReached={()=>{loadMore()}}
                                refreshControl={<RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}

                                />}
                            />
                        </View>
                    
                </View>
            )}
        </MainContainer>
    )
}

const styles = StyleSheet.create({
    Time: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#646464',
        margin: 10,
        marginLeft: 25,
    },
    MessageContainer: {
        width: '90%',
        height: 70,
        alignSelf: 'center',
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: '#EEEEEE',
        paddingVertical: 10,
        borderRadius: 5,
    },
    UserIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignSelf: 'center',
        backgroundColor: '#7C91FF',
    },
    UserName: {
        marginLeft: 10,
        flex: 2,
        flexDirection: 'column'
    }
})

export default Message;

