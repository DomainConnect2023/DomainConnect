// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, ActivityIndicator ,Platform, Dimensions, Pressable} from 'react-native';
// import MainContainer from '../components/MainContainer';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons'; 
// import { URLAccess } from '../objects/URLAccess';
// import QRCode from 'react-native-qrcode-svg';
// import { css } from '../objects/commonCSS';
// import { ImagesAssets } from '../objects/ImagesAssets';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { TextInput } from 'react-native-paper';
// import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
// import PhoneInput from 'react-native-phone-number-input';
// import Snackbar from 'react-native-snackbar';
// import { useFocusEffect } from '@react-navigation/native';
// import i18n from '../language/i18n';

// const EditProfileScreen = () => {
//     const navigation = useNavigation();

//     const [username, setUserName] = useState('');

//     const phoneInput = useRef<PhoneInput>(null);
//     const [mobileValue, setMobileValue] = useState('');
//     const [mobileCountry, setMobileCountry] = useState<string | null>('');
//     const [locale, setLocale] = React.useState(i18n.locale);

//     useFocusEffect(
//         React.useCallback(() => {
//             setLocale(i18n.locale);
//         }, [])
//     );
//     useEffect(()=> {
//         (async()=> {
            
//         })();
//     }, []);

//     const testing = () => {
//         Snackbar.show({
//             text: 'Test!',
//             duration: Snackbar.LENGTH_SHORT,
//         });
//     }

//     return (
//     <MainContainer>
//         {Platform.OS === "android"? (
//         <View style={[css.mainView]}>
//             <View style={{flexDirection:'row',marginBottom:5,marginLeft:20}}>
//                 <View style={css.listThing}>
//                     <Ionicons 
//                     name="arrow-back-circle-outline" 
//                     size={30} 
//                     color="#FFF" 
//                     onPress={()=>[navigation.goBack()]} />
                    
//                 </View>
//                 <View style={{marginTop:10}}>
//                 <Text style={{color:"white"}}>{i18n.t('ProfilePage.Edit-Profile')}</Text>
//                 </View>
//             </View>
//         </View>
//         ):(         
//         <View style={[css.mainView,{marginTop: -20}]}>
//             <View style={{flexDirection:'row',marginBottom:5,marginLeft:20}}>
//                 <View style={css.listThing}>
//                     <Ionicons 
//                     name="arrow-back-circle-outline" 
//                     size={30} 
//                     color="#FFF" 
//                     onPress={()=>[navigation.goBack()]} />
//                 </View>
//             </View>
//         </View>
//         )}

//         <KeyboardAvoidWrapper>
//             <View style={{width: Dimensions.get("screen").width/100*85, alignSelf:"center", height:"auto"}}>
//                 <View style={css.container}>
//                     <View style={[css.row, {width: Dimensions.get("screen").width, padding:10,justifyContent: 'center',alignItems:"center"}]}>
//                         <View style={{ alignItems:"center", padding:10}}>
//                             <Image
//                                 source={ImagesAssets.logoImage}
//                                 style={{ width: 150, height: 150, backgroundColor: "#666699", borderRadius: 20 }}
//                             />
//                             <TouchableOpacity style={styles.editIcon} onPress={() => {testing()}}>
//                                 <AntDesign name={"edit" ?? ""} size={20} color={"white"} />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={{width: "100%", height:"auto"}}>
//                     <View style={css.subContainer}>
//                         <Text style={css.textTitle}>{i18n.t('ProfilePage.Title2')}:</Text>
//                     </View>

//                     <View style={css.row}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.UserName')}
//                         />
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Display-Name')}
//                         />
//                     </View>

//                     <View style={css.row}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.FullTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Email')}
//                         />
//                     </View>

//                     <View style={[css.row, {alignSelf:"flex-start"}]}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Password')}
//                         />
//                     </View>

//                     <View style={[css.row, {alignSelf:"flex-start"}]}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Confirm-Password')}
//                         />
//                     </View>

//                     <View style={css.subContainer}>
//                         <Text style={css.textTitle}>{i18n.t('ProfilePage.Title3')}:</Text>
//                     </View>

//                     <View style={[css.row, {alignSelf:"flex-start"}]}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Vehicle-Number')}
//                         />
//                     </View>

//                     <View style={[css.row, {alignSelf:"flex-start"}]}>
//                         <PhoneInput
//                             containerStyle={[styles.FullTextInput,{alignItems:"center", borderWidth:1, borderColor:"gray", borderRadius:5}]}
//                             textContainerStyle={{}}
//                             ref={phoneInput}
//                             defaultValue={mobileValue}
//                             defaultCode={mobileCountry as any}
//                             layout="second"
//                             onChangeText={(text) => {
//                                 console.log(text);
//                             }}
//                             onChangeFormattedText={(text) => {
//                                 console.log(text);
//                             }}
//                             onChangeCountry={(country: any) => {
//                                 console.log(country.cca2);
//                                 // setMobileCountry(country.cca2);
//                             }}
//                         />
//                     </View>

//                     <View style={[css.row, {alignSelf:"flex-start"}]}>
//                         <TextInput
//                             mode='outlined'
//                             style={styles.HalfTextInput}
//                             placeholder=""
//                             value={username}
//                             onChangeText={setUserName}
//                             label={i18n.t('ProfilePage.Birth-Date')}
//                         />
//                     </View>

//                     <View style={[css.row,{marginBottom:80, height:80}]}>
//                         <Pressable style={[css.button,{backgroundColor: '#A0D6B4',margin:10}]} onPress={()=>{testing()}}>
//                             <Text style={[{backgroundColor: '#A0D6B4', color:"white", fontWeight:"bold", fontSize:18}]}>{i18n.t('ProfilePage.Save-Changes-Button')}</Text>
//                         </Pressable>
//                     </View>
//                 </View>
//             </View>
//         </KeyboardAvoidWrapper>
//     </MainContainer>
//     );
// };

// export default EditProfileScreen;

// const styles = StyleSheet.create({
//     editIcon: {
//         position: 'absolute',
//         bottom: 20,
//         right: 20,
//         backgroundColor: 'gray',
//         padding: 5,
//         borderRadius: 50,
//     },
//     FullTextInput: {
//         width: '100%',
//         margin: 5,
//         borderColor: '#fff',
//         color: "#000",
//     },
//     HalfTextInput: {
//         width: '48%',
//         margin: 5,
//         borderColor: '#fff',
//         color: "#000",
//     },
// });
