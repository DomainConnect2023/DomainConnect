import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, Dimensions, StatusBar } from 'react-native';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { URLAccess } from '../objects/URLAccess';
import { css } from '../objects/commonCSS';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HelperText, TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import PhoneInput from 'react-native-phone-number-input';
import Snackbar from 'react-native-snackbar';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../language/i18n';

const EditProfileScreen = () => {
    const navigation = useNavigation();

    const [username, setUserName] = useState('');

    const phoneInput = useRef<PhoneInput>(null);
    const [mobileValue, setMobileValue] = useState('');
    const [mobileCountry, setMobileCountry] = useState<string | null>('MY');
    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );
    useEffect(() => {
        (async () => {

        })();
    }, []);

    const testing = () => {
        Snackbar.show({
            text: 'Test!',
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#7174F8" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>
                        <Ionicons
                            name="arrow-back-circle-outline"
                            size={30}
                            color="#FFF"
                            onPress={() => [navigation.goBack()]} />
                        <Text style={{ color: "white", fontSize: 20, marginLeft: 20 }}>{i18n.t('ProfilePage.Edit-Profile')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: -20, backgroundColor: '#7174F8' }]}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>
                        <Ionicons
                            name="arrow-back-circle-outline"
                            size={30}
                            color="#FFF"
                            onPress={() => [navigation.goBack()]} />
                    </View>
                </View>
            )}

            <KeyboardAvoidWrapper>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.container}></View>
                    <View style={styles.UserImage}>
                        <Image source={require('../assets/profile.png')} style={styles.Image} />
                        <TouchableOpacity style={styles.Icon} onPress={testing}>
                            <FontAwesome5 name='edit' size={25} color='#000000' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.Title}>{i18n.t('ProfilePage.Title2')}</Text>
                        <View style={styles.TextInputContainer}>
                            <View style={styles.HalfInput}>
                                <TextInput
                                    mode="outlined"
                                    label={i18n.t('ProfilePage.UserName')}
                                />
                            </View>
                            <View style={styles.HalfInput}>
                                <TextInput
                                    mode="outlined"
                                    label={i18n.t('ProfilePage.Display-Name')}
                                />
                            </View>
                        </View>
                        <View style={styles.TextInputContainer}>
                            <TextInput
                                style={styles.WholeInput}
                                mode="outlined"
                                label={i18n.t('ProfilePage.Email')}
                            />
                        </View>
                        <View style={styles.TextInputContainer}>
                            <View style={styles.HalfInput}>
                                <TextInput
                                    mode="outlined"
                                    label={i18n.t('ProfilePage.Password')}
                                />
                            </View>
                            <View style={styles.HalfInput}>
                                <TextInput
                                    mode="outlined"
                                    label={i18n.t('ProfilePage.Confirm-Password')}
                                />
                            </View>
                        </View>

                        <Text style={styles.Title2}>{i18n.t('ProfilePage.Title3')}</Text>
                        <View style={styles.TextInputContainer}>
                            <TextInput
                                style={styles.WholeInput}
                                mode="outlined"
                                label={i18n.t('ProfilePage.Vehicle-Number')}
                            />
                        </View>
                        <View style={styles.TextInputContainer}>
                            <PhoneInput
                                textContainerStyle={{
                                    borderLeftWidth: 1,
                                    borderBottomWidth: 0.5,
                                    backgroundColor: "white"
                                }}
                                ref={phoneInput}
                                defaultValue={mobileValue}
                                defaultCode={mobileCountry as any}
                                layout="second"
                                containerStyle={[styles.WholeInput, { borderWidth: 1, borderRadius: 5, height: 50 }]}
                                codeTextStyle={{ fontSize: 16 }}
                                placeholder={i18n.t('ProfilePage.Phone-Number')}
                                textInputStyle={{ fontSize: 16, height: 50 }}
                                onChangeText={(text) => {
                                    console.log(text);
                                }}
                                onChangeFormattedText={(text) => {
                                    console.log(text);
                                }}
                                onChangeCountry={(country: any) => {
                                    console.log(country.cca2);
                                }}
                            />
                        </View>
                        <View style={styles.TextInputContainer}>
                            <TextInput
                                style={styles.WholeInput}
                                mode="outlined"
                                label={i18n.t('ProfilePage.Birth-Date')}
                            />
                        </View>
                        <Text style={{fontSize:14,textAlign:"center",marginTop:5,color:"red"}}>*Edit Page has not any Function in this version</Text>
                        <TouchableOpacity>
                            <View style={styles.SaveButton}>
                                <Text style={{ textAlign: 'center', lineHeight: Dimensions.get('screen').width / 100 * 15, fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>{i18n.t('ProfilePage.Save-Changes-Button')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#7174F8',
        height: Dimensions.get('screen').height / 100 * 10,
    },
    UserImage: {
        width: Dimensions.get('screen').width / 100 * 30,
        height: Dimensions.get('screen').width / 100 * 30,
        borderRadius: Dimensions.get('screen').width / 2,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: Dimensions.get('screen').width / 100 * 2.5,
        position: 'absolute',
        top: Dimensions.get('screen').width / 100 * 7,
        alignSelf: 'center',
        flex: 1
    },
    Image: {
        width: Dimensions.get('screen').width / 100 * 25,
        height: Dimensions.get('screen').width / 100 * 25,
        borderRadius: Dimensions.get('screen').width / 2,
    },
    Icon: {
        position: 'absolute',
        bottom: Dimensions.get('screen').width / 100,
        right: Dimensions.get('screen').width / 100,
        backgroundColor: '#FFFFFF',
    },
    Title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Dimensions.get('screen').width / 100 * 12,
        marginLeft: Dimensions.get('screen').width / 100 * 6,
    },
    Title2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Dimensions.get('screen').width / 100 * 4,
        marginLeft: Dimensions.get('screen').width / 100 * 6,
    },
    TextInputContainer: {
        width: Dimensions.get('screen').width / 100 * 90,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    HalfInput: {
        width: Dimensions.get('screen').width / 100 * 44,
    },
    WholeInput: {
        width: Dimensions.get('screen').width / 100 * 90,
    },
    SaveButton: {
        width: Dimensions.get('screen').width / 100 * 90,
        height: Dimensions.get('screen').width / 100 * 15,
        backgroundColor: '#A0D6B4',
        alignSelf: 'center',
        marginTop: Dimensions.get('screen').width / 100 * 5,
        borderRadius: 10
    }
})
