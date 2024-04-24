import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StatusBar, ScrollView, Alert } from 'react-native';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from '../objects/commonCSS';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Snackbar from 'react-native-snackbar';
import { Notification } from '../objects/objects';
interface RouteParams {
    item: Notification;
}

const MessageDetail = () => {
    const route = useRoute();
    const { item } = route.params as RouteParams;
    const navigation = useNavigation();

    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        const checkIfFilled = async () => {
            const db = await SQLite.openDatabase({ name: 'Collected.db', location: 'default' });
            db.transaction((tx: any) => {
                tx.executeSql(
                    'SELECT * FROM messages WHERE logID = ?',
                    [item.logID],
                    (tx: any, results: any) => {
                        if (results.rows.length > 0) {
                            setIsFilled(true);
                        } else {
                            setIsFilled(false);
                        }
                    },
                    (error: any) => {
                        console.error('Select error:', error);
                    }
                );
            });
        };

        checkIfFilled();
    }, []);

    const toggleStar = async () => {
        setIsFilled(!isFilled);
        const db = await SQLite.openDatabase({ name: 'Collected.db', location: 'default' });

        if (isFilled) {
            db.transaction((tx: any) => {
                tx.executeSql(
                    'DELETE FROM messages WHERE logID = ?',
                    [item.logID],
                    (tx: any, results: any) => {
                        console.log('Delete success:', results.rowsAffected);
                        Snackbar.show({
                            text: 'Cancel Collected',
                            duration: Snackbar.LENGTH_SHORT,
                        })
                    },
                    (error: any) => {
                        console.error('Delete error:', error);
                    }
                );
            });
        } else {
            db.transaction((tx: any) => {
                tx.executeSql(
                    'INSERT INTO messages (logID, header, created_at, textValue) VALUES (?, ?, ?, ?)',
                    [item.logID, item.header, item.created_at, item.textValue ],
                    (tx: any, results: any) => {
                        console.log('Insert success:', results.rowsAffected);
                        Snackbar.show({
                            text: 'Collected Successful',
                            duration: Snackbar.LENGTH_SHORT,
                        })
                    },
                    (error: any) => {
                        console.error('Insert error:', error);
                    }
                );
            });
        }
    };

    const DeleteData = () => {
        Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => navigation.goBack()
            }
        ])
        return null;
    }

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#FFFFFF" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView, { backgroundColor: '#FFFFFF' }]}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            color="#000000"
                            onPress={() => [navigation.goBack()]} />
                        <Text style={{ color: "#000000", fontSize: 20, marginLeft: 20, fontWeight: 'bold' }}>Message Detail</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: -20, backgroundColor: '#FFFFFF' }]}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            color="#000000"
                            onPress={() => [navigation.goBack()]} />
                    </View>
                </View>
            )}
            <View style={{ flex: 8, flexDirection: 'column' }}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>{item.header}</Text>
                    <Text style={{ alignSelf: 'center', fontSize: 12, marginRight: 10, color: '#646464' }}>{item.created_at}</Text>
                </View>
                <ScrollView style={styles.messageBox}>
                    <Text style={styles.message}>{item.textValue}</Text>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <Ionicons
                        name={isFilled ? 'bookmark' : 'bookmark-outline'}
                        color={isFilled ? 'black' : 'black'}
                        size={30}
                        style={styles.icon}
                        onPress={() => toggleStar()}
                    />
                    <Ionicons
                        name='trash'
                        size={30}
                        style={styles.icon}
                        onPress={() => DeleteData()}
                    />
                </View>
            </View>
        </MainContainer>
    )
}

const styles = StyleSheet.create({
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        marginHorizontal: 10,
        borderRadius: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginVertical: 10
    },
    messageBox: {
        flex: 1,
        borderWidth: 0.5,
        marginHorizontal: 10,
        borderRadius: 5,
        marginTop: 10
    },
    message: {
        fontSize: 14,
        color: '#000000',
        marginHorizontal: 20,
        marginVertical: 10
    },
    icon: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        textAlign: 'center',
        lineHeight: 50,
        borderWidth: 0.5,
        borderRadius: 25,
        marginTop: 5
    }
})

export default MessageDetail;