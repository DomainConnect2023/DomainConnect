import { useFocusEffect } from '@react-navigation/native';
import { StatusBar, View, Text, TouchableOpacity, Platform, StyleSheet, Image, Dimensions } from 'react-native';
import MainContainer from '../components/MainContainer';
import { css } from '../objects/commonCSS';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import i18n from '../language/i18n';
import React, { useEffect } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { URLAccess } from '../objects/URLAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const DashboardScreen = ({ navigation }: any) => {

    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    useEffect(() => {
        (async () => {
            checktoken();
        })();
    }, []);

    const checktoken = async () => {
        RNFetchBlob.config({ trusty: true }).fetch("POST", URLAccess.Url + "CheckToken", { "Content-Type": "application/json" },
            JSON.stringify({
                "token": await AsyncStorage.getItem('fcmtoken'),
                "username": await AsyncStorage.getItem('username')
            })).then(async (res) => {
                if (await res.json().isSuccess == true) {
                    AsyncStorage.getItem('fcmtoken').then((token) => {
                        console.log("Token:", token)
                    })
                }
                else {
                    Snackbar.show({
                        text: "Token No Detect",
                        duration: Snackbar.LENGTH_LONG
                    })
                    console.log("Error")
                }
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
            })
    }

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#7174F8" barStyle={'dark-content'} />
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.3 }} colors={['#6E71F7', '#FFFFFF']} style={styles.linearGradient}>
                {Platform.OS === "android" ? (
                    <View style={[css.mainView, { backgroundColor: 'transparent' }]}>
                        <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                            <Ionicons name="menu" size={26} color={"white"} />
                        </TouchableOpacity>
                        <View style={css.HeaderView}>
                            <Text style={css.PageName}>Dashboard</Text>
                        </View>
                    </View>
                ) : (
                    <View style={[css.mainView]}>
                        <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }} >
                            <Ionicons name="menu" size={26} color={"white"} />
                        </TouchableOpacity>
                        <View style={css.HeaderView}>
                            <Text style={css.PageName}>Dashboard</Text>
                        </View>
                    </View>
                )}

                {/*Profile Container*/}
                <LinearGradient colors={['#B4D2FF', '#9191F5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.Profile}>
                    {/*Profile Image Container*/}
                    <View style={styles.UserImageContainer}>
                        <Image source={require('../assets/profile.png')} style={styles.UserImage} />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginTop: 20 }}>Mr. Anonymous</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#696969', marginTop: 10 }}>Domain Connect Sdn Bhd</Text>
                </LinearGradient>

                {/*Scroll Horizontal Container*/}
                <View style={styles.scrollView}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity>
                            <View style={styles.ScrollViewButton}>
                                <Text style={styles.ButtonText}>Example</Text>
                                <Image source={require('../assets/Example.png')} style={styles.ButtonIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.ScrollViewButton}>
                                <Text style={styles.ButtonText}>Example</Text>
                                <Image source={require('../assets/Example.png')} style={styles.ButtonIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.ScrollViewButton}>
                                <Text style={styles.ButtonText}>Example</Text>
                                <Image source={require('../assets/Example.png')} style={styles.ButtonIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.ScrollViewButton}>
                                <Text style={styles.ButtonText}>Example</Text>
                                <Image source={require('../assets/Example.png')} style={styles.ButtonIcon} />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/** Advetiser Container */}
                <Image source={require('../assets/Advetiser.png')} style={styles.Advetiser} resizeMode='contain' />

                {/** Bottom Button Container */}
                <View style={{ alignSelf: 'flex-start', flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: '3%', marginLeft: '5%' }}>Component</Text>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/profile.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Profile</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.Button}>
                                    <Image source={require('../assets/Example.png')} style={styles.Icon} />
                                    <Text style={[styles.ButtonText, { color: '#FFFFFF' }]}>Example</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </LinearGradient>
        </MainContainer >
    )
}

export default DashboardScreen;

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: 'center'
    },
    UserImageContainer: {
        width: 68,
        height: 68,
        borderRadius: 68 / 2,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        zIndex: 1,
        marginTop: -30,
    },
    UserImage: {
        width: 64,
        height: 64,
        borderRadius: 64 / 2,
        margin: 1
    },
    Profile: {
        width: '90%',
        margin: Dimensions.get('screen').height / 100 * 4,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingVertical: 20,
    },
    scrollView: {
        width: '100%',
        paddingLeft: '5%'
    },
    ScrollViewButton: {
        borderWidth: 1,
        borderColor: '#C3C3C3',
        width: Dimensions.get('screen').width / 100 * 25,
        padding: 10,
        borderRadius: 10,
        marginRight: 10
    },
    ButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    ButtonIcon: {
        width: 30,
        height: 30,
        marginTop: 10,
        alignSelf: 'flex-end'
    },
    Advetiser: {
        marginTop: 20,
        height: '24%',
    },
    Button: {
        width: Dimensions.get('screen').width / 100 * 20,
        height: Dimensions.get('screen').width / 100 * 22,
        borderRadius: 10,
        alignItems: 'center',
        margin: Dimensions.get('screen').width / 100 * 2.5,
        backgroundColor: '#5D60FA'
    },
    Icon: {
        width: Dimensions.get('screen').width / 100 * 15,
        height: Dimensions.get('screen').width / 100 * 15,
        marginTop: 10,
        alignSelf: 'center',
    }
})