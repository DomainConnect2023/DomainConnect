import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Platform, AppState, Alert, StatusBar, Image, Pressable } from 'react-native';
import MainContainer from '../components/MainContainer';
import { styles } from '../objects/commonCSS';
import { TextInput } from 'react-native-paper';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import Octicons from 'react-native-vector-icons/Octicons'
import Login from './LoginPage';
import { ProgressBar } from 'react-native-paper';
import i18n from '../language/i18n';
import { useFocusEffect } from '@react-navigation/native';

const Register = () => {
    const navigation = useNavigation();
    const [stage, setstage] = useState(1);
    const [ishide, setishide] = useState(true);
    const [retypeishide, setretypeishide] = useState(true);
    const [locale, setLocale] = React.useState(i18n.locale);

    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );
    return (
        <MainContainer>
            <KeyboardAvoidWrapper>
                {/* Header */}
                <View style={{ height: Dimensions.get("screen").height / 100 * 90 }}>
                    <View style={{ flex: 0.15, flexDirection: "row",paddingTop:10 }}>
                        <Image source={require('../assets/logo.png')} style={{ flex: 2, height: Dimensions.get("screen").height / 100 * 10, width: 120, resizeMode: 'contain', alignSelf: "center" }} />
                        <Text style={styles.Header}>DOMAIN CONNECT</Text>
                    </View>


                    {/*End Header */}

                    <View style={{ flex: 1, maxHeight: Dimensions.get("screen").height / 100 * 90 }}>
                        <View style={{ justifyContent: "flex-end", width: "90%", alignSelf: "center", marginTop: 30 }}>
                            <Text style={styles.fontLogin}>{i18n.t('RegisterPage.Title')}</Text>
                            {stage == 1 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle')}</Text>}
                            {stage == 2 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle-Page2')}</Text>}
                            {stage == 3 && <Text style={styles.fontsmall}>{i18n.t('RegisterPage.SubTitle-Page3')}</Text>}
                        </View>
                        {/* Stage 1 information */}

                        {stage == 1 &&
                            <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                                <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                                <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                                <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            </View>
                                <View style={styles.InputRange}>
                                    <TextInput
                                        style={styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Company-Name')} />
                                </View><View style={styles.InputRange}>
                                    <TextInput
                                        style={styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.UserName.UserName')} />
                                </View><View style={styles.InputRange}>
                                    <TextInput
                                        style={styles.Textinput}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Email')} />
                                </View>
                                <View style={styles.InputRange}>
                                    <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                        onPress={() => {
                                            if (ishide == (true)) {
                                                setishide(false);
                                            } else {
                                                setishide(true);
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
                                        label={i18n.t('RegisterPage.Password.Password')} />
                                </View>
                                <View style={styles.InputRange}>
                                    <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", margin: 30, zIndex: 10, paddingRight: 10 }}
                                        onPress={() => {
                                            if (retypeishide == (true)) {
                                                setretypeishide(false);
                                            } else {
                                                setretypeishide(true);
                                            }
                                        }}>
                                        {retypeishide == true ?
                                            (
                                                <Octicons name="eye" size={40} style={{}} />
                                            ) : (
                                                <Octicons name="eye-closed" size={40} style={{}} />
                                            )}

                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.Textinput}
                                        secureTextEntry={retypeishide}
                                        mode="outlined"
                                        label={i18n.t('RegisterPage.Password.Retype-Password')} />
                                </View>
                                <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(2); }}>
                                    <Text style={styles.fonth2}>
                                        {i18n.t('RegisterPage.Next-Button')}
                                    </Text>
                                </TouchableOpacity></>}
                        {/*End Stage 1*/}

                        {/* Stage 2*/}

                        {stage == 2 && <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                        </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    label={i18n.t('RegisterPage.Mobile.Mobile-Number')} />
                            </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    label={i18n.t('RegisterPage.BirthDate.BirthDate')} />
                            </View>
                            <View style={styles.InputRange}>
                                <TextInput
                                    style={styles.Textinput}
                                    mode="outlined"
                                    label={i18n.t('RegisterPage.Vehicle')} />
                            </View>
                            <View style={{ justifyContent: "center", flexDirection: "row" }}>
                                <View style={{ width: "20%", height: 1, backgroundColor: "black", alignSelf: 'center', marginHorizontal: 20 }} />
                                <TouchableOpacity onPress={() => { setstage(3) }}>
                                    <View style={{ flexDirection: "column" }}></View>
                                    <Text style={{ fontWeight: "bold", fontSize: 12, alignSelf: "center", marginTop: 10 }}>{i18n.t('RegisterPage.Or')}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 12, alignSelf: "center" }}>{i18n.t('RegisterPage.Skip')}</Text>
                                </TouchableOpacity>
                                <View style={{
                                    width: "20%", height: 1, backgroundColor: "black", alignSelf: 'center', marginHorizontal: 20,
                                }} />

                            </View>


                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(1); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Back-Button')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(3); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Next-Button')}
                                </Text>
                            </TouchableOpacity>

                        </>
                        }
                        {/* End Stage 2*/}


                        {/* Stage 3 */}
                        {stage == 3 && <><View style={{ marginTop: 10, paddingTop: 10, width: "50%", alignSelf: "center", flexDirection: "row", justifyContent: "center" }}>
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={0} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />
                            <ProgressBar progress={1} color={"#1B2A62"} style={{ width: 50, height: 10, marginHorizontal: 10, borderRadius: 10 }} />

                        </View>

                            <View style={{ backgroundColor: "#D9D9D9", width: "80%", height: "40%", alignSelf: "center", margin: 10, borderRadius: 5 }}>
                                <Text style={{ margin: 15, fontWeight: "bold", fontSize: 12 }}>{i18n.t('RegisterPage.Confirm-Credential')}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, flex: 1 }}>{i18n.t('RegisterPage.UserName.UserName')} </Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>xxxxx </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, flex: 1 }}>{i18n.t('RegisterPage.Company-Name')}</Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>xxxxx </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, flex: 1 }}>{i18n.t('RegisterPage.Email')}</Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12 }}>:</Text>
                                    <Text style={{ margin: 20, fontWeight: "bold", fontSize: 12, paddingLeft: 10, flex: 1 }}>xxxxx </Text>
                                </View>

                            </View>

                            <TouchableOpacity style={styles.ButtonLogin} onPress={() => { setstage(2); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Back-Button')}
                                </Text>
                            </TouchableOpacity><TouchableOpacity style={styles.ButtonLogin} onPress={() => { navigation.navigate(Login as never); }}>
                                <Text style={styles.fonth2}>
                                    {i18n.t('RegisterPage.Title')}
                                </Text>
                            </TouchableOpacity>

                        </>}

                        {/* End Stage 3 */}


                    </View>

                    {/* Footer */}
                    <View style={{ justifyContent: "flex-end" }}>
                        <View style={styles.blackline} />
                        <TouchableOpacity onPress={() => { navigation.navigate(Login as never) }}>
                            <Text style={styles.fonth2}>{i18n.t('RegisterPage.Have-Account')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Footer */}
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    );



}

export default Register;