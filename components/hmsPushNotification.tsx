import { HmsPushInstanceId } from '@hmscore/react-native-hms-push';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function hmsToken() {
    try {
        const token = await HmsPushInstanceId.getToken('');
        if (token) {
            const tokenJson = JSON.stringify(token);
            const tokenObject = JSON.parse(tokenJson);
            const tokenResult = tokenObject.result;
            console.log('Token:', tokenResult);
            await AsyncStorage.setItem('service', 'HMS');
            await AsyncStorage.setItem('fcmtoken', tokenResult);
        }
    } catch (error) {
        console.log('Failed to get token:' + error);
    }
}