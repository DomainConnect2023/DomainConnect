import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button, Dimensions, Platform, AppState, Alert, Image, Keyboard, KeyboardAvoidingView, StatusBar, } from 'react-native';
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

    // Refresh page When the user exits register and returns again 
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setstage(1)
        });
        return unsubscribe;
    }, [navigation])

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
    const usernameInputRef = useRef<any>(null);
    const emailInputRef = useRef<any>(null);
    const passwordInputRef = useRef<any>(null);
    const retypePasswordInputRef = useRef<any>(null);
    const [Duplicate, setDuplicate] = useState(false);
    const [UserDuplicateHelperText, setUserDuplicateHelperText] = useState(false);
    const [EmailDuplicateHelperText, setEmailDuplicateHelperText] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [phoneHelperText, setPhoneHelperText] = useState<any>(false);
    const [dateHelperText, setDateHelperText] = useState<any>(false);
    const [vehicleHelperText, setVehicleHelperText] = useState<any>(false);
    const [EmailFormatHelperText, setEmailFormatHelperText] = useState<any>(false);
    const [phoneFormatHelperText, setPhoneFormatHelperText] = useState<any>(false);

    const hasErrors = () => {
        // return Email.length == 0;
        return false;
    };

    const isInputEmpty = (input: String) => {
        return input.length == 0 ? true : false
    }

    // Check the email and username are duplicated
    const isInputDuplicated = async (Username: String, Email: String) => {
        try {
            const response = await RNFetchBlob.config({ trusty: true }).fetch('POST', URLAccess.Url + 'api/CheckCrediential', { "Content-Type": "application/json" },
                JSON.stringify({
                    "username": Username,
                    "Email": Email
                }));

            const responseData = await response.json();
            return { isUsernameAvailable: responseData.isSuccess1, isEmailAvailable: responseData.isSuccess2 };
        } catch (error) {
            console.error('Error checking input duplicate:', error);
            return { isEmailAvailable: false, isUsernameAvailable: false, message: 'Error checking input duplicate' };
        }
    }

    const isPasswordNotSame = () => {
        return Password.length > 0 && Retypepass.length > 0 && Password != Retypepass ? true : false
    }

    // Check Email Format
    const emailFormat = (email: string): boolean => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        return emailRegex.test(email);
    }

    // Check Phone Format
    const phoneFormat = (mobileValue: string): boolean => {
        const phoneRegex = /^[0-9]{7,12}$/;
        return phoneRegex.test(mobileValue)
    }

    // Handle Stage 1 Input
    const handleInputChanges = async (type: any, input: any) => {
        switch (type) {
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
                break;
            case 'password':
                setPassword(input);
                isInputEmpty(input) ? setPasswordHelperText(true) : setPasswordHelperText(false);
                break;
            case 'retypePassword':
                setRetypepass(input);
                isInputEmpty(input) ? setRetypeHelperText(true) : setRetypeHelperText(false);
                break;
        }
    }

    // Handle Stage 2 Input
    const handleInputChanges2 = async (type: any, input: any) => {
        switch (type) {
            case 'mobile':
                setMobileValue(input);
                isInputEmpty(input) ? setPhoneHelperText(true) : setPhoneHelperText(false);
                break;
            case 'vehicle':
                setVehicle(input);
                isInputEmpty(input) ? setVehicleHelperText(true) : setVehicleHelperText(false);
                break;
        }
    }

    // Continuously check whether the input data is valid
    useEffect(() => {
        // Check User Name Duplicated
        const checkUserAvailability = async () => {
            const { isUsernameAvailable } = await isInputDuplicated(Username, Email);
            if (!isUsernameAvailable) {
                setUserDuplicateHelperText(true);
            } else {
                setUserDuplicateHelperText(false);
            }
        };

        // Check Email Duplicated
        const checkEmailAvailable = async () => {
            const { isEmailAvailable } = await isInputDuplicated(Username, Email);
            if (!isEmailAvailable) {
                setEmailDuplicateHelperText(true);
            } else {
                setEmailDuplicateHelperText(false);
            }
        }

        // Check Email Format
        const checkEmailValid = async () => {
            if (!emailFormat(Email)) {
                setEmailFormatHelperText(true);
            } else {
                setEmailFormatHelperText(false);
            }
        }

        // Check Email Valid
        const checkEmail = async () => {
            if (Email !== '') {
                checkEmailValid();
            } else {
                setEmailFormatHelperText(false);
            }
        }

        // Check Password Match
        const checkPassword = async () => {
            if (Password.length !== 0 && Retypepass.length !== 0) {
                if (isPasswordNotSame()) {
                    setRetypeHelperText(true);
                } else {
                    setRetypeHelperText(false)
                }
            }
        }

        const checkPhoneFormat = async () => {
            if (!phoneFormat(mobileValue)) {
                setPhoneFormatHelperText(true);
            } else {
                setPhoneFormatHelperText(false);
            }
        }

        const checkPhone = async () => {
            if (mobileValue !== '') {
                checkPhoneFormat();
            } else {
                setPhoneFormatHelperText(false);
            }
        }

        checkUserAvailability();
        checkEmailAvailable();
        checkEmail();
        checkPassword();
        checkPhone();

    }, [Username, Email, Password, Retypepass, mobileValue, Vehicle]);

    const inputs = [
        { value: Company, setHelperText: setComapnyHelperText },
        { value: Username, setHelperText: setUserIDHelperText },
        { value: Email, setHelperText: setEmailHelperText },
        { value: Password, setHelperText: setPasswordHelperText },
        { value: Retypepass, setHelperText: setRetypeHelperText },
    ];

    // Confirm whether the stage 1 data is correct 
    const IsInputCorrect = async (stage: any) => {
        let allInputsCorrect = true;

        inputs.forEach(input => {
            if (isInputEmpty(input.value)) {
                input.setHelperText(true);
                allInputsCorrect = false;
                return;
            }
            else {
                input.setHelperText(false);
            }
        });

        // Check User Name Available
        const { isUsernameAvailable } = await isInputDuplicated(Username, Email);
        if (!isUsernameAvailable) {
            setUserDuplicateHelperText(true);
            allInputsCorrect = false;
            return;
        } else {
            setUserDuplicateHelperText(false);
        }

        // // Check Email Available
        const { isEmailAvailable } = await isInputDuplicated(Username, Email);
        if (!isEmailAvailable) {
            setEmailDuplicateHelperText(true);
            allInputsCorrect = false;
            return;
        } else {
            setEmailDuplicateHelperText(false);
        }

        // Check Email Format
        const checkEmailFormat = emailFormat(Email);
        if (Email) {
            if (checkEmailFormat == false) {
                setEmailFormatHelperText(true);
                allInputsCorrect = false;
                return;
            } else {
                setEmailFormatHelperText(false);
            }
        }

        // Check Password Match
        if (Password !== Retypepass) {
            setRetypeHelperText(true);
            allInputsCorrect = false;
            return;
        } else {
            setRetypeHelperText(false)
        }

        setToNextStage(allInputsCorrect);

        if (stage === 1 && allInputsCorrect) {
            setstage(2);
        }
    }

    const input2 = [
        { value: mobileValue, setHelperText: setPhoneHelperText },
        { value: birthDate, setHelperText: setDateHelperText },
        { value: Vehicle, setHelperText: setVehicleHelperText },
    ]
    // Confirm whether the stage 2 data is correct 
    const handleStage2Input = async (stage: any) => {
        setLoading(true);
        let allInputsCorrect = true;

        // Check Empty
        input2.forEach(input => {
            if (isInputEmpty(input.value)) {
                input.setHelperText(true);
                allInputsCorrect = false;
                setLoading(false);
                return;
            }
            else {
                input.setHelperText(false);
            }
        });

        // Check Phone Format
        const checkPhoneFormat = phoneFormat(mobileValue);
        if (mobileValue) {
            if (checkPhoneFormat == false) {
                setPhoneFormatHelperText(true);
                allInputsCorrect = false;
                setLoading(false);
                return;
            } else {
                setPhoneFormatHelperText(false);
            }
        }

        if (stage === 2 && allInputsCorrect) {
            setStatus(1)
            setstage(3)
            setLoading(false);
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
        setLoading(true);
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
            await AsyncStorage.setItem("MobileNo", "");
            await AsyncStorage.setItem("BirthDate", "");
            await AsyncStorage.setItem("Vehicle", "");
        }
        RNFetchBlob.config({ trusty: true }).fetch("POST", URLAccess.Url + "api/GetOTP", { "Content-Type": "application/json" },
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
                setLoading(false);
            }).catch(err => {
                Snackbar.show({
                    text: err.message,
                    duration: Snackbar.LENGTH_LONG
                })
                setLoading(false);
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    return (
        <MainContainer>
        <StatusBar animated={true} backgroundColor="white" barStyle={'dark-content'} />
            {loading ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <KeyboardAvoidWrapper>
                

                    {/* Header */}
                    <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ flex: 0.10, flexDirection: "row", paddingTop: 10 }}>
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
                                            returnKeyType="next"
                                            onSubmitEditing={() => usernameInputRef.current?.focus()}
                                            onChangeText={text => handleInputChanges('company', text)} />
                                        {companyHelperText && <HelperText type="error" style={{ height: 30 }}>
                                            Company is invalid!
                                        </HelperText>}
                                    </View>
                                    <View style={styles.InputRange}>
                                        <TextInput
                                            ref={usernameInputRef}
                                            returnKeyType="next"
                                            onSubmitEditing={() => emailInputRef.current?.focus()}
                                            style={companyHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                            mode="outlined"
                                            label={i18n.t('RegisterPage.UserName.UserName')}
                                            value={Username}
                                            onChangeText={text => handleInputChanges('userID', text)}
                                        />
                                        {UserDuplicateHelperText && <HelperText type="error">
                                            UserName is Duplicated
                                        </HelperText>}
                                        {UserIDHelperText && <HelperText type="error">
                                            UserName is invalid!
                                        </HelperText>}

                                    </View>
                                    <View style={styles.InputRange}>
                                        <TextInput
                                            ref={emailInputRef}
                                            returnKeyType="next"
                                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                                            style={UserIDHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                            mode="outlined"
                                            label={i18n.t('RegisterPage.Email')}
                                            value={Email}
                                            onChangeText={text => handleInputChanges('email', text)}
                                            keyboardType='email-address'
                                        />
                                        {EmailHelperText && <HelperText type="error">
                                            Email address is invalid!
                                        </HelperText>}
                                        {EmailDuplicateHelperText && <HelperText type="error">
                                            This Email has been registered!
                                        </HelperText>}
                                        {EmailFormatHelperText && <HelperText type="error">
                                            Please follow the email format!
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
                                            ref={passwordInputRef}
                                            returnKeyType="next"
                                            onSubmitEditing={() => retypePasswordInputRef.current?.focus()}
                                            style={EmailHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                            secureTextEntry={ishide}
                                            mode="outlined"
                                            label={i18n.t('RegisterPage.Password.Password')}
                                            value={Password}
                                            onChangeText={text => handleInputChanges('password', text)}
                                            right={
                                                <TextInput.Icon
                                                    icon={ishide ? "eye" : "eye-off"}
                                                    onPress={() => {
                                                        setishide(!ishide);
                                                    }}
                                                />
                                            }
                                        />
                                        {PasswordHelperText && <HelperText type="error" style={{ height: 30 }}>
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
                                            ref={retypePasswordInputRef}
                                            style={PasswordHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                            secureTextEntry={retypeishide}
                                            mode="outlined"
                                            label={i18n.t('RegisterPage.Password.Retype-Password')}
                                            value={Retypepass}
                                            onChangeText={text => handleInputChanges('retypePassword', text)}
                                            right={retypeishide ? <TextInput.Icon icon="eye" onPress={value => setretypeishide(false)} />
                                                : <TextInput.Icon icon="eye-off" onPress={value => setretypeishide(true)} />}
                                        />
                                        {RetypeHelperText && <HelperText type="error">Please check retype password</HelperText>}
                                    </View>
                                    <TouchableOpacity style={RetypeHelperText ? styles.ButtonLogin_NoMargin : styles.ButtonLogin} onPress={() => { IsInputCorrect(1) }}>
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
                                            handleInputChanges2('mobile', text)
                                        }}
                                        onChangeFormattedText={(text) => {
                                            setformatmobileValue(text)
                                        }}
                                    />
                                    {phoneHelperText && <HelperText type="error">Phone number is invalid</HelperText>}
                                    {phoneFormatHelperText && <HelperText type="error">Please follow the phone number format!</HelperText>}
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
                                        style={dateHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                        mode="outlined"
                                        value={birthDate}
                                        onChangeText={setBirthDate}
                                        label={"Birth Date"}
                                        editable={false}
                                        right={
                                            <TextInput.Icon icon={require('../assets/calendar_3.png')} onPress={tonggleDatePicker} />
                                        }
                                    />

                                    {dateHelperText && <HelperText type="error" >Birth Date is invalid</HelperText>}
                                </View>
                                <View style={styles.InputRange}>
                                    <TextInput
                                        style={vehicleHelperText ? styles.Textinput_NoMargin : styles.Textinput}
                                        mode="outlined"
                                        value={Vehicle}
                                        onChangeText={(text) => {
                                            setVehicle
                                            handleInputChanges2('vehicle', text)
                                        }}
                                        label={i18n.t('RegisterPage.Vehicle')} />
                                    {vehicleHelperText && <HelperText type="error" >Vehicle is invalid</HelperText>}
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
                                <TouchableOpacity style={[styles.ButtonLogin, { backgroundColor: '#1B2A62' }]} onPress={() => { handleStage2Input(2) }}>
                                    <Text style={[styles.fonth2, { color: 'white' }]}>
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
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ButtonLogin, { backgroundColor: '#1B2A62' }]} onPress={() => { GETOTP(); }}>
                                    <Text style={[styles.fonth2, { color: '#FFFFFF' }]}>
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
            )}
        </MainContainer >
    );
}

export default Register;