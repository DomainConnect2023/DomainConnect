import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Platform, TouchableOpacity } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import { URLAccess } from '../objects/URLAccess';
import { ImagesAssets } from '../objects/ImagesAssets';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';
import LoginScreen from './LoginPage';

const Register = () => {
  const navigation = useNavigation();
  
  const [username, setUserName] = useState('');
  const [viewName, setViewName] = useState(false);

  const [password, setPassword] = useState('');
  const [retypePass, setRetypePass] = useState('');
  const [viewPass, setViewPass] = useState(false);
  const [viewRetypePass, setViewRetypePass] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [viewCompanyName, setViewCompanyName] = useState(false);

  const [verhicleNo, setVehicleNo] = useState('');

  const [email, setEmail] = useState('');
  const [viewEmail, setViewEmail] = useState(false);

  const [mobile, setMobile] = useState('');
  const [mobileCountry, setMobileCountry] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [viewMobile, setViewMobile] = useState(true);

  const [birthDate, setBirthDate] = useState("");
  const [keepDatetoDatabase, setKeepDatetoDatabase] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const tonggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

  const onChange = ({type}: any, selectedDate: any) => {
    if(type=="set"){
        const currentDate=selectedDate;
        setDate(currentDate);
        if(Platform.OS==="android"){
            tonggleDatePicker();
            setBirthDate(currentDate.toDateString());
            setKeepDatetoDatabase(currentDate.toISOString().split('T')[0]);
        }
    }else{
        tonggleDatePicker();
    }
  }

  const confirmIOSDate = () => {
    setBirthDate(date.toDateString());
    tonggleDatePicker();
  }

  const goBack = () => {
    navigation.goBack();
  }

  const registerAPI = async() => { 

    if(username!="" || password!="" || retypePass!="" || companyName!="" || email!="" ){
        if(password==retypePass){
            type UserData = {
                insert: string,
                username: string,
                password: string,
                companyName: string,
                vihecleNo: string,
                email: string,
                mobile: string,
                mobileValue: string,
                mobileCountry: string,
                birthDate: any,
                [key: string]: string;
            };
        
            const jsonData: UserData = {
                "insert": "1",
                "username":username as string,
                "password":password as string,
                "companyName":companyName as string,
                "vihecleNo":verhicleNo as string,
                "email":email as string,
                "mobile":formattedValue as string,
                "mobileValue":mobile as string,
                "mobileCountry":mobileCountry as string,
                "birthDate":keepDatetoDatabase as string,
            };
        
            await axios.post(URLAccess.userFunction, jsonData,).then(response => {
                if(response.data.status=="1"){
                    Snackbar.show({
                        text: 'Register Successfully',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    navigation.navigate(LoginScreen as never);
                }else if(response.data.status=="2"){
                    Snackbar.show({
                        text: 'User Name is duplicated. Please change the name and test again.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else{
                    Snackbar.show({
                        text: 'Register fail.',
                        duration: Snackbar.LENGTH_SHORT,
                        // action: {
                        //   text: 'UNDO',
                        //   textColor: 'green',
                        //   onPress: () => { /* Do something. */ },
                        // },
                    });
                }
            }).catch(error => {
                Snackbar.show({
                    text: error,
                    duration: Snackbar.LENGTH_SHORT,
                });
            });
        }else{
            Snackbar.show({
                text: "Password is wrong!",
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    }else{
        Snackbar.show({
            text: "User Name or Password can not be empty!",
            duration: Snackbar.LENGTH_SHORT,
        });
    }
  };

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
        <View style={styles.mainView}>
            <Ionicons name="arrow-back-circle-outline" size={34} color="gray" onPress={()=>goBack()} style={{marginBottom:5,marginLeft:20}} />
        </View>
        <View style={styles.container}>
            <Image
            source={ImagesAssets.registerImage}
            style={{width: 200, height: 200}}
            />
            <Text style={{color:"#404040",fontWeight:"bold",fontSize:20}}>Register</Text>

            {/* Company Name Detail */}
            <View style={styles.row}>
                <Text style={styles.inputText}>Company Name: <Text style={{color:"red"}}>*</Text></Text>
                {viewCompanyName==true && companyName=="" ? (
                <TextInput
                    style={[styles.input,{borderColor:"#FF0606"}]}
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[styles.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    onPressIn={()=>{setViewCompanyName(true)}}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>

            {(viewCompanyName==true && companyName=="") && (
                <View style={[styles.row,{marginBottom:10,}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                </View>
            )}
            {/* End Company Name */}

            {/* Vehicle Detail */}
            <View style={[styles.row,{marginBottom: 10,}]}>
                <Text style={styles.inputText}>Vehicle No: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Vehicle No"
                    value={verhicleNo}
                    onChangeText={setVehicleNo}
                    placeholderTextColor="#11182744"
                />
            </View>
            {/* End Vehicle */}

            {/* User Name Detail */}
            <View style={styles.row}>
                <Text style={styles.inputText}>User Name: <Text style={{color:"red"}}>*</Text></Text>
                {viewName==true && username=="" ? (
                <TextInput
                    style={[styles.input,{borderColor:"#FF0606"}]}
                    placeholder="User Name"
                    value={username}
                    onChangeText={setUserName}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[styles.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="User Name"
                    value={username}
                    onChangeText={setUserName}
                    onPressIn={()=>{setViewName(true)}}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>

            {(viewName==true && username=="") && (
                <View style={[styles.row,{marginBottom:10,}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                </View>
            )}
            {/* End User Name */}

            {/* Password & Retype Password Detail */}
            <View style={[styles.row,{marginBottom: 10,}]}>
                <Text style={styles.inputText}>Password: <Text style={{color:"red"}}>*</Text></Text>
                {(password=="" && viewPass==true) ? (
                <TextInput
                    style={[styles.input,{borderColor:"#FF0606"}]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[styles.input,{borderColor:"#11182744"}]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onPressIn={()=>{setViewPass(true)}}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>
            <View style={styles.row}>
                <Text style={styles.inputText}>Retype Password: <Text style={{color:"red"}}>*</Text></Text>
                {(password!=retypePass && viewRetypePass==true) ?(
                <TextInput
                    style={[styles.input,{borderColor:"#FF0606"}]}
                    placeholder="Retype Password"
                    secureTextEntry
                    value={retypePass}
                    onChangeText={setRetypePass}
                    placeholderTextColor="#11182744"
                /> 
                ): (
                <TextInput
                    style={[styles.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="Retype Password"
                    secureTextEntry
                    value={retypePass}
                    onChangeText={setRetypePass}
                    onPressIn={()=>{setViewRetypePass(true)}}
                    placeholderTextColor="#11182744"
                />    
                ) }
            </View>

            {(password=="" && viewPass==true) ? (
                <View style={[styles.row,{marginBottom:10,marginTop:-10}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password can't be empty!</Text>
                </View>
            ): (password!=retypePass && viewRetypePass==true) ? (
                <View style={[styles.row,{marginBottom:10,}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password is not match!</Text>
                </View>
            ): (<></>)}
            {/* End Password & Retype Password */}

            {/* Email Detail */}
            <View style={styles.row}>
                <Text style={styles.inputText}>Email: <Text style={{color:"red"}}>*</Text></Text>
                {viewName==true && username=="" ? (
                <TextInput
                    style={[styles.input,{borderColor:"#FF0606"}]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#11182744"
                />
                ) : (
                <TextInput
                    style={[styles.input,{borderColor:"#11182744",marginBottom:10}]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    onPressIn={()=>{setViewEmail(true)}}
                    placeholderTextColor="#11182744"
                />
                ) }
            </View>
            {(viewEmail==true && email=="") && (
                <View style={[styles.row,{marginBottom:10,}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                </View>
            )}
            {/* End Email Detail */}
            
            {/* Mobile Detail */}
            <View style={styles.row}>
                <Text style={styles.inputText}>Mobile: </Text>
                <View style={styles.input}>
                    <PhoneInput
                        containerStyle={{marginLeft:-10,width:"110%",backgroundColor:"transparent"}}
                        textContainerStyle={{marginLeft:-20,}}
                        ref={phoneInput}
                        defaultValue={mobile}
                        defaultCode="MY"
                        layout="second"
                        onChangeText={(text) => {
                            setMobile(text);
                        }}
                        onChangeFormattedText={(text) => {
                            const checkNumb = text.slice(0,5);
                            // console.log(checkNumb);
                            if(checkNumb=="+6011"){
                                // this is 011 number #13 length
                                if(text.length==13){
                                    setViewMobile(true);
                                }else{
                                    setViewMobile(false);
                                }
                            }else{
                                const checkNumb = text.slice(0,4);
                                if(checkNumb=="+601"){
                                    // this is malaysia normal number 
                                    if(text.length==12){
                                        setViewMobile(true);
                                    }else{
                                        setViewMobile(false);
                                    }
                                }else{
                                    // this is other country number
                                    setViewMobile(false);
                                }
                            }
                            setFormattedValue(text);
                        }}
                        onChangeCountry={(country) => {
                            setMobileCountry(country.cca2);
                            // console.log(country.cca2);
                            // console.log(country);
                        }}
                    />
                </View>
            </View>

            {(viewMobile==false ) ? (
                <View style={[styles.row,{marginBottom:10,}]}>
                    <Text style={styles.inputText}></Text>
                    <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Number is Invalid!</Text>
                </View>
            ) : (<View style={[styles.row,{marginBottom:10,}]}></View>)}
            {/* End Mobile */}

            {/* BirthDate Detail */}
            <View style={[styles.row,{marginBottom: 10,}]}>
                <Text style={styles.inputText}>BirthDate: </Text>
                {showPicker && <DateTimePicker 
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                    style={styles.datePicker}
                />}

                {showPicker && Platform.OS==="ios" &&(
                <View
                    style={{flexDirection:"row",justifyContent:"space-around"}}
                >
                    <TouchableOpacity 
                        style={[styles.cancelButton,{backgroundColor:"#11182711",paddingHorizontal:20}]}
                        onPress={tonggleDatePicker}
                    >
                        <Text style={[styles.cancelButtonText,{color:"#075985"}]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.cancelButton,{paddingHorizontal:20}]}
                        onPress={confirmIOSDate}
                    >
                        <Text style={[styles.cancelButtonText]}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                )}
                
                <Pressable
                    style={{width: '60%',
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',}}
                    onPress={tonggleDatePicker}
                >
                    <TextInput
                        style={{color: "#000",}}
                        placeholder="Select Birth Date"
                        value={birthDate}
                        onChangeText={setBirthDate}
                        placeholderTextColor="#11182744"
                        editable={false}
                        onPressIn={tonggleDatePicker}
                    />
                </Pressable>
            </View>
            {/* End BirthDate Detail */}
            
            <Pressable style={styles.button} onPress={()=>{registerAPI()}}>
                <Text style={styles.text}>Register</Text>
            </Pressable>
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
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputText: {
        width: "30%",
        justifyContent: 'center',
        alignItems: 'center',
        color:"#404040",
        fontSize:16
    },
    input: {
        width: '60%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        color: "#000",
    },
    mainView:{
        width: '100%',
        height: 55, 
        flexDirection: 'row',
        alignItems: 'center', 
        // backgroundColor: "gray",
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    datePicker: {
        height: 120,
        marginTop: -10,
    },
    cancelButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#075985"
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#FFF",
    }
});

export default Register;
