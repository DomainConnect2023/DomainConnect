import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image, Pressable } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import { TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons'
import Register from './RegisterPage';
import DashboardScreen from '../screens/DashboardPage';
import TestDashboardScreen from './TestDashboard';
import TestSettingScreen from './TestSetting';
import TestTabNavigation from './TestNavigation';
import TabNavigation from '../screens/TabNavigation';

const Login = () => {
    const navigation = useNavigation();
    const [ishide, setishide] = useState(true);

    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                {/* Header */}
                <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                    <View style={{ flex: 0.3, flexDirection: "row" }}>
                        <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 15, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                        <Text style={styles.Header}>DOMAIN CONNECT</Text>
                    </View>

                    {/*End Header */}
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                            <Text style={styles.fontLogin}>Login</Text>
                            <Text style={styles.fontsmall}>Enter Your Credential to Log in</Text>
                        </View>
                        {/* Login Information */}
                        <View style={styles.InputRange}>
                            <TextInput
                                style={styles.Textinput}
                                mode="outlined"
                                label="username"
                            />
                        </View>
                        <View style={styles.InputRange}>
                            <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                onPress={() => {
                                    if (ishide == (true)) {
                                        setishide(false)
                                    } else {
                                        setishide(true)
                                    }
                                }}>
                                {ishide == true ?
                                    (
                                        <Octicons name="eye" size={40} style={{}} />
                                    ) : (
                                        <Octicons name="eye-closed" size={40} style={{}} />
                                    )}

                            </TouchableOpacity>
                            <TextInput
                                style={styles.Textinput}
                                secureTextEntry={ishide}
                                mode="outlined"
                                label="password"
                            />

                        </View>
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={{ textAlign: "right", width: "95%", fontWeight: "bold", fontSize: 14, }}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ButtonLogin} onPress={() => {navigation.navigate(TestTabNavigation as never) }}>
                            <Text style={styles.fonth2}>
                                Log In
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, }}>Or Login With</Text>
                            <View>
                                <TouchableOpacity onPress={() => {navigation.navigate(TestTabNavigation as never) }}>
                                    <MaterialIcons name="fingerprint" size={65} style={{ marginTop: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* End Login Information */}

                    {/* Footer */}
                    <View style={{ justifyContent: "flex-end" }}>
                        <View style={styles.blackline} />
                        <TouchableOpacity onPress={() => { navigation.navigate(Register as never) }}>
                            <Text style={styles.fonth2}>Don't have an Account? Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Footer */}
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );



}

export default Login;