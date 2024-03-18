import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image, Pressable } from 'react-native';
import MainContainer from '../components/MainContainer';
import { datepickerCSS, styles } from '../objects/commonCSS';
import { HelperText, TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import Octicons from 'react-native-vector-icons/Octicons'
import Login from './LoginPage';
import { ProgressBar } from 'react-native-paper';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { URLAccess } from '../objects/URLAccess';
import Snackbar from 'react-native-snackbar';
import Verify from './Verify';

const Register = () => {
    const navigation = useNavigation();
    const [stage, setstage] = useState(1);
    const [ishide, setishide] = useState(true);
    const [retypeishide, setretypeishide] = useState(true);
    const [locale, setLocale] = React.useState(i18n.locale);
    const phoneInput = useRef<PhoneInput>(null);

    // user information
    const [Company, setCompany] = useState('');
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Retypepass, setRetypepass] = useState('');
    const [mobileValue, setMobileValue] = useState('');
    const [formatmobileValue, setformatmobileValue] = useState('')
    const [mobileCountry, setMobileCountry] = useState<string | null>('MY');
    const [Vehicle, setVehicle] = useState('');
    const [Status, setStatus] = useState(1);

    //date time picker
    const [birthDate, setBirthDate] = useState("");
    const [keepDatetoDatabase, setKeepDatetoDatabase] = useState("");
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    //IOS Date Setup
    const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());


    // IOS Date picker modal setup
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const hideIOSDatePicker = () => {
        setDatePickerVisible(false);
    };
    // END IOS Date Picker modal setup

    const [companyHelperText, setComapnyHelperText] = useState(false);
    const [UserIDHelperText, setUserIDHelperText] = useState(false);
    const [EmailHelperText, setEmailHelperText] = useState(false);
    const [PasswordHelperText, setPasswordHelperText] = useState(false);
    const [RetypeHelperText, setRetypeHelperText] = useState(false);
    const [readyToNextStage, setToNextStage] = useState(false);

    const hasErrors = () => {
        // return Email.length == 0;
        return false;
    };
    const isInputEmpty = (input: String) => {
        return input.length == 0 ? true : false
    }
    const isInputDuplicated = async (input: String, type: String) => {
    }
    const isPasswordNotSame = () => {
        return Password.length > 0 && Retypepass.length > 0 && Password != Retypepass ? true : false
    }
    const handleInputChanges = (type: any, input: any) =>
    {
        switch(type)
        {
            case 'company':
                setCompany(input);
                isInputEmpty(input) ? setComapnyHelperText(true) : setComapnyHelperText(false);
                break;
            case 'userID':
                setUsername(input);
                isInputEmpty(input) ? setUserIDHelperText(true) : setUserIDHelperText(false);
                break;
            case 'email':
                setEmail(input);
                isInputEmpty(input) ? setEmailHelperText(true) : setEmailHelperText(false);
            case 'password':
                setPassword(input);
                isInputEmpty(input) ? setPasswordHelperText(true) : setPasswordHelperText(false);
            case 'retypePassword':
                setRetypepass(input);
                isInputEmpty(input) ? setRetypeHelperText(true) : setRetypeHelperText(false);
        }
    }
    const inputs = [
        { value: Company, setHelperText: setComapnyHelperText },
        { value: Username, setHelperText: setUserIDHelperText },
        { value: Email, setHelperText: setEmailHelperText },
        { value: Password, setHelperText: setPasswordHelperText },
        { value: Retypepass, setHelperText: setRetypeHelperText },
    ];
    const IsInputCorrect = (stage: any) => {
        let allInputsCorrect = true;
    
        inputs.forEach(input => {
            if (isInputEmpty(input.value)) {
                input.setHelperText(true);
                allInputsCorrect = false;
            }
            else{
                input.setHelperText(false);
            }
        });

        if(isPasswordNotSame())
        {  
            setRetypeHelperText(true);
            allInputsCorrect = false;
        }
    
        setToNextStage(allInputsCorrect);
    
        if (stage === 1 && allInputsCorrect) {
            setstage(2);
        }
    }

    const tonggleDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowPicker(!showPicker);
        }
        else if (Platform.OS === 'ios') {
            setDatePickerVisible(true);
        }
    }
    const onChange = ({ type }: any, selectedDate: any) => {
        if (type == "set") {
            console.log(selectedDate)
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                tonggleDatePicker();
                setBirthDate(currentDate.toDateString());
                setKeepDatetoDatabase(currentDate.toISOString())
            }
        } else {
            tonggleDatePicker();
        }
    }

    const confirmIOSDate = async (date: any) => {

        const currentDate = date;
        setSelectedIOSDate(date);
        setBirthDate(currentDate.toString());
        setKeepDatetoDatabase(currentDate.toISOString())
        setDatePickerVisible(false);
    }


    const GETOTP = async () => {
        console.log("Start")

        if (Status == 1) {
            console.log("Stage 1")
            await AsyncStorage.setItem("Status", Status.toString());
            await AsyncStorage.setItem("Username", Username);
            await AsyncStorage.setItem("Email", Email);
            await AsyncStorage.setItem("Company", Company);
            await AsyncStorage.setItem("Password", Password);
            await AsyncStorage.setItem("MobileNo", formatmobileValue);
            await AsyncStorage.setItem("BirthDate", keepDatetoDatabase);
            await AsyncStorage.setItem("Vehicle", Vehicle);
        }
        else {
            console.log("Stage 2")
            await AsyncStorage.setItem("Status", Status.toString());
            await AsyncStorage.setItem("Username", Username);
            await AsyncStorage.setItem("Email", Email);
            await AsyncStorage.setItem("Company", Company);
            await AsyncStorage.setItem("Password", Password);
            await AsyncStorage.setItem("MobileNo", " ");
            await AsyncStorage.setItem("BirthDate", " ");
            await AsyncStorage.setItem("Vehicle", " ");
        }


        RNFetchBlob.config({ trusty: true }).fetch("POST", URLAccess.Url + "GetOTP", { "Content-Type": "application/json" },
            JSON.stringify({
                "Email": Email
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
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
            })



    }


    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );
    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                {/* Header */}
                <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                    <View style={{ flex: 0.15, flexDirection: "row", paddingTop: 10 }}>
                        <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 10, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                        <Text style={styles.Header}>DOMAIN CONNECT</Text>
                    </View>


                    {/*End Header */}

                    <View style={{ flex: 1, maxHeight: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                            <Text style={styles.fontLogin}>{i18n.t('RegisterPage.Title')}</Text>
                            {stage == 1 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle')}</Text>}
                            {stage == 2 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle-Page2')}</Text>}
                            {stage == 3 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle-Page3')}</Text>}
                        </View>
                        {/* Stage 1 information */}

                        {stage == 1 &&
                            <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                                <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                                <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                                <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            </View>
                                <View style={styles.InputRange}>
                                    <TextInput
                                        style={styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Company-Name')}
                                        value={Company}
                                        onChangeText={text => handleInputChanges('company', text)} />
                                    {companyHelperText && <HelperText type="error" style = {{height: 20}}>
                                        Company is invalid!
                                    </HelperText>}
                                </View>
                                <View style={styles.InputRange}>
                                    <TextInput
                                        style={companyHelperText?styles.Textinput_NoMargin:styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.UserName.UserName')}
                                        value={Username}
                                        onChangeText={text => handleInputChanges('userID', text)}
                                    />
                                    {UserIDHelperText && <HelperText type="error" style = {{height: 20}}>
                                        UserName is invalid!
                                    </HelperText>}
                                </View>
                                <View style={styles.InputRange}>
                                    <TextInput
                                        style={UserIDHelperText?styles.Textinput_NoMargin:styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Email')}
                                        value={Email}
                                        onChangeText={text => handleInputChanges('email', text)}
                                    />
                                    {EmailHelperText && <HelperText type="error" style = {{height: 20}}>
                                        Email address is invalid!
                                    </HelperText>}

                                </View>
                                <View style={styles.InputRange}>
                                    {/* <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                        onPress={() => {
                                            if (ishide == (true)) {
                                                setishide(false);
                                            } else {
                                                setishide(true);
                                            }
                                        }}>
                                        {ishide == true ?
                                            (
                                                <Octicons name="eye" size={40} style={{}} />
                                            ) : (
                                                <Octicons name="eye-closed" size={40} style={{}} />
                                            )}

                                    </TouchableOpacity> */}
                                    <TextInput
                                        style={EmailHelperText?styles.Textinput_NoMargin:styles.Textinput}
                                        secureTextEntry={ishide}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Password.Password')}
                                        value={Password}
                                        onChangeText={text => handleInputChanges('password', text)}
                                        right = {ishide?<TextInput.Icon icon="eye" onPress={value => setishide(false)} /> 
                                        : <TextInput.Icon icon="eye-off" onPress={value => setishide(true)} /> }
                                    />
                                     {PasswordHelperText && <HelperText type="error" style = {{height: 20}}>
                                        Password is required!
                                    </HelperText>}
                                </View>
                                <View style={styles.InputRange}>
                                    {/* <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                        onPress={() => {
                                            if (retypeishide == (true)) {
                                                setretypeishide(false);
                                            } else {
                                                setretypeishide(true);
                                            }
                                        }}>
                                        {retypeishide == true ?
                                            (
                                                <Octicons name="eye" size={40} style={{}} />
                                            ) : (
                                                <Octicons name="eye-closed" size={40} style={{}} />
                                            )}

                                    </TouchableOpacity> */}
                                    <TextInput
                                    //FIXME: close eye will cause first char capital
                                        style={PasswordHelperText?styles.Textinput_NoMargin:styles.Textinput}
                                        secureTextEntry={retypeishide}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Password.Retype-Password')}
                                        value={Retypepass}
                                        onChangeText={text => handleInputChanges('retypePassword', text)}
                                        right = {retypeishide?<TextInput.Icon icon="eye" onPress={value => setretypeishide(false)} /> 
                                        : <TextInput.Icon icon="eye-off" onPress={value => setretypeishide(true)} /> }
                                    />
                                    {RetypeHelperText && <HelperText type="error">Please check retype passoword</HelperText>}
                                </View>
                                <TouchableOpacity style={RetypeHelperText?styles.ButtonLogin_NoMargin:styles.ButtonLogin} onPress={() => { IsInputCorrect(1) }}>
                                    <Text style={styles.fonth2}>
                                        {i18n.t('RegisterPage.Next-Button')}
                                    </Text>
                                </TouchableOpacity></>}
                        {/*End Stage 1*/}

                        {/* Stage 2*/}

                        {stage == 2 && <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                        </View>
                            <View style={styles.InputRange}>
                                <PhoneInput
                                    containerStyle={{
                                        alignSelf: "center",
                                        marginTop: 20,
                                        width: "100%",
                                        height: 60,
                                        borderRadius: 5,
                                        borderWidth: 1,

                                    }}
                                    textContainerStyle={{
                                        borderLeftWidth: 1,
                                        borderBottomWidth: 0.5,
                                        backgroundColor: "white"

                                    }}
                                    textInputStyle={{
                                        margin: -10
                                    }}
                                    textInputProps={{ multiline: false }}
                                    ref={phoneInput}
                                    defaultValue={mobileValue}
                                    defaultCode={mobileCountry as any}
                                    layout="second"
                                    onChangeText={(text) => {
                                        setMobileValue(text)
                                    }}
                                    onChangeFormattedText={(text) => {
                                        setformatmobileValue(text)
                                    }}
                                />
                            </View>
                            <View style={styles.InputRange}>
                                {showPicker && <DateTimePicker
                                    mode="date"
                                    display="default"
                                    value={date}
                                    onChange={onChange}
                                    style={datepickerCSS.datePicker}
                                />}

                                {Platform.OS === "ios" && (<DateTimePickerModal
                                    date={selectedIOSDate}
                                    isVisible={datePickerVisible}
                                    mode="date"
                                    display='inline'
                                    onConfirm={confirmIOSDate}
                                    onCancel={hideIOSDatePicker}
                                />)}

                                <TextInput
                                    placeholder="Birth Date"
                                    style={styles.Textinput}
                                    mode="outlined"
                                    value={birthDate}
                                    onChangeText={setBirthDate}
                                    label={"Birth Date"}
                                    editable={false}

                                />
                                <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }} onPress={tonggleDatePicker}>
                                    <Image source={require('../assets/calendar_3.png')} style={{ resizeMode: 'contain', alignSelf: "center", width: 40, height: 40 }} />
                                </TouchableOpacity>



                            </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    value={Vehicle}
                                    onChangeText={setVehicle}
                                    label={i18n.t('RegisterPage.Vehicle')} />
                            </View>
                            <View style={{ justifyContent: "center", flexDirection: "row" }}>
                                <View style={{ width: "20%", height: 1, backgroundColor: "black", alignSelf: 'center', marginHorizontal: 20 }} />
                                <TouchableOpacity onPress={() => { setStatus(2), setstage(3) }}>
                                    <View style={{ flexDirection: "column" }}></View>
                                    <Text style={{ fontWeight: "bold", fontSize: 12, alignSelf: "center", marginTop: 10 }}>{i18n.t('RegisterPage.Or')}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 12, alignSelf: "center" }}>{i18n.t('RegisterPage.Skip')}</Text>
                                </TouchableOpacity>
                                <View style={{
                                    width: "20%", height: 1, backgroundColor: "black", alignSelf: 'center', marginHorizontal: 20,
                                }} />

                            </View>


                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(1); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Back-Button')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setStatus(1), setstage(3); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Next-Button')}
                                </Text>
                            </TouchableOpacity>

                        </>
                        }
                        {/* End Stage 2*/}


                        {/* Stage 3 */}
                        {stage == 3 && <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />

                        </View>

                            <View style={{ backgroundColor: "#D9D9D9", width: "80%", height: "40%", alignSelf: "center", margin: 10, borderRadius: 5 }}>
                                <Text style={{ margin: 15, fontWeight: "bold", fontSize: 12 }}>{i18n.t('RegisterPage.Confirm-Credential')}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, flex: 1, paddingLeft: 20 }}>{i18n.t('RegisterPage.UserName.UserName')} </Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>{Username} </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, flex: 1, paddingLeft: 20 }}>{i18n.t('RegisterPage.Company-Name')}</Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>{Company} </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, flex: 1, paddingLeft: 20 }}>{i18n.t('RegisterPage.Email')}</Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ marginVertical: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>{Email} </Text>
                                </View>

                            </View>

                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(2); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Back-Button')}
                                </Text>
                            </TouchableOpacity><TouchableOpacity style={styles.ButtonLogin} onPress={() => { GETOTP(); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Verify')}
                                </Text>
                            </TouchableOpacity>

                        </>}

                        {/* End Stage 3 */}


                    </View>

                    {/* Footer */}
                    <View style={{ justifyContent: "flex-end" }}>
                        <View style={styles.blackline} />
                        <TouchableOpacity onPress={() => { navigation.navigate(Login as never) }}>
                            <Text style={styles.fonth2}>{i18n.t('RegisterPage.Have-Account')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Footer */}
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );



}

export default Register;