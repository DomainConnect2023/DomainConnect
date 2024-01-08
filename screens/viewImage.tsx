import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MainContainer from '../components/MainContainer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { URLAccess } from '../objects/URLAccess';
import QRCode from 'react-native-qrcode-svg';
import { css } from '../objects/commonCSS';


const viewImage = () => {
    const navigation = useNavigation();
    const [qrText, setQRText] = React.useState<any>("");

    useEffect(()=> {
        (async()=> {
            var getQRText=await AsyncStorage.getItem('qrText');
            setQRText(getQRText);
        })();
    }, [])

    const goBack = async () => {
        await AsyncStorage.removeItem('qrText');
        navigation.goBack();
    }

    return (
    <MainContainer>
        <View style={css.mainView}>
            <View style={{flexDirection:'row',marginBottom:5,marginLeft:20}}>
                <View style={css.listThing}>
                    <Ionicons 
                    name="arrow-back-circle-outline" 
                    size={30} 
                    color="#FFF" 
                    onPress={()=>[navigation.goBack()]} />
                </View>
            </View>
        </View>
        <View style={styles.container}>
            {qrText=="" ? (
            <View style={[styles.container]}>
                <ActivityIndicator size="large" />
            </View>
            ) : (
            <TouchableOpacity onPress={() => goBack()}>
                {/* <Image style={{width:300,height:300,borderWidth: 1,}} source={{uri: imgPath}}/> */}
                <QRCode
                    size={300}
                    value={qrText}
                />
            </TouchableOpacity>
            )}
        </View>
    </MainContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default viewImage;
