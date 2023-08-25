import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import Login from './LoginPage';

const Dashboard = () => {
  const navigation = useNavigation();
  const [userID, setUserID] = React.useState<string | null>("Unknown");
  AsyncStorage.getItem('userID').then( (value) => setUserID(value), );


  const logout = () => {
    navigation.navigate(Login as never);
  }

  return (
    <MainContainer>
        <KeyboardAvoidWrapper>
        <View style={styles.mainView}>
            <Ionicons name="arrow-back-circle-outline" size={34} color="gray" onPress={()=>logout()} style={{marginBottom:5,marginLeft:20}} />
        </View>
        <View style={styles.container}>
            <Text>Dashboard</Text>
            <QRCode value={userID !== null ? userID : undefined} />
            <Text>User ID</Text>
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

export default Dashboard;
