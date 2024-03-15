import { Dimensions, StyleSheet } from "react-native";
import { DefaultTheme } from 'react-native-paper';

export const css = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mainView:{
        width: '100%',
        height: Dimensions.get("screen").height/100*8, 
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: "#666699",
    },
    HeaderView :{
        flex: 1, 
        padding: 10,
        gap: 4, 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        marginHorizontal: 4,
    },
    PageName: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    listThing: {
        width: 40,
        height: 40, 
        backgroundColor: '#666699', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 20,
        marginRight: 15,
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E8EA',
        padding: 10,
        borderRadius: 10,
        marginVertical: 2,
        marginHorizontal: 5,
        height: 80,
    },
    cardBody: {
        flexGrow: 1,
        paddingHorizontal: 12,
    },
    textHeader: { 
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    textDescription: {
        fontStyle: "italic",
        fontSize: 12,
        marginBottom: 6,
    },
    textTitle: {
        fontStyle: "italic",
        fontSize:18, 
        color:"black", 
        fontWeight:"bold"
    },
    button: {
        width: "85%",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    typeButton: {
        margin:5,
        width:"50%",
        height:30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
    },
    Title: {
        width: "30%",
        color:"#404040",
        padding:10,
        fontSize:14,
    },
    subTitle: {
        width: "60%",
        color:"#404040",
        padding:10,
        fontWeight:"bold",
        fontSize: 14,
    },
    animatedview: {
        width: Dimensions.get("window").width,
        backgroundcolor: "#0a5386",
        elevation: 2,
        position: "absolute",
        bottom: 0,
        padding: 10,
        justifycontent: "center",
        alignitems: "center",
        flexdirection: "row",
    },
    exittitletext: {
        textalign: "center",
        color: "#ffffff",
        marginright: 10,
    },
    exittext: {
        color: "#e5933a",
        paddinghorizontal: 10,
        paddingvertical: 3
    },
    row: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressableCSS: {
        width: '40%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
    },
    subContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 5,
        marginVertical: 5,
    },
    inputText: {
        width: "30%",
        justifyContent: 'center',
        alignItems: 'center',
        color:"#404040",
        fontSize:16
    },
    input: {
        width: '60%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        color: "#000",
    },
});


export const datepickerCSS = StyleSheet.create({
    cancelButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#075985"
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#FFF",
    },
    datePicker: {
        height: 120,
        marginTop: 10,
    },
    textInput: {
        color: "#000", 
        textAlign: "center", 
        fontSize:14, 
        fontWeight:"bold", 
        height:25,
        padding:0,
    }
});


export const dropdownCSS = StyleSheet.create({
    dropdown: {
        width: "100%",
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color:"red",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});


const whiteTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };


  export const styles = StyleSheet.create({
    //Welcome Page
    Test:{
        flex:1,
        backgroundColor:"green"
    },
    Button:{
        alignSelf:"center",
        backgroundColor:"#D9D9D9",
        marginBottom:10,
        borderRadius:5,
        width:"80%",
        height:"30%",
        alignItems:"center",
        justifyContent:"center",
    },
    WelcomeView:{
        flex:4,
        backgroundColor:"white"
    },
    fonth1:{
        fontWeight:"bold",
        fontSize:20,
        alignSelf:"center"
    },
    fonth2:{
        fontWeight:"bold",
        fontSize:16,
        alignSelf:"center"
    },
    fonth3:{
        alignSelf:"center",
        fontSize:12
    },
    // Login Page
    Header:{
        flex:2,
        alignSelf:"center",
        fontWeight:"bold",
        fontSize:16,

    },
    fontLogin:{
        marginLeft:10,
        fontWeight:"bold",
        fontSize:20,
        alignSelf:"flex-start"
    },
    fontsmall:{
        marginLeft:10,
        marginTop:10,
        fontWeight:"bold",
        fontSize:12,
        alignSelf:"flex-start"
    },
    blackline:{
        width:"90%",
        height:1,
        backgroundColor:"black",
        alignSelf: 'center',
        marginBottom:5,
    },
    InputRange:{
        width:"90%",
        alignSelf:"center",
        
    },
    Textinput:{
        alignSelf:"center",
        marginTop:20,
        width:"100%",
        borderRadius:5,
    },
    ButtonLogin:{
        alignSelf:"center",
        backgroundColor:"#D9D9D9",
        marginBottom:10,
        borderRadius:5,
        width:"80%",
        height:"10%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
    },
    //Verify Page
    NumberInput:{
        borderWidth: 1,
        borderRadius:10, 
        margin: 5,
         width:50,
         height:50,
         fontSize:20 
    },
})
  
  export default whiteTheme;