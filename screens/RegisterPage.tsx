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
import { css, datepickerCSS } from '../objects/commonCSS';
import { InsertUserData } from '../objects/objects';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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


  //IOS Date Setup
  const [selectedIOSDate, setSelectedIOSDate] = useState(new Date());


  // IOS Date picker modal setup
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const hideIOSDatePicker = () => {
      setDatePickerVisible(false);
  };
  // END IOS Date Picker modal setup

  const tonggleDatePicker = () => {
    if (Platform.OS === 'android') {
        setShowPicker(!showPicker);
    }
    else if (Platform.OS === 'ios') {
        setDatePickerVisible(true);
    }
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

  const confirmIOSDate = async(date:any) => {
    
    const currentDate=date;
    console.log(currentDate)
    setBirthDate(currentDate.toDateString());
    setKeepDatetoDatabase(currentDate.toISOString().split('T')[0]);
    // tonggleDatePicker();
    setDatePickerVisible(false);
    // await fetchDataApi(currentDate.toISOString().split('T')[0]);
}

  const goBack = () => {
    navigation.goBack();
  }

  const registerAPI = async() => { 

    if(username!="" || password!="" || retypePass!="" || companyName!="" || email!="" ){
        if(password==retypePass){
                   
            const jsonData: InsertUserData = {
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
        {Platform.OS === "android"? (        
        <View style={[css.mainView,{marginTop:-20}]}>
            <View style={{flexDirection:'row',marginLeft:20}}>
                <View style={css.listThing}>
                    <Ionicons 
                    name="arrow-back-circle-outline" 
                    size={30} 
                    color="#FFF" 
                    onPress={()=>[navigation.goBack()]} />
                </View>
            </View>
            <View style={css.HeaderView}>
                <Text numberOfLines={2} style={css.PageName}>Register</Text>
            </View>
        </View>):(        
        <View style={[css.mainView,{marginTop:-0}]}>
            <View style={{flexDirection:'row',marginLeft:20}}>
                <View style={css.listThing}>
                    <Ionicons 
                    name="arrow-back-circle-outline" 
                    size={30} 
                    color="#FFF" 
                    onPress={()=>[navigation.goBack()]} />
                </View>
            </View>
            <View style={css.HeaderView}>
                <Text numberOfLines={2} style={css.PageName}>Register</Text>
            </View>
        </View>) }

        <KeyboardAvoidWrapper>
            <View style={css.container}>
                <Image
                source={ImagesAssets.registerImage}
                style={{width: 200, height: 200}}
                />
                <Text style={{color:"#404040",fontWeight:"bold",fontSize:20}}>Register</Text>

                {/* Company Name Detail */}
                <View style={css.row}>
                    <Text style={css.inputText}>Company Name: <Text style={{color:"red"}}>*</Text></Text>
                    {viewCompanyName==true && companyName=="" ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Company Name"
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                        placeholder="Company Name"
                        value={companyName}
                        onChangeText={setCompanyName}
                        onPressIn={()=>{setViewCompanyName(true)}}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>

                {(viewCompanyName==true && companyName=="") && (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Can't be empty!</Text>
                    </View>
                )}
                {/* End Company Name */}

                {/* Vehicle Detail */}
                <View style={[css.row,{marginBottom: 10,}]}>
                    <Text style={css.inputText}>Vehicle No: </Text>
                    <TextInput
                        style={css.input}
                        placeholder="Vehicle No"
                        value={verhicleNo}
                        onChangeText={setVehicleNo}
                        placeholderTextColor="#11182744"
                    />
                </View>
                {/* End Vehicle */}

                {/* User Name Detail */}
                <View style={css.row}>
                    <Text style={css.inputText}>User Name: <Text style={{color:"red"}}>*</Text></Text>
                    {viewName==true && username=="" ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="User Name"
                        value={username}
                        onChangeText={setUserName}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                        placeholder="User Name"
                        value={username}
                        onChangeText={setUserName}
                        onPressIn={()=>{setViewName(true)}}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>

                {(viewName==true && username=="") && (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                    </View>
                )}
                {/* End User Name */}

                {/* Password & Retype Password Detail */}
                <View style={[css.row,{marginBottom: 10,}]}>
                    <Text style={css.inputText}>Password: <Text style={{color:"red"}}>*</Text></Text>
                    {(password=="" && viewPass==true) ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744"}]}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onPressIn={()=>{setViewPass(true)}}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>
                <View style={css.row}>
                    <Text style={css.inputText}>Retype Password: <Text style={{color:"red"}}>*</Text></Text>
                    {(password!=retypePass && viewRetypePass==true) ?(
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Retype Password"
                        secureTextEntry
                        value={retypePass}
                        onChangeText={setRetypePass}
                        placeholderTextColor="#11182744"
                    /> 
                    ): (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
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
                    <View style={[css.row,{marginBottom:10,marginTop:-10}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password can't be empty!</Text>
                    </View>
                ): (password!=retypePass && viewRetypePass==true) ? (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={{color:"#FF0606",width:'60%',fontSize:10}}>Password is not match!</Text>
                    </View>
                ): (<></>)}
                {/* End Password & Retype Password */}

                {/* Email Detail */}
                <View style={css.row}>
                    <Text style={css.inputText}>Email: <Text style={{color:"red"}}>*</Text></Text>
                    {viewName==true && username=="" ? (
                    <TextInput
                        style={[css.input,{borderColor:"#FF0606"}]}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#11182744"
                    />
                    ) : (
                    <TextInput
                        style={[css.input,{borderColor:"#11182744",marginBottom:10}]}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        onPressIn={()=>{setViewEmail(true)}}
                        placeholderTextColor="#11182744"
                    />
                    ) }
                </View>
                {(viewEmail==true && email=="") && (
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Can't be empty!</Text>
                    </View>
                )}
                {/* End Email Detail */}
                
                {/* Mobile Detail */}
                <View style={css.row}>
                    <Text style={css.inputText}>Mobile: </Text>
                    <View style={css.input}>
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
                    <View style={[css.row,{marginBottom:10,}]}>
                        <Text style={css.inputText}></Text>
                        <Text style={[{color:"#FF0606",width:'60%',fontSize:10}]}>Number is Invalid!</Text>
                    </View>
                ) : (<View style={[css.row,{marginBottom:10,}]}></View>)}
                {/* End Mobile */}

                {/* BirthDate Detail */}
                <View style={[css.row,{marginBottom: 10,}]}>
                    <Text style={css.inputText}>BirthDate: </Text>
                    {showPicker && <DateTimePicker 
                        mode="date"
                        display="spinner"
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

                    {/* {showPicker && Platform.OS==="ios" &&(
                    <View
                        style={{flexDirection:"row",justifyContent:"space-around"}}
                    >
                        <TouchableOpacity 
                            style={[datepickerCSS.cancelButton,{backgroundColor:"#11182711",paddingHorizontal:20}]}
                            onPress={tonggleDatePicker}
                        >
                            <Text style={[datepickerCSS.cancelButtonText,{color:"#075985"}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[datepickerCSS.cancelButton,{paddingHorizontal:20}]}
                            onPress={confirmIOSDate}
                        >
                            <Text style={[datepickerCSS.cancelButtonText]}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                    )} */}
                    
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
                
                <Pressable style={css.button} onPress={()=>{registerAPI()}}>
                    <Text style={css.text}>Register</Text>
                </Pressable>
            </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default Register;
