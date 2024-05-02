import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import { TextInput, HelperText } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import Register from './RegisterPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../components/keychainService';
import Snackbar from 'react-native-snackbar';
import { getGenericPassword } from 'react-native-keychain';
import { URLAccess } from '../objects/URLAccess';
import { CommonActions } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation();
    const [ishide, setishide] = useState(true);
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [locale, setLocale] = useState(i18n.locale);
    const passwordInputRef = useRef<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [usernameHelperText, setusernameHelperText] = useState(false);
    const [passwordHelperText, setpasswordHelperText] = useState(false);
    const [token, setToken] = useState("");
    

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    // Refresh page When the user logout 
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setusername('');
            setpassword('');
        }
    );

        return unsubscribe;
    }, [navigation]);

    const checkEmpty = () => {
        let emtpy = false;
        if (username === '') {
            setusernameHelperText(true)
            emtpy = true;
        } else {
            setusernameHelperText(false)
        }

        if (password === '') {
            setpasswordHelperText(true)
            emtpy = true;
        } else {
            setpasswordHelperText(false)
        }

        if (!emtpy) {
            LoginApi();
        }
    }

    useEffect(() => {
        if (username) {
            setusernameHelperText(false)
        }
        if (password) {
            setpasswordHelperText(false)
        }

    })

    const LoginApi = async () => {
        setLoading(true)
        
        RNFetchBlob.config({ trusty: true }).fetch("POST", URLAccess.Url + "api/Login", { "Content-Type": "application/json" },
            JSON.stringify({
                "username": username.split(' ')[0],
                "password": password,
                "token": await AsyncStorage.getItem("fcmtoken"),
                "service": await AsyncStorage.getItem("service"),
            })).then(async (res) => {
                if (await res.json().isSuccess == true) {
                    setCredentials(username, password);
                    const Credential = await getGenericPassword()
                    await AsyncStorage.setItem('username', username);
                    await AsyncStorage.setItem('password', password);
                    await AsyncStorage.setItem('display', res.json().display);
                    await AsyncStorage.setItem('company', res.json().company);
                    await AsyncStorage.setItem('firstLauncher', 'false')
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'CustomDrawer' },
                            ],
                        })
                    );
                    setLoading(false)
                }
                else {
                    Snackbar.show({
                        text: "Login Fail, Please Check Your credential and try again later.",
                        duration: Snackbar.LENGTH_LONG
                    })
                    console.log("Error")
                    setLoading(false)
                }
                
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false)
            })
        
    }

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                    <StatusBar animated={true} backgroundColor="white" barStyle={'dark-content'} />
            {loading ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                // <KeyboardAvoidWrapper>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ flex: 0.3, flexDirection: "row" }}>
                            <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 15, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                            <Text style={styles.Header}>DOMAIN CONNECT</Text>
                        </View>

                        {/*End Header */}
                        <View style={{ flex: 1 }}>
                            <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                                <Text style={styles.fontLogin}>{i18n.t('LoginPage.Title')}</Text>
                                <Text style={styles.fontsmall}>{i18n.t('LoginPage.SubTitle')}</Text>
                            </View>
                            {/* Login Information */}
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    label={i18n.t('LoginPage.UserName')}
                                    value={username}
                                    onChangeText={setusername}
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                                />
                                {usernameHelperText && <HelperText type="error">{i18n.t('HelperText.UsernameLogin')}</HelperText>}
                            </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    ref={passwordInputRef}
                                    style={styles.Textinput}
                                    secureTextEntry={ishide}
                                    mode="outlined"
                                    label={i18n.t('LoginPage.Password')}
                                    value={password}
                                    onChangeText={setpassword}
                                    right={ishide ? <TextInput.Icon icon="eye" onPress={value => setishide(false)} />
                                        : <TextInput.Icon icon="eye-off" onPress={value => setishide(true)} />}
                                />
                                {passwordHelperText && <HelperText type="error">{i18n.t('HelperText.PasswordLogin')}</HelperText>}
                            </View>
                            {/* Forgot Password */}

                            {/* <TouchableOpacity onPress={() => { }}>
                                <Text style={{ textAlign: "right", width: "95%", fontWeight: "bold", fontSize: 14, }}>Forgot Password?</Text>
                            </TouchableOpacity> */}

                            {/* navigation.navigate(CustomDrawer as never) */}
                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { checkEmpty() }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('LoginPage.Login-Button')}
                                </Text>
                            </TouchableOpacity>

                            {/* Fingerprint Login */}

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, }}>{i18n.t('LoginPage.Or-Login-With')}</Text>
                            <View>
                                <TouchableOpacity onPress={() => navigation.navigate('Verify' as never)}>
                                    <MaterialIcons name="fingerprint" size={65} style={{ marginTop: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View> 

                        </View>
                        {/* End Login Information */}



                        {/* Footer */}
                        <View style={{ justifyContent: "flex-end" }}>
                            <View style={styles.blackline} />
                            <TouchableOpacity onPress={() => { navigation.navigate(Register as never) }}>
                                <Text style={styles.fonth2}>{i18n.t("LoginPage.Don't-Have-Account")}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* End Footer */}
                    </View>
                </KeyboardAvoidingView>
                // </KeyboardAvoidWrapper>
            )}
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
}

export default Login;