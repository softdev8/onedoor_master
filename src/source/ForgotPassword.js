import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, TextInput} from 'react-native';

import { styles, color, windowWidth } from "./styles/theme"
import firebase from 'react-native-firebase'

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: ''
        }
    }

    actionForgotPassword = () => {

        var navigation = this.props.navigation
        const {email} = this.state

        if (email.length == 0) {
            alert("Please enter email.");
        } else {
            return new Promise((resolve, reject) => {
                firebase.auth().sendPasswordResetEmail(email)
                    .then(function (user) {
                        alert('Please check your email...')
                        resolve()
                        navigation.navigate("Sign")
                    }).catch(function (e) {
                        console.log(e)
                    })
            })
        }
    }

    render() {

        const {goBack} = this.props.navigation

        const {email} = this.state

        return (
            <View style={[styles.container]}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                    <TouchableOpacity onPress={() => goBack()} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>
                    <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>ForgotPassword</Text>
                </View>

                <View style={[style.input_view, {marginTop: 30}]}>
                    <TextInput style={[style.text_input, {fontSize: 14, color: 'black'}]}
                        underlineColorAndroid = "transparent"
                        placeholder = "Email"
                        placeholderTextColor = {color.main_color}
                        autoCapitalize = "none"
                        onChangeText = {(email) => this.setState({ email: email })}
                        value={email} />
                </View> 

                <TouchableOpacity onPress={() => this.actionForgotPassword()} style={{alignItems: 'center'}} >
                    <View style={{width: 200, height: 50, backgroundColor: color.white, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 35}}>
                        <Text style={{fontSize: 16, color: color.main_color}}>Send</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const style = StyleSheet.create({
    input_view: {
        height: 45, 
        width: windowWidth - 60, 
        borderRadius: 22, 
        backgroundColor: 'white',
        borderColor: color.main_color,
        borderWidth: 1,
        marginLeft: 30
    },
    text_input: {
        flex: 1, 
        height: 40,
        textAlign: 'center',
        color: color.main_color
    },
});

