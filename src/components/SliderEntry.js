import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Platform, AsyncStorage, Alert} from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from '../source/styles/SliderEntry.style';
import { color } from "../source/styles/theme"

import { App } from "../source/Global"

import ImagePicker from 'react-native-image-picker'
import firebase from 'react-native-firebase'

import Loading from 'react-native-whc-loading'

// import AsyncStorage from '@react-native-community/async-storage';

// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob

export default class SliderEntry extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            name: '',
            email: '',
            password: '',
            focused: [false, false, false],
            avatar: '',
            isAttach: false
        }
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={ illustration }
              style={[styles.image, {alignSelf: 'center'}]}
            />
        );
    }

    chooseFile = () => {
        var options = {
          title: 'Select Image',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                const uploadUri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : `file://${response.path}`

                var time = new Date().getTime()

                firebase.storage()
                    .ref(`avatar/image_${time}`)
                    .putFile(uploadUri)
                    .then(uploadedFile => {
                        this.setState({
                            isAttach: true,
                            avatar: uploadedFile.downloadURL
                        })
                    })
                    .catch(err => {
                        console.log("upload error : " +err);
                    });
            }
        });
    };

    validate = (text) => {
        console.log(text);
        // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        // reg = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/;
        let reg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
        if(new RegExp(reg).test(text) === false) {
            console.log("Email is Not Correct");
            return false;
        } else {
            console.log("Email is Correct");
            return true;
        }
    }

    actionSign = (page_index) => {

        const { name, email, password, isAttach, avatar } = this.state

        if (name.length == 0 && page_index == 1) {
            this.errorMessage("Please enter name");
        } else if (email.length == 0) {
            this.errorMessage("Please enter email");
        } else if (!this.validate(email)) {
            this.errorMessage("Wrong email. Please enter email correctly.");
        } else if (password.length == 0) {
            this.errorMessage("Please enter password.");
        } else {

            let device_type = (Platform.OS == 'ios') ? "iphone" : "android"
            var datetime = new Date().getTime()

            let avatar_link = (isAttach) ? avatar : App.default_avatar

            if (page_index == 1) {
                firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((resp) => {
                    console.log("resp", resp)
                    let user = {name, uid: resp.user.uid, avatar: avatar_link, device_type: device_type, created_at: datetime}
                    const userRef = firebase.database().ref().child('users');

                    userRef.child(user.uid).update({...user})
                        .then(() => {
                            // loading.close();
                            console.log("User", user)

                            App.userId = user.uid

                            // try {
                                // AsyncStorage.setItem('@userId', JSON.stringify(user.id))
                                // AsyncStorage.setItem('@name', JSON.stringify(user.name))
                                // AsyncStorage.setItem('@avatar', JSON.stringify(user.avatar))
                            // } catch (e) {
                            //     // saving error
                            //     console.log(e)
                            // }

                            App.navigation.navigate('TabStack')
                        })
                        .catch((error) => {
                            // loading.close();
                            console.log("register_error:" + error)
                        });
                })
                .catch((error) => {
                    // loading.close();
                    console.log("register_error:" + error)
                });
            } else {
                firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((resp) => {
                    //Get the user object from the realtime database
                    let {user} = resp;
                    firebase.database().ref('users').child(user.uid).once('value')
                        .then((snapshot) => {
                            
                            // loading.close();

                            const exists = (snapshot.val() !== null);

                            //if the user exist in the DB, replace the user variable with the returned snapshot
                            if (exists) user = snapshot.val();
                            console.log("User", user)

                            App.userId = user.uid
                            // try {
                                // AsyncStorage.setItem('@userId', JSON.stringify(user.id))
                                // AsyncStorage.setItem('@name', JSON.stringify(user.name))
                                // AsyncStorage.setItem('@avatar', JSON.stringify(user.avatar))
                            // } catch (e) {
                            //     // saving error
                            //     console.log(e)
                            // }

                            App.navigation.navigate('TabStack')
                        })
                        .catch((error) => {
                            alert(error)
                            console.log("login_error:" + error)
                        });
                })
                .catch((error) => {
                    
                    var error_msg = (error.code == "auth/wrong-password") ? "The password is invalid or the user does not have a password" : "This email isn't existing."
                    Alert.alert(
                        'Login Error',
                        error_msg,
                        [
                            {text: 'Yes', onPress: () => {}, style: 'cancel'}
                        ],
                        { cancelable: false }
                    )
                    console.log("login_error:" + JSON.stringify(error))
                });
            }
        }
    }

    errorMessage(msg) {
        Alert.alert(
            'Input Error',
            msg,
            [
                {text: 'Yes', onPress: () => {}, style: 'cancel'}
            ],
            { cancelable: false }
        )
    }

    actionForgotPassword = () => {
        App.navigation.navigate('ForgotPassword')
    }

    setFocus = (index, status) => {

        var arrFocused = this.state.focused

        arrFocused[index] = status

        this.setState({
            focused: arrFocused
        })
    }

    render () {
        const { data: { title, subtitle }, even, index, page_index } = this.props;
        const { name, email, password, focused, isAttach, avatar } = this.state

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { title }
            </Text>
        ) : false;

        return (
            (index == 0) ?
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.slideInnerContainer]}
                    onPress={() => { alert(`You've clicked '${title}'`); }} >

                    <View style={styles.shadow} />
                    <View style={[styles.imageContainer, {justifyContent: 'center'}, even ? styles.imageContainerEven : {}]}>
                        { this.image }
                        <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                    </View>
                    <View style={[styles.textContainer, {alignItems: 'center'}, even ? styles.textContainerEven : {}]}>
                        { uppercaseTitle }
                        <Text
                        style={[styles.subtitle, {marginTop: 40}, even ? styles.subtitleEven : {}]}
                        numberOfLines={3}
                        >
                            { subtitle }
                        </Text>
                    </View>
                </TouchableOpacity> : (index == 1) ?
                <ScrollView>
                    <View style={[styles.slideInnerContainer]}>
                        <View style={[styles.imageContainer, {justifyContent: 'center', alignItems: 'center', borderRadius: 8}, even ? styles.imageContainerEven : {}]}>
                            <TouchableOpacity onPress={() => this.chooseFile()} >
                                {(isAttach) ?
                                    <Image source={{ uri: avatar }} style={{width: 90, height: 90, borderRadius: 45}}/> :
                                    <View style={{width: 90, height: 90, backgroundColor: 'grey', borderRadius: 45, opacity: .3}} /> }
                            </TouchableOpacity>
                            
                            {(page_index == 1) ?
                                <View style={[style.input_view, {marginTop: 30}, (focused[0]) ? {opacity: 1} : {opacity: .3}]}>
                                    <TextInput style={[style.text_input, {fontSize: 14, color: 'black'}]}
                                        underlineColorAndroid = "transparent"
                                        placeholder = "Username"
                                        placeholderTextColor = {color.main_color}
                                        autoCapitalize = "none"
                                        onChangeText = {(name) => this.setState({ name: name })}
                                        value={name}
                                        onFocus={() => this.setFocus(0, true) }
                                        onBlur={() => this.setFocus(0, false) } />
                                </View> : undefined }

                            <View style={[style.input_view, {marginTop: 20}, (focused[1]) ? {opacity: 1} : {opacity: .3}]}>
                                <TextInput style={[style.text_input, {fontSize: 14, color: 'black'}]}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "Email"
                                    placeholderTextColor = {color.main_color}
                                    autoCapitalize = "none"
                                    onChangeText = {(email) => this.setState({ email: email })}
                                    value={email}
                                    onFocus={() => this.setFocus(1, true) }
                                    onBlur={() => this.setFocus(1, false) } />
                            </View>

                            <View style={[style.input_view, {marginTop: 20}, (focused[2]) ? {opacity: 1} : {opacity: .3}]}>
                                <TextInput style={[style.text_input, {fontSize: 14, color: 'black'}]}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "Password"
                                    placeholderTextColor = {color.main_color}
                                    autoCapitalize = "none"
                                    secureTextEntry={true}
                                    onChangeText = {(password) => this.setState({ password: password })}
                                    value={password}
                                    onFocus={() => this.setFocus(2, true) }
                                    onBlur={() => this.setFocus(2, false) } />
                            </View>
                            
                            {(page_index == 0) ?
                                <TouchableOpacity onPress={() => this.actionForgotPassword()} >
                                    <Text style={{fontSize: 14, color: color.main_color, opacity: .5, marginTop: 20}}>Forgot your password?</Text>
                                </TouchableOpacity> : undefined }
                            
                            <TouchableOpacity onPress={() => this.actionSign(page_index)} >
                                <View style={{width: 200, height: 50, backgroundColor: color.main_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 40}}>
                                    <Text style={{fontSize: 16, color: color.white}}>{(page_index == 0) ? "Sign In" : "Sign Up"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <Loading ref="loading"/> */}
                </ScrollView> :
                <View style={[styles.slideInnerContainer]}>
                    <View style={[styles.imageContainer, {borderRadius: 8}, even ? styles.imageContainerEven : {}]}>
                        <View style={{height: 100, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#8392a7'}}>
                            <Text style={{fontSize: 16, color: color.white, fontWeight: 'bold', marginLeft: 30, marginTop: 68}}>Summer Party</Text>
                        </View>
                        
                        <View style={{marginLeft: 38, marginRight: 38}}>
                            <Text style={{fontSize: 12, color: color.label_color, marginTop: 25}}>Location</Text>
                            <Text style={{fontSize: 16, color: color.bg_color, marginTop: 3}}>A BAR 379 Johnson Ave Bronx, New York</Text>

                            <Text style={{fontSize: 12, color: color.label_color, marginTop: 12}}>Time</Text>
                            <Text style={{fontSize: 16, color: color.bg_color, marginTop: 3}}>03 Jun 2019 at 8 pm</Text>

                            <View style={{flexDirection: 'row', marginTop: 12}}>
                                <View>
                                    <Text style={{fontSize: 12, color: color.label_color}}>Qty</Text>
                                    <Text style={{fontSize: 14, color: color.bg_color, marginTop: 3}}>1</Text>
                                </View>

                                <View style={{marginLeft: 30}}>
                                    <Text style={{fontSize: 12, color: color.label_color}}>Price</Text>
                                    <Text style={{fontSize: 14, color: color.bg_color, marginTop: 3}}>$ 10</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={{marginTop: 10}}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

                        <Image source={ require("../resource/ticket.png") } style={{width: 245, height: 89, alignSelf: 'center', marginTop:7}} />
                    </View>
                </View>
        );
    }
}

const style = StyleSheet.create({
    input_view: {
        height: 45, 
        width: 200, 
        borderRadius: 22, 
        backgroundColor: 'white',
        borderColor: color.main_color,
        borderWidth: 1
    },
    text_input: {
        flex: 1, 
        height: 40,
        textAlign: 'center',
        color: color.main_color
    },
});
