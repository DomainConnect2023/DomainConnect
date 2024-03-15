import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image, Pressable } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import { TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons'
import Register from './RegisterPage';
import { CustomDrawer } from '../components/CustomDrawer';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../components/keychainService';
import Snackbar from 'react-native-snackbar';
import { getGenericPassword } from 'react-native-keychain';
import { URLAccess } from '../objects/URLAccess';
import Verify from './Verify';

const Login = () => {
    const navigation = useNavigation();
    const [ishide, setishide] = useState(true);
    const [username,setusername] = useState("");
    const [password,setpassword] = useState("");
    const [locale, setLocale] = useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
        setLocale(i18n.locale);
        }, [])
    );

//     useEffect(()=>{
//         (async()=>{
//         await LoginApi();
//     })();

// },[]);

    const LoginApi=async()=>{
        RNFetchBlob.config({trusty:true}).fetch("POST",URLAccess.Url+"Login",{"Content-Type": "application/json"},
        JSON.stringify( {
            "username":username,
            "password":password,
            "token":await AsyncStorage.getItem("fcmtoken")
        })).then(async(res)=>{
            if(await res.json().isSuccess==true){
                setCredentials(username,password);
                const Credential= await getGenericPassword()
                await AsyncStorage.setItem('username',username);
                navigation.navigate(CustomDrawer as never);
            }
            else{
                Snackbar.show({
                    text:"Login Fail, Please Check Your credential and try again later.",
                    duration:Snackbar.LENGTH_LONG
                })
                console.log("Error")
            }
        }).catch(err=>{
            Snackbar.show({
                text:err.message,
                duration:Snackbar.LENGTH_LONG
            })
        })
        
    }

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
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
                            />
                        </View>
                        <View style={styles.InputRange}>
                            <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                onPress={() => {
                                    if (ishide == (true)) {
                                        setishide(false)
                                    } else {
                                        setishide(true)
                                    }
                                }}>
                                {ishide == true ?
                                    (
                                        <Octicons name="eye" size={40} style={{}} />
                                    ) : (
                                        <Octicons name="eye-closed" size={40} style={{}} />
                                    )}

                            </TouchableOpacity>
                            <TextInput
                                style={styles.Textinput}
                                secureTextEntry={ishide}
                                mode="outlined"
                                label={i18n.t('LoginPage.Password')}
                                value={password}
                                onChangeText={setpassword}
                            />

                        </View>
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={{ textAlign: "right", width: "95%", fontWeight: "bold", fontSize: 14, }}>Forgot Password?</Text>
                        </TouchableOpacity>
                        {/* navigation.navigate(CustomDrawer as never) */}
                        <TouchableOpacity style={styles.ButtonLogin} onPress={() => {LoginApi()}}>
                            <Text style={styles.fonth2}>
                                {i18n.t('LoginPage.Login-Button')}
                            </Text>
                        </TouchableOpacity>

                        {/* Fingerprint Login */}

                        {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, }}>{i18n.t('LoginPage.Or-Login-With')}</Text>
                            <View>
                                <TouchableOpacity onPress={() => }>
                                    <MaterialIcons name="fingerprint" size={65} style={{ marginTop: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View> */}

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
            </KeyboardAvoidWrapper>
        </MainContainer>
    );



}

export default Login;