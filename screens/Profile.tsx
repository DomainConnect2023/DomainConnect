import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import Login from './LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateUserData } from '../objects/objects';
import { css, datepickerCSS } from '../objects/commonCSS';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [processGetData, setProcessGetData] = useState(false);
  const [canEditProfile, setCanEditProfile] = useState(false);
  
  const [userID, setUserID] = React.useState<string | null>("Unknown");
  const [username, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [verhicleNo, setVehicleNo] = useState('');
  const [email, setEmail] = useState('');

  const [mobile, setMobile] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [submitMobile, setSubmitMobile] = useState('');
  const [mobileCountry, setMobileCountry] = useState<string | null>('');
  const phoneInput = useRef<PhoneInput>(null);
  const [formattedValue, setFormattedValue] = useState("");

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
    console.log("date");
    setBirthDate(currentDate.toDateString().split('T')[0]);
    setKeepDatetoDatabase(currentDate.toISOString().split('T')[0]);
    // tonggleDatePicker();
    setDatePickerVisible(false);
    // await fetchDataApi(currentDate.toISOString().split('T')[0]);
}

  useEffect(()=> {
    (async()=> {
        setProcessGetData(true);
        AsyncStorage.getItem('userID').then( (value) => setUserID(value), );
        profileAPI();
    })();
  }, [])

  const logout = () => {
    navigation.navigate(Login as never);
  }

  const profileAPI = async() => { 
    var getuserID = await AsyncStorage.getItem('userID');
    
    axios.post(URLAccess.userFunction, {"readProfile":"1", "userID":getuserID})
    .then(response => {
      if(response.data.status=="1"){
        // console.log(response.data.data[0].mobile);
        setUserName(response.data.data[0].userName);
        setCompanyName(response.data.data[0].companyName);
        setVehicleNo(response.data.data[0].vehicleNo);
        setEmail(response.data.data[0].email);
        setMobile(response.data.data[0].mobile);
        setMobileValue(response.data.data[0].mobileValue);
        setMobileCountry(response.data.data[0].mobileCountry);
        setBirthDate(response.data.data[0].birthDate);
        setProcessGetData(false);
      }else{
        Snackbar.show({
          text: 'Something is wrong. Can not get the data from server!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    })
    .catch(error => {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_SHORT,
      });
    });
  };

  const editProfile =async (savetoDB: string) => {
    setCanEditProfile(!canEditProfile);

    // console.log(savetoDB);
    if(savetoDB=="yes"){
        var getuserID = await AsyncStorage.getItem('userID');
        //update database
        if(username!="" || companyName!="" ){

            if(formattedValue==""){
                setSubmitMobile("");
            }else{
                setSubmitMobile(mobile);
                setMobileValue(mobile);
                setMobile(formattedValue);
            }

            const jsonData: UpdateUserData = {
                "update": "1",
                "userID": getuserID as string,
                "username":username as string,
                "companyName":companyName as string,
                "vihecleNo":verhicleNo as string,
                "email":email as string,
                "mobile":formattedValue as string,
                "mobileValue":submitMobile as string ?? "",
                "mobileCountry":mobileCountry as string,
                "birthDate":keepDatetoDatabase as string,
            };

            await axios.post(URLAccess.userFunction, jsonData,).then(response => {
                if(response.data.status=="1"){
                    Snackbar.show({
                        text: 'Update Successfully',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else if(response.data.status=="2"){
                    Snackbar.show({
                        text: 'Update Fail.',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }else{
                    Snackbar.show({
                        text: 'Server Error.',
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
                text: "User and Company Name can't be empty!",
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    }
  }

  return (
    <MainContainer>
        <View style={[css.mainView,{marginTop:0}]}>
            <View style={css.HeaderView}>
                <Text style={css.PageName}>Personal Profile</Text>
            </View>
            <View style={{flexDirection:'row',}}>
                <View style={css.listThing}>
                    <Ionicons 
                    name="log-out-outline" 
                    size={30} 
                    color="#FFF" 
                    onPress={()=>[logout()]} />
                </View>
            </View>
        </View>

        {processGetData==true ? (
        <View style={[css.container]}>
            <ActivityIndicator size="large" />
        </View>
        ) : (
        <KeyboardAvoidWrapper>
        <View style={css.container}>
            <Image
            source={ImagesAssets.profileImage}
            style={{width: 200, height: 200, margin:10}}
            />
            <Text style={{color:"#404040",fontWeight:"bold",fontSize:20}}>Personal Profile</Text>

            {/* User Name Detail */}
            <View style={css.row}>
                <Text style={css.Title}>User Name:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={css.input}
                    placeholder="User Name"
                    value={username}
                    onChangeText={setUserName}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={css.subTitle}>{username}</Text>
                )}
            </View>
            {/* End User Name */}

            {/* Company Name */}
            <View style={css.row}>
                <Text style={css.Title}>Company Name:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={css.input}
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={css.subTitle}>{companyName}</Text>
                )}
            </View>
            {/* End Company Name */}

            {/* Vehicle Detail */}
            <View style={css.row}>
                <Text style={css.Title}>Vehicle No:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={css.input}
                    placeholder="Vehicle No"
                    value={verhicleNo}
                    onChangeText={setVehicleNo}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={css.subTitle}>{verhicleNo}</Text>
                )}
            </View>
            {/* End Vehicle */}

            {/* Email Detail */}
            <View style={css.row}>
                <Text style={css.Title}>Email: </Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={css.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={css.subTitle}>{email}</Text>
                )}
            </View>
            {/* End Email Detail */}
            
            {/* Mobile Detail */}
            <View style={css.row}>
                <Text style={css.Title}>Mobile: </Text>
                {canEditProfile==true ? (
                    <View style={[css.subTitle,{borderWidth: 1,borderColor: '#ccc'}]}>
                    <PhoneInput
                        containerStyle={{marginLeft:-10,width:"110%",backgroundColor:"transparent"}}
                        textContainerStyle={{marginLeft:-20,}}
                        ref={phoneInput}
                        defaultValue={mobileValue}
                        defaultCode={mobileCountry as any}
                        layout="second"
                        onChangeText={(text) => {
                            // console.log(text);
                            setMobile(text);
                        }}
                        onChangeFormattedText={(text) => {
                            console.log(text);
                            setFormattedValue(text);
                        }}
                        onChangeCountry={(country: any) => {
                            setMobileCountry(country.cca2);
                        }}
                    />
                    </View>
                ) : (
                    <Text style={css.subTitle}>{mobile}</Text>
                )}

            </View>
            {/* End Mobile */}

            {/* BirthDate Detail */}
            <View style={css.row}>
                <Text style={css.Title}>BirthDate: </Text>
                {Platform.OS === 'android' && showPicker && <DateTimePicker 
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
                )}
                 */}
                {canEditProfile==true ? (
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
                ) : (
                    <Text style={css.subTitle}>{birthDate}</Text>
                )}
            </View>

            {/* End BirthDate Detail */}

            {canEditProfile==true ? (
            <View style={css.row}>    
            <Pressable style={[styles.button,{backgroundColor: '#A0D6B4',margin:10}]} onPress={()=>{editProfile("yes")}}>
                <Text style={[styles.text,{backgroundColor: '#A0D6B4',}]}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button,{backgroundColor: 'gray',margin:10}]} onPress={()=>{editProfile("no")}}>
                <Text style={[styles.text,{backgroundColor: 'gray',}]}>Cancel</Text>
            </Pressable>
            </View>
             ) : (
            <Pressable style={styles.button} onPress={()=>{editProfile("no")}}>
                <Text style={styles.text}>Edit</Text>
            </Pressable> 
            )}
        </View>
        </KeyboardAvoidWrapper>
        )}

    </MainContainer>
  );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default ProfileScreen;
