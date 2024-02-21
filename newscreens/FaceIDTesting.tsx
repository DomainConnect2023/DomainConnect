import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BiometricAuthenticationScreen = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleFaceIDAuthentication = async () => {
        try {
            const rnBiometrics = new ReactNativeBiometrics();
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Authenticate with Face ID',
            });

            if (success) {
                // Authentication successful
                await AsyncStorage.setItem('biometricAuthenticated', 'true');
                Alert.alert('Success', 'Authentication successful');
            } else {
                // Authentication failed
                setErrorMessage(error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Failed to authenticate with Face ID:', error);
            setErrorMessage('Failed to authenticate with Face ID');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{errorMessage}</Text>
            <TouchableOpacity onPress={handleFaceIDAuthentication}>
                <Text>Authenticate with Face ID</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BiometricAuthenticationScreen;
