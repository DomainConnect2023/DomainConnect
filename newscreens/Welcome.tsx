import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import Login from '../screens/LoginPage';
import Register from './RegisterPage';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app_language';
const Welcome = () => {
    const navigation = useNavigation();
    const [locale, setLocale] = React.useState(i18n.locale);


    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const language = await AsyncStorage.getItem(STORAGE_KEY);
                if (language) {
                    i18n.locale = language;
                    setLocale(language);
                }
            } catch (error) {
                console.error('Failed to load language', error);
            }
        };

        loadLanguage();
    }, []);

    return (
        <MainContainer>

            <StatusBar animated={true} backgroundColor="#ffffff" barStyle={'dark-content'} />

            {/* Image and Welcome Word */}
            <View style={styles.WelcomeView}>
                <Image source={require('../assets/logo.png')} style={{ height: "40%", width: "80%", resizeMode: 'contain', alignSelf: "center" }} />
                <Text style={styles.fonth1}>
                    {i18n.t('WelcomePage.Title')}
                </Text>
                <Text style={styles.fonth3}>
                    {i18n.t('WelcomePage.SubTitle')}
                </Text>
            </View>
            {/* End Image and Welcome Word */}

            <View style={{ flex: 1 }}>
                {/* Button Navigation */}
                <TouchableOpacity style={styles.Button} onPress={() => { navigation.navigate(Login as never) }}>
                    <Text style={styles.fonth2}>
                        {i18n.t('WelcomePage.Sign-In')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Button} onPress={() => { navigation.navigate(Register as never) }}>
                    <Text style={styles.fonth2}>
                        {i18n.t('WelcomePage.Create-Account')}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* End Button Navigation */}
        </MainContainer>

    )
}

export default Welcome;