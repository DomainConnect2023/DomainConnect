import MainContainer from "../components/MainContainer"
import { StatusBar, Platform, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from "../objects/commonCSS"
import React, { useState } from "react";
import SQLite from 'react-native-sqlite-storage';
import { Image } from "react-native-animatable";
import CustomDrawer from "../components/CustomDrawer";
import i18n from '../language/i18n';
import { useFocusEffect } from "@react-navigation/native";

const CollectedMessage = ({ navigation }: any) => {
    const [messages, setMessages] = useState<{ logID: number; header: string; created_at: string; textValue: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);
            const findData = async () => {
                const db = await SQLite.openDatabase({ name: 'Collected.db', createFromLocation: 1 });
                db.transaction((tx) => {
                    tx.executeSql(
                        'SELECT * FROM messages order by created_at desc;',
                        [],
                        (tx, results) => {
                            const len = results.rows.length;
                            const messages = [];
                            for (let i = 0; i < len; i++) {
                                messages.push(results.rows.item(i));
                            }
                            setMessages(messages)
                            setLoading(false);
                        },
                        (error) => {
                            console.error(error);
                            setLoading(false);
                        }
                    );
                });
            }
            findData();
        });

        return unsubscribe;
    }, [navigation]);

    const renderData = () => {
        if (messages.length > 0) {
            return messages.map((item) => {
                return (
                    <TouchableOpacity key={item.logID} onPress={() => navigation.navigate("MessageDetail", { item })}>
                        <View style={styles.MessageContainer}>
                            <View style={styles.UserName}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>{item.header}</Text>
                                    <Text style={{ fontSize: 12, alignSelf: 'center', fontWeight: 'bold', color: '#646464', marginRight: 10 }}>{item.created_at}</Text>
                                </View>
                                <Text style={{ fontSize: 14, color: '#808080', width: '90%' }} numberOfLines={1} ellipsizeMode="tail" >{item.textValue}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            });
        } else {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Image source={require("../assets/DomainUIDesign/inbox.png")} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 100 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Oops!</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('Message.Not-Collected')}</Text>
                </View>
            )
        }
    };

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#FFFFFF" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView, { backgroundColor: 'transparent' }]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.navigate(CustomDrawer) }}>
                        <Ionicons name="arrow-back" size={26} color={"black"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={[css.PageName, { color: '#000000' }]}>{i18n.t('Message.Collected')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.navigate(CustomDrawer) }} >
                        <Ionicons name="arrow-back" size={26} color={"black"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={[css.PageName, { color: '#000000' }]}>{i18n.t('Message.Collected')}</Text>
                    </View>
                </View>
            )}
            {loading ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {renderData()}
                        </View>
                    </ScrollView>
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
        backgroundColor: '#7C91FF'
    },
    UserName: {
        marginLeft: 10,
        flex: 2,
        flexDirection: 'column'
    }
})

export default CollectedMessage;
