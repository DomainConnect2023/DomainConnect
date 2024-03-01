import React, { } from 'react';
import i18n from "../language/i18n";
import { useFocusEffect } from '@react-navigation/native';
import MainContainer from '../components/MainContainer';
import { View, Text, Platform, Button, Dimensions, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from '../objects/commonCSS';
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart } from 'react-native-gifted-charts';

const Admin = ({ navigation }: any) => {
    const [locale, setLocale] = React.useState(i18n.locale);
    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    const barData = [
        {
            value: 35, label: 'D', frontColor: '#177AD5',
            topLabelComponent: () => (
                <Text style={{ color: 'black' }}>35</Text>
            )
        },
        {
            value: 167, label: '1', frontColor: '#177AD5',
            topLabelComponent: () => (
                <Text style={{ color: 'black' }}>167</Text>
            )
        },
        {
            value: 46, label: '2', frontColor: '#177AD5',
            topLabelComponent: () => (
                <Text style={{ color: 'black' }}>46</Text>
            )
        },
        {
            value: 42, label: '3', frontColor: '#177AD5',
            topLabelComponent: () => (
                <Text style={{ color: 'black' }}>42</Text>
            )
        },
        {
            value: 20, label: '4', frontColor: '#177AD5',
            topLabelComponent: () => (
                <Text style={{ color: 'black' }}>20</Text>
            )
        },

    ];

    return (
        <MainContainer>
            <StatusBar animated={true} backgroundColor="#666699" barStyle={'dark-content'} />
            {Platform.OS === "android" ? (
                <View style={[css.mainView]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                        <Ionicons name="menu" size={26} color={"white"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('Admin.Admin')}</Text>
                    </View>
                </View>
            ) : (
                <View style={[css.mainView, { marginTop: 0 }]}>
                    <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => { navigation.openDrawer() }}>
                        <Ionicons name="menu" size={26} color={"white"} />
                    </TouchableOpacity>
                    <View style={css.HeaderView}>
                        <Text style={css.PageName}>{i18n.t('Admin.Admin')}</Text>
                    </View>
                </View>
            )}

            <KeyboardAvoidWrapper>
                <View style={styles.container}>
                    <View style={styles.HeaderContainer}>
                        <Text style={[css.textHeader, { fontWeight: 'bold' }]}> {i18n.t('Admin.Title')} (User Name)</Text>
                        <Text style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: 20 }}> {i18n.t('Admin.SubTitle')}</Text>
                    </View>


                    <Text style={{ paddingLeft: 20, paddingTop: 10, fontWeight: 'bold' }}>
                        {i18n.t('Admin.Title2')}
                    </Text>

                    <View style={styles.Chart}>
                        <BarChart
                            barWidth={Dimensions.get('window').width / 10}
                            noOfSections={5}
                            barBorderRadius={1}
                            frontColor="lightgray"
                            data={barData}
                            yAxisThickness={1}
                            xAxisThickness={1}
                        />
                    </View>

                    <View style={[css.row, { width: Dimensions.get('screen').width, }]}>
                        <TouchableOpacity style={[styles.button, { marginRight: 5 }]} onPress={() => navigation.navigate('Admin')}>
                            <Text style={[css.textHeader, styles.textButton]}>{i18n.t('Admin.Check-User-Button')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { marginLeft: 5 }]}>
                            <Text style={[css.textHeader, styles.textButton]}>{i18n.t('Admin.Modify-Admin-Button')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.ContentContainer]}>
                        <Text style={[css.textHeader, { paddingLeft: 10, width: Dimensions.get('screen').width }]}>
                            {i18n.t('Admin.Title3')}
                        </Text>
                        <View style={[styles.ToolContainer]}>
                            <TouchableOpacity>
                                <View style={[styles.item]}>
                                    <AntDesign name="table" size={60} color="black" />
                                    <Text style={[css.textHeader, { textAlign: 'center' }]}>{i18n.t('Admin.Data-Table')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.ContentContainer]}>
                        <Text style={[css.textHeader, { paddingLeft: 10, width: Dimensions.get('screen').width }]}>
                            {i18n.t('Admin.Title4')}
                        </Text>
                        <TouchableOpacity>
                            <View style={[styles.ToolContainer]}>
                                <TouchableOpacity>
                                    <View style={[styles.item]}>
                                        <FontAwesome5 name="file-invoice" size={60} color="black" />
                                        <Text style={[css.textHeader, { textAlign: 'center' }]}>{i18n.t('Admin.Check-Invoice')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={[styles.item]}>
                                        <MaterialCommunityIcons name="message-text-outline" size={60} color="black" />
                                        <Text style={[css.textHeader, { textAlign: 'center' }]}>{i18n.t('Admin.Send-Notification')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={[styles.item]}>
                                        <FontAwesome name="dollar" size={60} color="black" />
                                        <Text style={[css.textHeader, { textAlign: 'center' }]}>Example</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={[styles.item]}>
                                        <AntDesign name="questioncircleo" size={60} color="black" />
                                        <Text style={[css.textHeader, { textAlign: 'center' }]}>Example</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidWrapper>
        </MainContainer>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    HeaderContainer: {
        width: Dimensions.get('screen').width / 100 * 90,
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 10
    },
    button: {
        width: Dimensions.get('screen').width / 100 * 44,
        height: 50,
        backgroundColor: 'lightgrey',
        marginVertical: 30,
        borderRadius: 5,
    },
    textButton: {
        alignContent: 'center',
        textAlign: 'center',
        lineHeight: 50,
    },
    ContentContainer: {
        width: Dimensions.get('screen').width / 100 * 90,
        alignSelf: 'center',
        backgroundColor: 'lightgrey',
        height: 140,
        marginVertical: 5,
        borderRadius: 5,
    },
    ToolContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    item: {
        width: 80,
        height: 100,
        borderRadius: 5,
        alignItems: 'center'
    },
    Chart: {
        width: Dimensions.get('screen').width / 100 * 90,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        alignSelf: 'center',
    },
});

export default Admin;