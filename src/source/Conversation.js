import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Alert} from 'react-native';

import { styles, color, windowWidth, windowHeight } from "./styles/theme"
import MessageItem from '../components/MessageItem';

import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase'
import ActionSheet from 'react-native-actionsheet'
import Loading from 'react-native-whc-loading'
import ImagePicker from 'react-native-image-picker'
import RNThumbnail from 'react-native-thumbnail';

import { App } from "./Global"

export default class Conversation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectIndex: 0,
            isAddAttach: false,
            conversationList: [],
            message: '',
            msgViewHeight: 0,
            visibleHeight: 0
        }
    }

    componentWillMount () {
        // console.log("will mount")
        this.getConversation(App.receiverId)

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
    }
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    keyboardDidShow (e) {
        console.log(windowHeight)
        console.log(e.endCoordinates.height)

        this.setState({
          visibleHeight: e.endCoordinates.height
        })
      }
      
    keyboardDidHide (e) {
        this.setState({
          visibleHeight: 0,
        })
    } 

    actionBack = () => {
        this.props.navigation.navigate("ChatList")
    }

    actionPlus = (isAddAttach) => {
        this.setState({
            isAddAttach: !isAddAttach
        }, () => {
            if (this.state.isAddAttach) {
                this.setState({
                    msgViewHeight: 0
                })
            }
        })
    }

    getConversation = async (receiverId) => {

        console.log(receiverId)
        var obj = this

        const conversationRef = await firebase.database().ref().child(`conversation/records`);
        conversationRef.on('value', snapshot => {
            var  conversationDetail = snapshot.val();

            console.log(conversationDetail)

            var index  = 0;
            var records = [];
            snapshot.forEach((childSnapshot) => {
                console.log(childSnapshot)

                if ((conversationDetail[childSnapshot.key]['receiverId'] == receiverId && conversationDetail[childSnapshot.key]['senderId'] == App.userId) || (conversationDetail[childSnapshot.key]['receiverId'] == App.userId && conversationDetail[childSnapshot.key]['senderId'] == receiverId)) {
                    records[index] = {
                        senderId:conversationDetail[childSnapshot.key]['senderId'],
                        receiverId:conversationDetail[childSnapshot.key]['receiverId'],
                        message:conversationDetail[childSnapshot.key]['message'],
                        attach:conversationDetail[childSnapshot.key]['attach']
                    }
                    index++;

                    this.setState({ 
                        conversationList: records 
                    }) 
                    // obj.flatList.scrollToEnd({animated: true })
                }
            })
        })
    }

    actionSheet = (index) => {
        this.setState({
            selectIndex: index
        }, () => this.ActionSheet.show() )        
    }

    actionSelect = (index, receiverId) => {
        const {selectIndex} = this.state

        var options = null
        var fileType = ""
        if (selectIndex == 0) {

            fileType = "image"
            options = {
                title: 'Select Image',
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
            };
        } else {
            fileType = "video"
            options = {
                title: 'Video Picker', 
                mediaType: 'video', 
                storageOptions:{
                skipBackup:true,
                path:'images'
                }
            };
        }

        if (index == 0) {
            this.takeCamera(receiverId, options, fileType)
        } else {
            this.selectGallery(receiverId, options, fileType)
        }    
    }

    takeCamera(receiverId, options, fileType) {
        ImagePicker.launchCamera(options, (response) => {
            // Same code as in above section!

            this.uploadFile(response, receiverId, fileType)
        });
    }

    selectGallery(receiverId, options, fileType) {

        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!

            this.uploadFile(response, receiverId, fileType)
        });
    }

    uploadFile(response, receiverId, fileType) {

        var obj = this
        var loading = this.refs.loading 

        console.log(response)
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            this.errorMessage("ImagePicker Error", response.error)
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            const uploadUri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : `file://${response.path}`
            var time = new Date().getTime()

            loading.show()

            firebase.storage()
                .ref(`message/${fileType}_${time}`)
                .putFile(uploadUri)
                .then(uploadedFile => {
                    // console.log(uploadedFile.downloadURL);

                    if (fileType == "video") {

                        RNThumbnail.get(uploadUri).then((result) => {
                          const thumbnailUrl = Platform.OS === 'ios' ? result.path.replace('file://', '') : result.path 
    
                          firebase.storage()
                              .ref(`message/thumbnail_${time}`)
                              .putFile(thumbnailUrl)
                              .then(uploadedThumbFile => {
    
                                let conversation = {created_at: time, message: null, senderId: App.userId, receiverId: receiverId, attach: {"file" : uploadedFile.downloadURL, "thumbnail" : uploadedThumbFile.downloadURL, "isPhoto" : false}, unread: 1}
                                obj.addStorage(conversation)
                          })
                        })                                   
                      } else {
                        let conversation = {created_at: time, message: null, senderId: App.userId, receiverId: receiverId, attach: {"file" : uploadedFile.downloadURL,  "isPhoto" : true}, unread: 1}
    
                        obj.addStorage(conversation)
                      }
                })
                .catch(err => {
                    loading.close();
                    console.log("upload error : " +err);
                });
            }
    }

    addStorage(conversation) {

        console.log(conversation)
    
        var loading = this.refs.loading 
    
        const conversationRef = firebase.database().ref().child('conversation');
        conversationRef.child('counter').transaction(function(currentValue) {
          return (currentValue||100) + 1
        },function(err, committed, ss){
          if(err){
              console.log(err)
          }
          else if(committed){
              var conversation_id = ss.val()
    
              conversationRef.child('records').child(conversation_id).update({...conversation})
              .then(() => {
                  loading.close();
              })
          }
        })
      }

    actionSend = (receiverId) => {
        const { isAddAttach, message } = this.state

        if (!isAddAttach) {     //No attach
            if (message.length == 0) {
                this.errorMessage("Input Error", "Please enter message")
            } else {

                Keyboard.dismiss()
                
                var datetime = new Date().getTime()
                let conversation = {created_at: datetime, message: message, senderId: App.userId, receiverId: receiverId, unread: 1}
                const conversationRef = firebase.database().ref().child('conversation');

                this.setState({message: ''})

                conversationRef.child('counter').transaction(function(currentValue) {
                    return (currentValue||100) + 1
                },function(err, committed, ss){
                    if(err){
                        console.log(err)
                    }
                    else if(committed){
                        var conversation_id = ss.val()

                        conversationRef.child("records").child(conversation_id).update({...conversation})
                        .then(() => {
                            // console.log("Conversation", conversation)
                        })
                    }
                })
            }    
        }       
    }

    errorMessage(alert_type, msg) {
        Alert.alert(
            alert_type,
            msg,
            [
                {text: 'Yes', onPress: () => {}, style: 'cancel'}
            ],
            { cancelable: false }
        )
    }

    renderScrollItem(item, index) {

        // console.log(item)
        return (
            <MessageItem item={item} navigation={this.props.navigation} />
        );
    }

    render() {

        const { isAddAttach, conversationList, message, selectIndex, visibleHeight } = this.state

        const {navigation} = this.props
        let receiver_name = navigation.state.params.receiver_name
        let receiver_avatar = navigation.state.params.receiver_avatar
        let receiverId = navigation.state.params.receiverId
        console.log(visibleHeight)

        let keyboardBottom = (Platform.OS == 'ios') ? visibleHeight : 0

        console.log(windowHeight - 104 - Math.max(64, this.state.msgViewHeight) - keyboardBottom)

        let listPages = conversationList.map((item, index) => {
            return this.renderScrollItem(item, index);
        });

        return (
            <View style={styles.container}>
                {/* <NavigationEvents
                    onWillFocus={payload => this.getConversation(receiverId)}
                    // onDidFocus={payload => this.getConversation(receiverId)} 
                    /> */}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>

                    <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                    <View style={{flexDirection: 'row', width: windowWidth - 60, height: 50, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                        <TouchableOpacity onPress={() => this.actionBack()} style={styles.backBtnPadding}>
                            <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                        </TouchableOpacity>
                        <Image source={{ uri: receiver_avatar }} style={{width: 36, height: 36, marginLeft: 20, borderRadius: 18}} />
                        <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>{receiver_name}</Text>
                    </View>

                    {/* <ScrollView
                        ref={(ref) => this.flatListRef = ref}
                        horizontal={false}
                        showsVerticalScrollIndicator={true}
                        // contentContainerStyle={{ backgroundColor: 'yellow'}}
                        onContentSizeChange={(width, height) => this.flatListRef.scrollToEnd({ animated: false })} 
                        >

                        {listPages} */}

                    

                    <FlatList
                        ref={ (ref) => { this.flatList = ref; }}
                        // style={{flex: 1, marginBottom: Math.max(64, this.state.msgViewHeight)}}
                        style={{height: windowHeight - 120 - Math.max(64, this.state.msgViewHeight) - keyboardBottom}}
                        data={conversationList}
                        keyExtractor={item => item}
                        onContentSizeChange={()=> this.flatList.scrollToEnd({animated: true })}
                        renderItem={({item, index}) => 
                            <MessageItem item={item} navigation={this.props.navigation} />
                        }
                    />

                    <View style={{flexDirection: 'row', width: windowWidth, height: Math.max(64, this.state.msgViewHeight), alignItems: 'center', backgroundColor: color.bg_color}}>
                        {(!isAddAttach) ?
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.actionPlus(isAddAttach)} >
                                    <Image source={ require("../resource/ic_plus.png") } style={[{width: 14, height: 14, marginLeft: 30}]} />
                                </TouchableOpacity>

                                <TextInput style={{flex: 1, height: Math.max(40, this.state.msgViewHeight), fontSize: 13, color: color.white, marginLeft: 20, marginRight: 10, paddingTop: 10}}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "Type comments here ..."
                                    placeholderTextColor = {color.label_color}
                                    autoCapitalize = "none"
                                    multiline={true}
                                    onChangeText={(message) => this.setState({message: message})}
                                    onContentSizeChange={(event) => {
                                        this.setState({ msgViewHeight: event.nativeEvent.contentSize.height })
                                    }}
                                    value={message} />
                                
                                <TouchableOpacity onPress={() => this.actionSend(receiverId)} >
                                    <Image source={ require("../resource/send.png") } style={[{width: 22, height: 14, marginRight: 15}]} />
                                </TouchableOpacity>
                            </View> :
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.actionPlus(isAddAttach)} >
                                    <Image source={ require("../resource/close.png") } style={[{width: 14, height: 15, marginLeft: 30}]} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.actionSheet(0)} >
                                    <Image source={ require("../resource/pic.png") } style={[{width: 22, height: 22, marginLeft: 30}]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.actionSheet(1)} >
                                    <Image source={ require("../resource/video.png") } style={[{width: 22, height: 20, marginLeft: 30}]} />
                                </TouchableOpacity>
                            </View> }                  
                    </View>
                {/* </ScrollView> */}
                </KeyboardAvoidingView>

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={(selectIndex == 0) ? ['Take Photo', 'Photo Gallery', 'Cancel'] : ['Take Video', 'Video Gallery', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { 
                        if (index == 0 || index == 1) {
                            this.actionSelect(index, receiverId)     
                        }
                    }} />
                
                <Loading ref="loading"/>
            </View>
        )
    }
}

