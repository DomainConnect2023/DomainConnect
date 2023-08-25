import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Register = () => {
  const navigation = useNavigation();
  
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const goBack = () => {
    navigation.goBack();
  }

  const registerAPI = async() => { 
    type UserData = {
        insert: string,
        username: string,
        password: string,
        [key: string]: string; // Add index signature for string keys with string values
    };

    const jsonData: UserData = {
        "insert": "1",
        "username":username as string, // test data: name= 'sysdev';
        "password":password as string, // test data: pswd= '9755'
    };

    // await axios.post(`https://mdotservice.com/testing/testfile.php`, jsonData,
    await axios.post(`http://192.168.0.169:8080/domain/mobile/userFunction.php`, jsonData,
    ).then(response => {
        console.log(response.data.status);
    }).catch(error => {
        console.log(error);
        // Alert.alert('Register Fail', 'Somethings wrong.', [
        //     {text: 'OK', onPress: () => console.log('')},
        // ]);
    });
  };

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
        <View style={styles.mainView}>
            <Ionicons name="arrow-back-circle-outline" size={34} color="gray" onPress={()=>goBack()} style={{marginBottom:5,marginLeft:20}} />
        </View>
        <View style={styles.container}>
            <Text>Register</Text>
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
            <Pressable style={styles.button} onPress={()=>{registerAPI()}}>
                <Text style={styles.text}>Register</Text>
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
    mainView:{
        width: '100%',
        height: 55, 
        flexDirection: 'row',
        alignItems: 'center', 
        // backgroundColor: "gray",
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

export default Register;
