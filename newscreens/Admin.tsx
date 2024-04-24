import React, { useState, useEffect } from 'react';
import i18n from "../language/i18n";
import { useFocusEffect } from '@react-navigation/native';
import MainContainer from '../components/MainContainer';
import { View, Text, Platform, Image, Dimensions, StyleSheet, TouchableOpacity, StatusBar, Modal, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { css } from '../objects/commonCSS';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox, DataTable } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Admin = ({ navigation }: any) => {
    const [locale, setLocale] = React.useState(i18n.locale);
    useFocusEffect(
        React.useCallback(() => {
            setLocale(i18n.locale);
        }, [])
    );

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Read the commonly used services saved by the user in AsyncStorage
    useEffect(() => {
        setLoading(true);
        AsyncStorage.getItem('selectedServices')
            .then(selectedServices => {
                if (selectedServices) {
                    const parsedServices = JSON.parse(selectedServices);
                    setServicesData(parsedServices);
                    // Update initial services data with favorite values from parsed services
                    const updatedInitialServicesData = initialServicesData.map(service => {
                        const matchingService = parsedServices.find((item: { id: number }) => item.id === service.id);
                        return matchingService ? { ...service, favorite: matchingService.favorite } : service;
                    });
                    // Set favorite to whether all services are favorite
                    setFavorite(updatedInitialServicesData.every(service => service.favorite));
                    // Set services data to updated initial services data
                    setServicesData(updatedInitialServicesData);
                    setLoading(false);
                }
            });
        setLoading(false);
    }, []);

    const [favorite, setFavorite] = useState(false);

    // This array contains data for the services menu
    // Allow users to choose custom favorite service features
    const initialServicesData = [
        { id: 1, icon: require('../assets/DomainUIDesign/table.png'), text: 'Table', favorite: favorite },
        { id: 2, icon: require('../assets/DomainUIDesign/notice.png'), text: 'Notice', favorite: favorite },
        { id: 3, icon: require('../assets/DomainUIDesign/analytics(1).png'), text: 'Statistics', favorite: favorite },
        { id: 4, icon: require('../assets/DomainUIDesign/operational-system.png'), text: 'System', favorite: favorite },
        { id: 5, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
        { id: 6, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
        { id: 7, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
        { id: 8, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
        { id: 9, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
        { id: 10, icon: require('../assets/Example.png'), text: 'Example', favorite: favorite },
    ];

    const [servicesData, setServicesData] = useState(initialServicesData);

    // If the user has not saved any services, use the default services
    useEffect(() => {
        const hasEmptyFavorite = servicesData.some(service => !service.favorite);
        if (hasEmptyFavorite) {
            const updatedServicesData = servicesData.map(service =>
                service.id <= 4 ? { ...service, favorite: true } : service
            );
            setServicesData(updatedServicesData);
        }
    }, []);

    // Specified Page navigation
    const servicesPage = (id: number, navigation: any) => {
        switch (id) {
            case 1:
                console.log('Table');
                navigation.navigate('Table');
                break;
            case 2:
                console.log('Notice');
                navigation.navigate('Notice');
                break;
            default:
                console.log('Unknown Service');
        }
    };

    // Example usage
    const onPressService = (serviceId: number) => {
        servicesPage(serviceId, navigation);
    };

    // This function toggles the favorite status of a service with the given ID
    const toggleFavorite = (id: number) => {
        // Set the services data to a new array that is the same as the previous services data, but with the service with the given ID's favorite status toggled
        setServicesData(prevServicesData =>
            prevServicesData.map(service =>
                service.id === id ? { ...service, favorite: !service.favorite } : service
            )
        );
    };

    // Function to save the selected services to AsyncStorage
    const saveSelection = () => {
        // Filter the servicesData array to get only the favorite services
        const selectedServices = servicesData.filter(service => service.favorite);
        // If the selected services array has 4 elements
        if (selectedServices.length === 4) {
            // Try to save the selected services to AsyncStorage
            try {
                AsyncStorage.setItem('selectedServices', JSON.stringify(selectedServices));
                // Set the modal visibility to false
                setModalVisible(false);
            } catch (error) {
                // If there's an error, log it to the console
                console.error('Error saving selected services:', error);
            }
        } else {
            // If the selected services array doesn't have 4 elements, show a snackbar
            Snackbar.show({
                text: 'Please select 4 services',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
            })
        }
    };

    const favoriteServices = servicesData.filter(service => service.favorite);
    const otherServices = servicesData.filter(service => !service.favorite);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = React.useState(false);

    return (
        <MainContainer>
            {loading ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 50 }}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#7B7BA7', '#6C6FFF']} style={styles.linearGradient}>
                        <StatusBar animated={true} backgroundColor="#7174F8" barStyle={'dark-content'} />
                        {Platform.OS === "android" ? (
                            <View style={[css.mainView, { backgroundColor: 'transparent' }]}>
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

                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: Dimensions.get('screen').width / 20 }}>Welcome Back</Text>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: Dimensions.get('screen').width / 8 }}>Mr. Anonymous</Text>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginRight: Dimensions.get('screen').width / 20 }}>You are Admin</Text>
                        <View style={styles.Header}>
                            <TouchableOpacity>
                                <View style={styles.HeaderButton}></View>
                                <Image source={require('../assets/DomainUIDesign/analytics.png')} style={styles.Icon}></Image>
                                <Text style={styles.ButtonTitle}>Data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.HeaderButton}></View>
                                <Image source={require('../assets/DomainUIDesign/permissions.png')} style={styles.Icon}></Image>
                                <Text style={styles.ButtonTitle}>Permission</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.HeaderButton}></View>
                                <Image source={require('../assets/DomainUIDesign/settings.png')} style={styles.Icon}></Image>
                                <Text style={styles.ButtonTitle}>Setting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.HeaderButton}></View>
                                <Image source={require('../assets/DomainUIDesign/log-file.png')} style={styles.Icon}></Image>
                                <Text style={styles.ButtonTitle}>Log</Text>
                            </TouchableOpacity>
                        </View>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#DADADA', '#FFFFFF']} style={styles.ContentView}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    <View style={styles.Button}>
                                        <Image source={require('../assets/DomainUIDesign/team.png')} style={styles.ButtonIcon}></Image>
                                        <Text style={{ color: '#828282', fontSize: 14, fontWeight: 'bold' }}>Example</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.Button}>
                                        <Image source={require('../assets/DomainUIDesign/unauthorized-person.png')} style={styles.ButtonIcon}></Image>
                                        <Text style={{ color: '#828282', fontSize: 14, fontWeight: 'bold' }}>Example</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.ServicesContainer]}>
                                {/** Display four services button without expand */}
                                {favoriteServices.map(service => (
                                    <TouchableOpacity key={service.id} style={styles.ServicesButton} onPress={() => onPressService(service.id)}>
                                        <Image source={service.icon} style={styles.ServicesIcon} />
                                        <Text style={{ color: '#000000', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{service.text}</Text>
                                    </TouchableOpacity>
                                ))}

                                {/** Display another services button with expand */}
                                {expanded && (
                                    <>
                                        {otherServices.map(service => (
                                            <TouchableOpacity key={service.id} style={styles.ServicesButton} onPress={() => onPressService(service.id)}>
                                                <Image source={service.icon} style={styles.ServicesIcon} />
                                                <Text style={{ color: '#000000', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{service.text}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </>
                                )}

                                {expanded ? (
                                    <>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={toggleExpand}>
                                                <View style={styles.Close}>
                                                    <Image source={require('../assets/DomainUIDesign/close.png')} style={{ width: Dimensions.get('screen').width / 100 * 6, height: Dimensions.get('screen').width / 100 * 6 }}></Image>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginHorizontal: 10 }}>Close</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                                <View style={styles.Close}>
                                                    <Image source={require('../assets/DomainUIDesign/star.png')} style={{ width: Dimensions.get('screen').width / 100 * 6, height: Dimensions.get('screen').width / 100 * 6 }}></Image>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginHorizontal: 10 }}>Commonly</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={toggleExpand}>
                                        <View style={styles.ExpandMore}>
                                            <Image source={require('../assets/DomainUIDesign/other.png')} style={{ width: Dimensions.get('screen').width / 100 * 6, height: Dimensions.get('screen').width / 100 * 6 }}></Image>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginHorizontal: 10 }}>All Services</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        Alert.alert("Modal has been closed.");
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <ScrollView>
                                        <View style={styles.Table}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Select Commonly Used</Text>
                                            <DataTable>
                                                <DataTable.Header>
                                                    <DataTable.Title><Text style={{ fontSize: 14, fontWeight: 'bold' }}>Icon</Text></DataTable.Title>
                                                    <DataTable.Title><Text style={{ fontSize: 14, fontWeight: 'bold' }}>Service Name</Text></DataTable.Title>
                                                    <DataTable.Title><Text style={{ fontSize: 14, fontWeight: 'bold' }}>Commonly</Text></DataTable.Title>
                                                </DataTable.Header>
                                                {servicesData.map(service => (
                                                    <DataTable.Row key={service.id}>
                                                        <DataTable.Cell><Image source={service.icon} style={{ width: 40, height: 40 }} /></DataTable.Cell>
                                                        <DataTable.Cell><Text style={{ fontWeight: 'bold' }}>{service.text}</Text></DataTable.Cell>
                                                        <DataTable.Cell>
                                                            <Checkbox
                                                                status={service.favorite ? 'checked' : 'unchecked'}
                                                                onPress={() => toggleFavorite(service.id)}
                                                            />
                                                        </DataTable.Cell>
                                                    </DataTable.Row>
                                                ))}
                                            </DataTable>
                                            <TouchableOpacity onPress={saveSelection}>
                                                <View style={[styles.Close, { backgroundColor: '#FF7C7C' }]}>
                                                    <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>Save</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </Modal>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    <View style={[styles.BottomButton, { backgroundColor: '#FF5151' }]}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Example</Text>
                                        <Image source={require('../assets/Example.png')} style={styles.BottomIcon}></Image>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={[styles.BottomButton, { backgroundColor: '#5EFF9E' }]}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Example</Text>
                                        <Image source={require('../assets/Example.png')} style={styles.BottomIcon}></Image>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={[styles.BottomButton, { backgroundColor: '#70D4FF' }]}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Example</Text>
                                        <Image source={require('../assets/Example.png')} style={styles.BottomIcon}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    <View style={styles.DataContainer}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Example</Text>
                                        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>12345</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.DataContainer}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Example</Text>
                                        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>12345</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </LinearGradient>
                </ScrollView>
            )}
        </MainContainer >
    )
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    Header: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20
    },
    HeaderButton: {
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('screen').width / 100 * 16,
        height: Dimensions.get('screen').width / 100 * 16,
        marginHorizontal: Dimensions.get('screen').width / 100 * 2,
        borderRadius: 10,
        opacity: 0.3,
        marginTop: 5,
    },
    Icon: {
        width: Dimensions.get('screen').width / 100 * 10,
        height: Dimensions.get('screen').width / 100 * 10,
        position: 'absolute',
        alignSelf: 'center',
        top: Dimensions.get('screen').width / 100 * 4,
    },
    ButtonTitle: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    ContentView: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
        paddingTop: Dimensions.get('screen').height / 100 * 2,
    },
    Button: {
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('screen').width / 100 * 34,
        height: Dimensions.get('screen').width / 100 * 18,
        margin: Dimensions.get('screen').width / 100 * 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ButtonIcon: {
        width: Dimensions.get('screen').width / 100 * 8,
        height: Dimensions.get('screen').width / 100 * 8,
        marginHorizontal: Dimensions.get('screen').width / 100 * 3,
    },
    ServicesContainer: {
        width: Dimensions.get('screen').width / 100 * 78,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    ServicesButton: {
        width: Dimensions.get('screen').width / 100 * 15,
        margin: Dimensions.get('screen').width / 100 * 2.2,
        alignSelf: 'center',
    },
    ServicesIcon: {
        width: Dimensions.get('screen').width / 100 * 10,
        height: Dimensions.get('screen').width / 100 * 10,
        alignSelf: 'center'
    },
    ExpandMore: {
        width: Dimensions.get('screen').width / 100 * 65,
        height: Dimensions.get('screen').width / 100 * 12,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Dimensions.get('screen').width / 100 * 7,
        marginVertical: 20
    },
    Close: {
        width: Dimensions.get('screen').width / 100 * 35,
        height: Dimensions.get('screen').width / 100 * 12,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Dimensions.get('screen').width / 100 * 2,
        marginVertical: 20
    },
    BottomButton: {
        width: Dimensions.get('screen').width / 100 * 22,
        height: Dimensions.get('screen').width / 100 * 22,
        margin: Dimensions.get('screen').width / 100 * 3,
        borderRadius: 10,
        padding: 5
    },
    BottomIcon: {
        width: Dimensions.get('screen').width / 100 * 10,
        height: Dimensions.get('screen').width / 100 * 10,
        alignSelf: 'flex-end',
        marginTop: Dimensions.get('screen').width / 100 * 4,
    },
    DataContainer: {
        width: Dimensions.get('screen').width / 100 * 35,
        height: Dimensions.get('screen').width / 100 * 20,
        backgroundColor: '#6C6FFF',
        margin: Dimensions.get('screen').width / 100 * 4,
        borderRadius: 5,
        padding: 8,
        marginBottom: 30
    },
    Table: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        width: Dimensions.get('screen').width / 100 * 90,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: Dimensions.get('screen').height / 100 * 10,
    }
});

export default Admin;