import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, TextInput, Dimensions, Keyboard, ActivityIndicator, Alert, Modal, Pressable, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import i18n from '../language/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import RNFetchBlob from 'rn-fetch-blob';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import Login from './LoginPage';
import Feather from 'react-native-vector-icons/Feather'

const Verify = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [errorOccurred, setErrorOccurred] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    const [email, setemail] = useState<String | null>('')
    const [number1, setnumber1] = useState('');
    const [number2, setnumber2] = useState('');
    const [number3, setnumber3] = useState('');
    const [number4, setnumber4] = useState('');
    const [number5, setnumber5] = useState('');
    const [number6, setnumber6] = useState('');
    let latesttime=Date.now();
    const input_ref_1 = useRef<any>();
    const input_ref_2 = useRef<any>();
    const input_ref_3 = useRef<any>();
    const input_ref_4 = useRef<any>();
    const input_ref_5 = useRef<any>();
    const input_ref_6 = useRef<any>();

    // State to track the currently focused input
    const [currentFocus, setCurrentFocus] = useState("");

    useEffect(() => {
        (async () => {
            const Email = await AsyncStorage.getItem("Email" ?? " ");
            setemail(Email);
        })();
    }, []);

    const GETOTP = async () => {
        setLoading(true);
        let link =await AsyncStorage.getItem('IpAddress');
        console.log("Start")

        RNFetchBlob.config({ trusty: true }).fetch("POST", 'https://'+link + "/api/GetOTP", { "Content-Type": "application/json" },
            JSON.stringify({
                "Email": email
            })).then(async (res) => {
                if (await res.json().isSuccess == true) {

                    navigation.navigate(Verify as never);

                }
                else {
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    })
                    console.log("Error")
                }
                setLoading(false);
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false);
            })
    }

    const handleKeyPressing =(e:  { nativeEvent: { key: string; };timeStamp:any})=>{
        if(e.nativeEvent.key !== 'Backspace'){
        latesttime=Date.now()
        switch (e.nativeEvent.key){
                case '1': case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9':case '0':
                if(currentFocus=='input_ref_6'){
                    setnumber6(e.nativeEvent.key)
                    Keyboard.dismiss()
                }else if(currentFocus == 'input_ref_5'){
                    setnumber5(e.nativeEvent.key)
                    input_ref_6.current.focus()
                }
                else if(currentFocus == 'input_ref_4'){
                    setnumber4(e.nativeEvent.key)
                    input_ref_5.current.focus()
                }
                else if(currentFocus == 'input_ref_3'){
                    setnumber3(e.nativeEvent.key)
                    input_ref_4.current.focus()
                }
                else if(currentFocus == 'input_ref_2'){
                    setnumber2(e.nativeEvent.key)
                    input_ref_3.current.focus()
                }else{
                    setnumber1(e.nativeEvent.key)
                    input_ref_2.current.focus()
                };
                break;
        }
        }

        if(e.nativeEvent.key === 'Backspace' && Date.now() -latesttime >50){
            switch (e.nativeEvent.key){
                case 'Backspace': 
            if(currentFocus=='input_ref_6'){
                setnumber6('')
                input_ref_5.current.focus()
            }else if(currentFocus == 'input_ref_5'){
                setnumber5('')
                input_ref_4.current.focus()
            }
            else if(currentFocus == 'input_ref_4'){
                setnumber4('')
                input_ref_3.current.focus()
            }
            else if(currentFocus == 'input_ref_3'){
                setnumber3('')
                input_ref_2.current.focus()
            }
            else if(currentFocus == 'input_ref_2'){
                setnumber2('')
                input_ref_1.current.focus()
            }else{
                setnumber1('')

            }
            ;break;
            }
            
        }
    }

    const RegisterUser = async () => {
        let link =await AsyncStorage.getItem('IpAddress');
        setLoading(true);
        RNFetchBlob.config({ trusty: true }).fetch("POST", 'https://'+link + "/api/RegisterUser", { "Content-Type": "application/json" },
            JSON.stringify({
                "status": await AsyncStorage.getItem("Status"),
                "OTP_Number": (number1 + number2 + number3 + number4 + number5 + number6),
                "User_Name": await AsyncStorage.getItem("Username"),
                "Password": await AsyncStorage.getItem("Password"),
                "Email": await AsyncStorage.getItem("Email"),
                "Company_Name": await AsyncStorage.getItem("Company"),
                "Vehicle_No": await AsyncStorage.getItem("Vehicle"),
                "Mobile_No": await AsyncStorage.getItem("MobileNo"),
                "Birth_Date": await AsyncStorage.getItem("BirthDate")
            })).then(async (res) => {
                if (await res.json().isSuccess == true) {
                    AsyncStorage.removeItem("Status");
                    AsyncStorage.removeItem("Username"),
                        AsyncStorage.removeItem("Password"),
                        AsyncStorage.removeItem("Email"),
                        AsyncStorage.removeItem("Company"),
                        AsyncStorage.removeItem("Vehicle"),
                        AsyncStorage.removeItem("MobileNo"),
                        AsyncStorage.removeItem("BirthDate")
                    // AsyncStorage.clear();

                    setModalVisible(true)

                }
                else {
                    Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                    })
                    setErrorOccurred(false)

                    console.log("Error")
                }
                setLoading(false);
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false);
            })
    }

    return (
        <MainContainer >

            {loading ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <KeyboardAvoidWrapper >
                    <StatusBar animated={true} backgroundColor="white" barStyle={'dark-content'} />
                    <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ flex: 0.7, alignSelf: "center", justifyContent: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 24 }}>{i18n.t('VerifyPage.Enter Verification Code')}</Text>
                        </View>
                        <View style={{ flex: 2.5, alignItems: "center", alignSelf: "center" }}>
                            <Image source={require('../assets/professional-email-icon.png')} style={{ resizeMode: "contain", width: 300, height: 300 }} />
                            <Text style={{ marginTop: 20, color: 'grey' }}>{i18n.t('VerifyPage.Send Code to')} {email} .</Text>
                            <Text style={{ color: 'grey' }}>{i18n.t('VerifyPage.Please enter Verification Code')}</Text>
                        </View>

                        <View style={{ flex: 0.5, flexDirection: "row", justifyContent: "center", alignSelf: "center" }}>
                            <TextInput
                                autoFocus={errorOccurred}
                                value={number1}
                                onFocus={() => { setCurrentFocus('input_ref_1') }}
                                style={styles.NumberInput}
                                ref={input_ref_1}
                                keyboardType={"numeric"}
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_2') }}
                                style={styles.NumberInput}
                                value={number2}
                                ref={input_ref_2}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_3') }}
                                style={styles.NumberInput}
                                value={number3}
                                ref={input_ref_3}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}

                               
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_4') }}
                                style={styles.NumberInput}
                                value={number4}
                                ref={input_ref_4}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_5') }}
                                style={styles.NumberInput}
                                value={number5}
                                ref={input_ref_5}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                            <TextInput
                                onFocus={() => { setCurrentFocus('input_ref_6') }}
                                style={styles.NumberInput}
                                value={number6}
                                ref={input_ref_6}
                                keyboardType={"numeric"}
                                
                                returnKeyType={"next"}
                                maxLength={1}
                                textAlign={'center'}
                                onKeyPress={(item)=>{handleKeyPressing(item)}}
                                
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ color: 'grey' }}>
                                    {i18n.t('VerifyPage.Didt Receive the Code?')}
                                </Text>
                                <TouchableOpacity style={{ paddingLeft: 10 }}>
                                    <Text style={{ color: 'blue' }} onPress={() => {
                                        GETOTP();
                                    }}>{i18n.t('VerifyPage.Resend')}</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={{
                                alignSelf: "center",
                                backgroundColor: "#D9D9D9",
                                marginBottom: 10,
                                borderRadius: 5,
                                width: "80%",
                                height: "30%",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10
                            }} onPress={() => { RegisterUser(); }} >
                                <Text style={styles.fonth2}>
                                    {i18n.t('VerifyPage.Verify_The_Code')}
                                </Text>
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Feather name='check' size={50} color={'#FFFFFF'} style={{ backgroundColor: 'green', borderRadius: 50, padding: 10 }}></Feather>
                                        <Text style={styles.modalText}>{i18n.t('VerifyPage.Register Successful !')}</Text>
                                        <Pressable
                                            style={[styles.buttonClose]}
                                            onPress={() => navigation.navigate(Login as never)}>
                                            <Text style={styles.textStyle}>{i18n.t('VerifyPage.Login')}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>

                </KeyboardAvoidWrapper>
            )}

        </MainContainer>
    )
}

const style = StyleSheet.create({

});

export default Verify;