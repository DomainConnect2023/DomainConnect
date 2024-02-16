import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import { TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';

const Login = () => {
    const navigation = useNavigation();

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
            {/* Header */}
            <View style={{ flex: 1, flexDirection: "row" }}>
            <Image source={require('../assets/logo.png')} style={{ flex: 2, height: "90%", width: "10%", resizeMode: 'contain', alignSelf: "center" }} />
                <Text style={styles.Header}>DOMAIN CONNECT</Text>
            </View>

            {/*End Header */}

            <View style={{ flex: 1, justifyContent: "flex-end", width: "90%", alignSelf: "center" }}>
                <Text style={styles.fontLogin}>Login</Text>
                <Text style={styles.fontsmall}>Enter Your Credential to Log in</Text>
            </View>
            {/* Login Information */}
            <View style={{ flex: 3 }}>
                <TextInput
                    style={styles.Textinput}
                    mode="outlined"
                    label="username"
                />

                <TextInput
                    style={styles.Textinput}
                    mode="outlined"
                    label="password"
                />
                <Text>Forgot Password?</Text>

                <TouchableOpacity style={styles.ButtonLogin} onPress={() => {  }}>
                    <Text style={styles.fonth2}>
                        Sign In
                    </Text>
                </TouchableOpacity>

            </View>
            {/* End Login Information */}

            {/* Footer */}
            <View style={{ flex: 0.6 }}>
                <View style={styles.blackline} />
                <TouchableOpacity>
                    <Text style={styles.fonth2}>Don't have an Account? Sign Up</Text>
                </TouchableOpacity>
            </View>
            {/* End Footer */}
            </KeyboardAvoidWrapper>
        </MainContainer>
    )



}

export default Login;