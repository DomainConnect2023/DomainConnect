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

            type UserData = {
                update: string,
                userID: string,
                username: string,
                companyName: string,
                vihecleNo: string,
                email: string,
                mobile: string,
                mobileValue: string,
                mobileCountry: string,
                birthDate: any,
                // [key: string]: string;
            };

            if(formattedValue==""){
                setSubmitMobile("");
            }else{
                setSubmitMobile(mobile);
                setMobileValue(mobile);
                setMobile(formattedValue);
            }

            const jsonData: UserData = {
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
        <View style={styles.mainView}>
          <View style={styles.HeaderView}>
            <Text style={styles.PageName}>Personal Profile</Text>
          </View>
          <View style={styles.logoutView}>
            <Ionicons name="log-out-outline" size={34} color="gray" onPress={()=>logout()} style={{marginBottom:5,marginLeft:5}} />
          </View>
        </View>

        {processGetData==true ? (
        <View style={[styles.container]}>
            <ActivityIndicator size="large" />
        </View>
        ) : (
        <KeyboardAvoidWrapper>
        <View style={styles.container}>
            <Image
            source={ImagesAssets.profileImage}
            style={{width: 200, height: 200, margin:10}}
            />
            <Text style={{color:"#404040",fontWeight:"bold",fontSize:20}}>Personal Profile</Text>

            {/* User Name Detail */}
            <View style={styles.row}>
                <Text style={styles.Title}>User Name:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    value={username}
                    onChangeText={setUserName}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={styles.subTitle}>{username}</Text>
                )}
            </View>
            {/* End User Name */}

            {/* Company Name */}
            <View style={styles.row}>
                <Text style={styles.Title}>Company Name:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={styles.input}
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={styles.subTitle}>{companyName}</Text>
                )}
            </View>
            {/* End Company Name */}

            {/* Vehicle Detail */}
            <View style={styles.row}>
                <Text style={styles.Title}>Vehicle No:</Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={styles.input}
                    placeholder="Vehicle No"
                    value={verhicleNo}
                    onChangeText={setVehicleNo}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={styles.subTitle}>{verhicleNo}</Text>
                )}
            </View>
            {/* End Vehicle */}

            {/* Email Detail */}
            <View style={styles.row}>
                <Text style={styles.Title}>Email: </Text>
                {canEditProfile==true ? (
                    <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#11182744"
                    />
                ) : (
                    <Text style={styles.subTitle}>{email}</Text>
                )}
            </View>
            {/* End Email Detail */}
            
            {/* Mobile Detail */}
            <View style={styles.row}>
                <Text style={styles.Title}>Mobile: </Text>
                {canEditProfile==true ? (
                    <View style={[styles.subTitle,{borderWidth: 1,borderColor: '#ccc'}]}>
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
                    <Text style={styles.subTitle}>{mobile}</Text>
                )}

            </View>
            {/* End Mobile */}

            {/* BirthDate Detail */}
            <View style={styles.row}>
                <Text style={styles.Title}>BirthDate: </Text>
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
                    <Text style={styles.subTitle}>{birthDate}</Text>
                )}
            </View>
            {/* End BirthDate Detail */}

            {canEditProfile==true ? (
            <View style={styles.row}>    
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
    mainView:{
        width: '100%',
        height: 80, 
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: "#666699",
    },
    HeaderView :{
        flex: 1, 
        padding: 10,
        gap: 4, 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        marginHorizontal: 4,
    },
    PageName: {
        color: "#FFFFFF",
        fontSize: 22,
    },
    logoutView: {
        width: 40,
        height: 40, 
        backgroundColor: '#FFFFFF', 
        justifyContent: 'flex-end', 
        alignItems: 'flex-end',
        borderRadius: 20,
        marginRight: 20
    },
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
        // borderWidth:1,
        // marginBottom:10,
    },
    Title: {
        width: "35%",
        color:"#404040",
        padding:10,
        fontSize:14,
    },
    subTitle: {
        width: "60%",
        color:"#404040",
        padding:10,
        fontWeight:"bold",
        fontSize: 14,
    },
    input : {
        width: "60%",
        color:"#404040",
        padding:10,
        borderColor:"#11182744",
        borderWidth: 1,
    },
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

export default ProfileScreen;
