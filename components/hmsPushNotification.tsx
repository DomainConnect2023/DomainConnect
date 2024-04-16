import React, { useEffect } from 'react';
import { HmsPushEvent, HmsPushInstanceId } from '@hmscore/react-native-hms-push';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export async function hmsToken(){
    let HMSToken = await AsyncStorage.getItem('fcmtoken');
    if (!HMSToken){
        try {
            const token = await HmsPushInstanceId.getToken('');
            if (token) {
                console.log(JSON.stringify(token));
                await AsyncStorage.setItem('fcmtoken', JSON.stringify(token));
            }
        } catch (error) {
            Alert.alert('Failed to get token:'+ error);
        }
    }
}
