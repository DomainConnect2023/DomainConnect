import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Linking, Modal, Platform, Pressable, TouchableOpacity } from 'react-native';
import { View, Text, TextInput as TextInputs, StyleSheet } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterPage';
import { ImagesAssets } from '../objects/ImagesAssets';
import TabNavigation from './TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { authenticateFingerPrint, checkBiometricSupportednEnrolled } from '../components/biometricService';
import { setCredentials } from '../components/keychainService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGenericPassword, resetGenericPassword } from 'react-native-keychain';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import {requestNotifications} from 'react-native-permissions';
import ReactNativeBiometrics from 'react-native-biometrics'
import { TextInput } from 'react-native-paper';

type UserData = {
    username: string;
    password: string;
    [key: string]: string;
};

const { width } = Dimensions.get("window"); 

const Login = () => {
    const navigation = useNavigation();
        
    const inputRef = React.createRef<TextInputs>();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [processData, setProcessData] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false); 
    const [userEmail, setUserEmail] = useState(""); 

    const toggleModalVisibility = () => { 
        setModalVisible(!isModalVisible); 
    }; 

    useEffect(()=> {
        (async()=> {
            if(Platform.OS==="android"){
                requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                    if(status !== "granted"){
                        Snackbar.show({
                            text: "Not Allowed",
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    }
                });
            }
        })();
    }, [])

    const loginAPI = async() => {
        // await resetGenericPassword();
        const token = await AsyncStorage.getItem('fcmtoken');
        const credentials = await getGenericPassword();
        const formData = new FormData();

        // console.log(URLAccess.userFunction);
        console.log(username+" "+password+" "+token);
        
        const jsonData: UserData = {
            "read": "1",
            "username": username as string, // test data: name= 'yeong';
            "password": password as string, // test data: pswd= '12345'
            "tokenValue":token as string,
        };

        for (const key in jsonData) {
            formData.append(key, jsonData[key]);
        }
        
        
        await axios.post(URLAccess.userFunction, 
        jsonData).then(async response => {
            console.log(response.data);
            if(response.data.status=="1"){
                setUserName("");
                setPassword("");
                if (credentials) {
                    if(credentials.username!=username){
                        Alert.alert('Set the finger Print?', 'Seems your user name is different. Do you want to set to the new one? ', [
                            {text: 'OK', onPress: () => setCredentials(username, password)},
                            {text: 'No', onPress: () => console.log('nothing happened.')},
                        ]);
                    }
                    AsyncStorage.setItem('userID', response.data.userID);
                    navigation.navigate(TabNavigation as never);
                }else{
                    Alert.alert('Set the finger Print?', 'Do you want to use the finger print function? ', [
                        {text: 'OK', onPress: () => setCredentials(username, password)},
                        {text: 'No', onPress: () => console.log('nothing happened.')},
                    ]);
                    AsyncStorage.setItem('userID', response.data.userID);
                    navigation.navigate(TabNavigation as never);
                }
            }else{
                Snackbar.show({
                    text: 'Login Failed, Your email or password is incorrect!',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }).catch(error => {
            Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_SHORT,
            });
        });
    };

    const fingerLoginAPI = async() => {
        const token = await AsyncStorage.getItem('fcmtoken');
        const credentials = await getGenericPassword();
        const formData = new FormData();
        if (credentials) { 
            const jsonData: UserData = {
                "read": "1",
                "username": credentials.username as string,
                "password": credentials.password as string,
                "tokenValue":token as string,
            };

            for (const key in jsonData) {
                formData.append(key, jsonData[key]);
            }
            
            await axios.post(URLAccess.userFunction, 
            jsonData).then(async response => {
                if(response.data.status=="1"){
                    AsyncStorage.setItem('userID', response.data.userID);
                    navigation.navigate(TabNavigation as never);
                }else{
                    Snackbar.show({
                        text: 'Login Failed, Your email or password is incorrect!',
                        duration: Snackbar.LENGTH_INDEFINITE,
                    });
                }
            }).catch(error => {
                Snackbar.show({
                    text: error,
                    duration: Snackbar.LENGTH_SHORT,
                });
            });

        }
    };

    const faceLoginAPI = async() => {
        const rnBiometrics = new ReactNativeBiometrics()

        rnBiometrics.createKeys().then((resultObject) => {
            const { publicKey } = resultObject
            console.log(publicKey)
            // sendPublicKeyToServer(publicKey)
        });

        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
        let payload = epochTimeSeconds + 'some message';
        rnBiometrics.createSignature({
            promptMessage: 'Sign in',
            payload: payload
            })
            .then((resultObject) => {
            const { success, signature } = resultObject
        
            if (success) {
                console.log(signature);
                console.log(payload);
            //   verifySignatureWithServer(signature, payload)
            }
        });
    }

    const checkValue = async () => {
        let isFingerPrintSupported = await checkBiometricSupportednEnrolled();
        if (isFingerPrintSupported === true) {
            const credentials = await getGenericPassword();
            if (credentials) {
                let checkResult = await authenticateFingerPrint(credentials.username,credentials.password);
                if(checkResult==true){
                    fingerLoginAPI();
                }else{
                    Alert.alert('Login failed', 'Please type your email or password manually again. ', [
                        {text: 'OK', onPress: () => console.log('')},
                    ]);
                }
            }else{
                Alert.alert('Login failed', 'You have not been accessed the fingerprint yet. ', [
                    {text: 'OK', onPress: () => console.log('')},
                ]);
            }
        } else {
            Alert.alert("Alert", isFingerPrintSupported as string, [{
                text: 'Ok', onPress: () => {
                //redirect to settings
                Platform.OS === "ios"
                    ? Linking.openURL('app-settings:')
                    :  console.log("wrong");
                }
            }] );
        }
    }

    const resetPassword = async (email:string) => {
        setProcessData(true);
        axios.post(URLAccess.emailFunction, {"toWho": email, "emailType": "forgotPassword"})
        .then(response => {
            if(response.data.status=="1"){
                setModalVisible(false);
                Alert.alert('Verification Email', 'An email has sent to your email already. Please verify it.', [
                    {text: 'OK', onPress: async () => [
                        // setUserEmail(""),
                        // await resetGenericPassword()
                        setProcessData(false)
                    ]},
                ]);
                
            }else{
                Snackbar.show({
                    text: 'Please double check your email is typing correctly',
                    duration: Snackbar.LENGTH_SHORT,
                });
                setProcessData(false);
            }
        }).catch(error => {
            Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_SHORT,
            });
            setModalVisible(false);
        });
    }

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
            <View style={styles.container}>
                <Image
                source={ImagesAssets.logoImage}
                style={{width: 250, height: 250}}
                />
                {/* <Text style={{color:"black",fontWeight:"bold",fontSize:20}}>Login</Text> */}
                {/* <View style={styles.subcontainer}> */}

                <View style={styles.subcontainer}>
                    <TextInput 
                        mode='outlined'
                        style={styles.nameInput}
                        onSubmitEditing={() => inputRef.current?.focus()}
                        placeholder=""
                        value={username}
                        onChangeText={setUserName}
                        label="User Name"
                    />
                
                    <TouchableOpacity style={{width:"20%", padding:"3%"}} onPress={() => checkValue()}>
                        <View>
                            <Ionicons  name={"finger-print-sharp" ?? ""} size={40} color={"gray"} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.subcontainer}>
                    <TextInput
                        mode='outlined'
                        style={styles.passInput}
                        // placeholder="Password"
                        ref={inputRef}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        label="Password"
                    />
                    {/* <TouchableOpacity style={{width:"20%", padding:"3%"}} onPress={() => faceLoginAPI()}>
                        <View>
                            <Ionicons  name={"scan-outline" ?? ""} size={40} color={"gray"} />
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={{width:"20%", padding:"3%"}}>
                        <View>
                            {/* <Ionicons  name={"scan-outline" ?? ""} size={40} color={"gray"} /> */}
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{width:"85%"}} onPress={() => {navigation.navigate(RegisterScreen as never)}}>
                    <View>
                        <Text style={styles.registerFont}>Register</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width:"85%",marginTop:20,marginBottom:20}} onPress={() => {toggleModalVisibility()}}>
                    <View>
                        <Text style={styles.registerFont}>Forgot Password</Text>
                    </View>
                </TouchableOpacity>
                <Pressable style={styles.button} onPress={()=>loginAPI()}>
                    <Text style={styles.bttnText}>Login</Text>
                </Pressable>

                <Modal animationType="slide" 
                   transparent visible={isModalVisible}  
                   presentationStyle="overFullScreen" >
                {/*     onDismiss={toggleModalVisibility}>  */}
                    {processData==true ? (
                    <View style={[styles.viewWrapper]}>
                        <ActivityIndicator size="large" />
                    </View>
                    ) : (
                    <View style={styles.viewWrapper}> 
                        <View style={styles.modalView}> 
                            <Text style={styles.emailText}>Forgot Password </Text>
                            <TextInput 
                                value={userEmail} 
                                style={styles.textInput}  
                                onChangeText={(value) => setUserEmail(value)}
                                mode='outlined'
                                label="Email"
                            /> 
                            {/** This button is responsible to close the modal */} 
                            <View style={styles.row}>
                                <Pressable style={styles.button} onPress={()=>resetPassword(userEmail)}>
                                    <Text style={styles.bttnText}>Submit</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={()=>toggleModalVisibility()}>
                                    <Text style={styles.bttnText}>Back</Text>
                                </Pressable> 
                            </View>
                        </View> 
                    </View> 
                    )}
                </Modal>
            </View>
            
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"gray"
    },
    nameInput: {
        width: '70%',
        marginBottom: 10,
        paddingLeft: 10,
        borderColor: '#fff',
        color: "#000",
    },
    passInput: {
        width: '70%',
        marginBottom: 10,
        paddingLeft: 10,
        borderColor: '#fff',
        color: "#000",
    },
    registerFont: {
        color: "blue",
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginRight: 5,
        marginLeft: 5,
    },
    bttnText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    viewWrapper: { 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "rgba(0, 0, 0, 0.2)", 
    }, 
    modalView: { 
        alignItems: "center", 
        justifyContent: "center", 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        elevation: 5, 
        transform: [{ translateX: -(width * 0.4) },  
                    { translateY: -90 }], 
        height: 180, 
        width: width * 0.8, 
        backgroundColor: "#fff", 
        borderRadius: 7, 
    }, 
    textInput: { 
        width: "80%", 
        borderRadius: 5, 
        // paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderColor: "rgba(0, 0, 0, 0.2)", 
    }, 
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailText: {
        marginTop: 30, 
        width:"75%", 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color:"#404040",
        fontSize:14,
    },
});

export default Login;
