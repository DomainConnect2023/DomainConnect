import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, Touchable, TouchableOpacity } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import Register from './RegisterPage';
import { ImagesAssets } from '../ImagesAssets';
import TabNavigation from './TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type UserData = {
    username: string;
    password: string;
    [key: string]: string; // Add index signature for string keys with string values
};

const Login = () => {
    const navigation = useNavigation();
        
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const loginAPI = async() => {
        const token = await AsyncStorage.getItem('fcmtoken');

        const formData = new FormData();
        const jsonData: UserData = {
            "read": "1",
            "username":username as string, // test data: name= 'sysdev';
            "password":password as string, // test data: pswd= '9755'
            "tokenValue":token as string,
        };

        for (const key in jsonData) {
            formData.append(key, jsonData[key]);
        }
    
        await axios.post(`http://192.168.0.169:8080/domain/mobile/userFunction.php`, 
        jsonData).then(async response => {
            if(response.data.status=="1"){
                AsyncStorage.setItem('userID', response.data.userID);
                navigation.navigate(TabNavigation as never);
            }else{
                Alert.alert('Login Failed', 'Your email or password is incorrect. Please try again.', [
                    {text: 'OK', onPress: () => console.log('')},
                ]);
            }
        }).catch(error => {
            console.log(error);
        });
    };

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
            <View style={styles.container}>
            <Image
            source={ImagesAssets.logoImage}
            style={{width: 300, height: 300}}
            />
            <Text>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={username}
                onChangeText={setUserName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={{width:"80%"}} onPress={() => {navigation.navigate(Register as never)}}>
                <View>
                    <Text style={styles.registerFont}>Register</Text>
                </View>
            </TouchableOpacity>
            <Pressable style={styles.button} onPress={()=>{loginAPI()}}>
                <Text style={styles.text}>Login</Text>
            </Pressable>
            </View>
        </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    registerFont: {
        color: "blue",
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default Login;
