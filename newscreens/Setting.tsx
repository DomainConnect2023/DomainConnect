import React, { useState } from 'react';
import { View, Text, Platform, Image, Dimensions, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import MainContainer from '../components/MainContainer';
import { useIsFocused } from '@react-navigation/native';
import { css } from '../objects/commonCSS';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import i18n from '../language/i18n';
import EditProfileScreen from './EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';

const STORAGE_KEY = '@app_language';
const SettingScreen = ({ navigation }: any) => {

    // Check if the application is currently in dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Check if the language menu is currently visible
    const [showLanguage, setShowLanguage] = useState(false);
    // Get the user's selected language
    const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.locale);
    // Check if the component is focused
    const isFocused = useIsFocused();
    // Call the loadLanguage function when the component is focused
    React.useEffect(() => {
        loadLanguage();
    }, [isFocused]);

    // Load the user's selected language
    const loadLanguage = async () => {
        try {
            // Get the user's selected language from AsyncStorage
            const language = await AsyncStorage.getItem(STORAGE_KEY);
            // If the language is found, set the i18n locale and save the language
            if (language) {
                i18n.locale = language;
                setSelectedLanguage(language);
            }
        } catch (error) {
            // Log any errors that occur while loading the language
            console.error('Failed to load language', error);
        }
    };

    // Save the user's selected language to AsyncStorage
    const saveLanguage = async (language: string) => {
        try {
            // Set the user's selected language in AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            // Log any errors that occur while saving the language
            console.error('Failed to save language', error);
        }
    };

    // Change the user's selected language
    const changeLanguage = async (language: string) => {
        // Set the i18n locale and save the language
        i18n.locale = language;
        setSelectedLanguage(language);
        saveLanguage(language);
        // Set the showLanguage state to false
        setShowLanguage(false);
        // Call the showLanguageUpdateAlert function
        showLanguageUpdateAlert();
    };

    // Alert the user when the language is updated
    const showLanguageUpdateAlert = () => {
        // Show an alert with the language update message
        Alert.alert(
            i18n.t('Language-Update'),
            i18n.t('Update'),
            [
                {
                    text: 'OK',
                    // Navigate to the settings screen
                    onPress: () => navigation.navigate('CustomDrawer', { screen: i18n.t('Left-Navigation.Setting') }),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    };

    // Toggle the dark mode
    const onToggleSwitch = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Toggle the language menu
    const onToggleLanguage = () => {
        setShowLanguage(!showLanguage);
    };

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#7174F8" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                        <Ionicons name="menu" size={26} color={"white"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('SettingPage.Setting')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: 0, backgroundColor: '#7174F8' }]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                        <Ionicons name="menu" size={26} color={"white"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('SettingPage.Setting')}</Text>
                    </View>
                </View>
            )}

            <KeyboardAvoidWrapper>
                <ScrollView>
                    <View style={styles.container}>
                        <ScrollView>
                            {/** User Profile Container */}
                            <View style={styles.UserInfo}>
                                <Image source={require('../assets/profile.png')} style={styles.UserImage} />
                                <View style={styles.User}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Mr. Anonymous</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#676767' }}>Domain Connect Sdn Bhd</Text>
                                </View>
                            </View>

                            {/** Edit Profile Container */}
                            <View style={styles.Edit}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <FontAwesome5 name='edit' size={30} color='#000000' />
                                    <Text style={{ marginLeft: 15, fontSize: 15, lineHeight: 30 }}>Edit Profile</Text>
                                </View>
                                <TouchableOpacity onPress={() => { navigation.navigate(EditProfileScreen as never) }}>
                                    <View style={styles.EditButton}>
                                        <Text style={{ fontSize: 16, color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', marginVertical: 5 }}>Edit</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/** Other Function Container */}
                            <View style={styles.OtherContainer}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6E6E6E' }}>{i18n.t('SettingPage.Preference')}</Text>

                                {/** Language Container */}
                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons name='earth' size={30} color='#000000' />
                                        <Text style={{ marginLeft: 15, fontSize: 15, lineHeight: 30 }}>{i18n.t('SettingPage.Language')}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => onToggleLanguage()}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "gray", lineHeight: 30, marginRight: 10 }}>{i18n.t('Language')}</Text>
                                            <AntDesign name={showLanguage ? 'down' : 'right'} size={30} color={"black"} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/** Language Selected */}
                                <Collapsible collapsed={!showLanguage}>
                                    <View style={styles.Language}>
                                        <TouchableOpacity onPress={() => {
                                            changeLanguage('en');
                                        }}>
                                            <View style={{ margin: 20, paddingLeft: 40 }}>
                                                <Text style={{ fontSize: 16 }}>English</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            changeLanguage('zh');
                                        }}>
                                            <View style={{ margin: 20, paddingLeft: 40 }}>
                                                <Text style={{ fontSize: 16 }}>中文</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            changeLanguage('my')
                                        }}>
                                            <View style={{ margin: 20, paddingLeft: 40 }}>
                                                <Text style={{ fontSize: 16 }}>Malay</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Collapsible>

                                {/** Dark Mode Container */}
                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Ionicons name='moon-outline' size={30} color='#000000' />
                                        <Text style={{ marginLeft: 15, fontSize: 15, lineHeight: 30 }}>{i18n.t('SettingPage.Dark-Mode')}</Text>
                                    </View>
                                    <View style={{ padding: 10, alignItems: "center" }}>
                                        <Switch style={styles.switch} value={isDarkMode} onValueChange={onToggleSwitch} />
                                    </View>
                                </View>

                                {/** Other Content Container */}
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6E6E6E', marginTop: 20 }}>Content</Text>

                                {/** Content Container */}
                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 name='question' size={30} color='#000000' />
                                        <Text style={{ marginLeft: 15, fontSize: 15, lineHeight: 30 }}>Example</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: 'row' }}>
                                            <AntDesign name={'right'} size={30} color={"black"} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </KeyboardAvoidWrapper>
        </MainContainer>
    )
}

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DEDEDE',
    },
    UserInfo: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        flexDirection: 'row',
        flex: 1
    },
    UserImage: {
        width: Dimensions.get('screen').width / 100 * 15,
        height: Dimensions.get('screen').width / 100 * 15
    },
    User: {
        marginLeft: 20,
        paddingVertical: 15,
    },
    Edit: {
        marginTop: Dimensions.get('screen').height / 100 * 4,
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'space-between',
        padding: 25,
        flexDirection: 'row'
    },
    EditButton: {
        width: Dimensions.get('screen').width / 100 * 20,
        height: Dimensions.get('screen').width / 100 * 8,
        backgroundColor: '#7174F8',
        borderRadius: 10,
    },
    OtherContainer: {
        marginTop: Dimensions.get('screen').height / 100 * 4,
        backgroundColor: '#FFFFFF',
        flex: 1,
        padding: 25,
    },
    Language: {
        marginTop: Dimensions.get('screen').height / 100 * 1,
        backgroundColor: '#F1F1F1',

    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },

})