import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';;
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar';
import { setCredentials } from './keychainService';
import { URLAccess } from '../objects/URLAccess';
import React,{ useEffect } from 'react';



const SessionManagement = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, setInitialRouteName: React.Dispatch<React.SetStateAction<string>>) => {
    setLoading(true);

    // Check First Time Launcher this app
    const value = await AsyncStorage.getItem('firstLauncher');
    if (value == null) {
        setInitialRouteName("Welcome")
        AsyncStorage.setItem('firstLauncher', 'false')
        setLoading(false)
    } else {
        // Check User Name and Password exist 
        const credentials = await Keychain.getGenericPassword();

        // Have Username and Password
        if (credentials) {
            const { username, password } = credentials;

            // Storage Username and Password to AsyncStorage
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            const service = await AsyncStorage.getItem('service');
            
            // Auto Login when have user name and password
            RNFetchBlob.config({ trusty: true }).fetch("POST", URLAccess.Url + "api/Login", { 'Content-Type': 'application/json' },
                JSON.stringify({
                    "username": username,
                    "password": password,
                    "token": await AsyncStorage.getItem("fcmtoken"),
                    "service": await AsyncStorage.getItem('service')
                })).then(async (res) => {
                    if (await res.json().isSuccess == true) {

                        // Save the Username and Password to keychain
                        setCredentials(username, password);

                        // Set the Initial Route to Custom Drawer (Dashboard)
                        setInitialRouteName("CustomDrawer");
                        console.log('Login Successful:', username, password, service);

                        // Close Loading
                        setLoading(false);
                    } else {
                        Snackbar.show({
                            text: "Login Fail, Please Check Your credential and try again later.",
                            duration: Snackbar.LENGTH_LONG
                        });
                        // User Name and Password is not correct
                        setInitialRouteName("Login");
                        console.log("Error");
                        setLoading(false);
                    }
                }).catch(error => {
                    console.log(error.message)
                    setInitialRouteName("Login");
                    setLoading(false);
                });
        } else {
            // Go to Login page when no data into keychain
            setInitialRouteName("Login");
            setLoading(false);
        }
    }
};

export default SessionManagement;
