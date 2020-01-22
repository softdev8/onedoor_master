import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput, ScrollView, PermissionsAndroid, Alert} from 'react-native';

import { styles, color, windowWidth, windowHeight } from "./styles/theme"

import ActionSheet from 'react-native-actionsheet'
import firebase from 'react-native-firebase'
import {NavigationEvents} from 'react-navigation'
import Loading from 'react-native-whc-loading'

import { App } from "./Global"
import { Thumbnail } from 'react-native-thumbnail-video'
import VideoThumbnail from 'react-video-thumbnail'

import RNThumbnail from 'react-native-thumbnail';
import ImagePicker from 'react-native-image-picker'

export default class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectIndex: 0,
            attachItems: [],
            comment: ''
        }
    }

    async componentDidMount() {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                'title': 'Access Storage',
                'message': 'Access Storage for the pictures'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("You can use read from the storage")
            } else {
              console.log("Storage permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    actionBack = () => {
        this.props.navigation.navigate("Feed")
    }

    renderScrollItem(item, index) {

        console.log(item)
        return (
            <View style={{marginRight: 10, backgroundColor: '#949fab'}}>
                <Image source={{ uri: item.link }} style={{width: 200, height: 100, opacity: .5}} />
                {(!item.isPhoto) ? <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30, position: 'absolute', top: 35, left: 85}} /> : undefined }
            </View>
        );
    }

    actionSheet = (index) => {
        this.setState({
            selectIndex: index
        }, () => this.ActionSheet.show() )        
    }

    actionSelect = async (index) => {

        const {selectIndex} = this.state

        if (index == 1) {
            this.props.navigation.navigate("Gallery", {index: index, page: 'feed'})    
        } else {
            var options = null
            if (selectIndex == 0) {
                options = {
                    title: 'Select Image',
                    storageOptions: {
                      skipBackup: true,
                      path: 'images',
                    },
                };
            } else {
                options = {
                    title: 'Video Picker', 
                    mediaType: 'video', 
                    storageOptions:{
                        skipBackup:true,
                        path:'images'
                    }
                };
            }

            var items = []

            ImagePicker.launchCamera(options, (response) => {
                // Same code as in above section!
    
                console.log(response)
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                    alert('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const uploadUri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : `file://${response.path}`

                    if (selectIndex == 0) {
                        items.push({"link": uploadUri, "isPhoto": true})

                        this.setState({
                            attachItems: [...this.state.attachItems, ...items]
                        })
                    } else {
        
                        RNThumbnail.get(uploadUri).then((result) => {
                            items.push({"link": uploadUri, "thumbnail": result.path, "isPhoto": false})

                            this.setState({
                                attachItems: [...this.state.attachItems, ...items]
                            })
                        })                
                    }
                }
            });
        }
    }
    
    actionPost = async () => {
        const {comment, attachItems} = this.state

        var loading = this.refs.loading 

        if (comment.length == 0) {
            Alert.alert(
                'Input Error',
                'Please enter description',
                [
                    {text: 'Yes', onPress: () => {}, style: 'cancel'}
                ],
                { cancelable: false }
            )
        } else {

            loading.show(); 

            var files = []
            var val = 0

            if (attachItems.length != 0) {
                attachItems.map((item, index) => {
                    
                    const uploadUri = Platform.OS === 'ios' ? item.link.replace('file://', '') : item.link
                    const type = (item.isPhoto) ? "image" : "video"

                    var time = new Date().getTime()

                    firebase.storage()
                        .ref(`feed/${type}_${time}`)
                        .putFile(uploadUri)
                        .then(uploadedFile => {
                            // console.log(uploadedFile.downloadURL);

                            if (!item.isPhoto) {
                                const thumbnailUrl = Platform.OS === 'ios' ? item.thumbnail.replace('file://', '') : item.thumbnail 

                                firebase.storage()
                                    .ref(`feed/thumbnail_${time}`)
                                    .putFile(thumbnailUrl)
                                    .then(uploadedThumbFile => {
                                        files.push({"file" : uploadedFile.downloadURL, "thumbnail" : uploadedThumbFile.downloadURL, "isPhoto" : false})

                                        val++
                                        if (attachItems.length == val) {
                                            loading.close();

                                            this.postFeed(comment, files)
                                        } 
                                    })
                            } else {
                                files.push({"file" : uploadedFile.downloadURL, "isPhoto" : true})

                                val++
                                if (attachItems.length == val) {
                                    loading.close();

                                    this.postFeed(comment, files)
                                }                        
                            }                                                                                 
                        })
                        .catch(err => {
                            loading.close();
                            console.log("upload error : " +err);
                        });
                })

            } else {
                this.postFeed(comment, null)
            }            
        }
    }

    postFeed(comment, files) {

        console.log(files)

        var navigation = this.props.navigation
        
        var datetime = new Date().getTime()
        let feed = {comment, created_at: datetime, attach: files, userId: App.userId}
        const feedRef = firebase.database().ref().child('feeds');

        feedRef.child('counter').transaction(function(currentValue) {
            return (currentValue||1000) + 1
        },function(err, committed, ss){
            if(err){
                console.log(err)
            }
            else if(committed){
                var feed_id = ss.val()

                feedRef.child("records").child(feed_id).update({...feed})
                .then(() => {
                    console.log("Feed", feed)
                    navigation.navigate("Feed")
                })
                .catch((error) => {
                    console.log("error:" + error)
                });
            }
        })
    }  

    getSelectedAttach = async (selectIndex, selectedItem) => {
        var items = []
        for (let index = 0; index < selectedItem.length; index++) {
            console.log(selectedItem[index])
            let element = selectedItem[index].uri;

            if (selectIndex == 0) {
                items.push({"link": element, "isPhoto": true})
            } else {

                await RNThumbnail.get(element).then((result) => {
                    items.push({"link": element, "thumbnail": result.path, "isPhoto": false})
                })                
            }
        }

        // console.log(items)

        this.setState({
            attachItems: [...this.state.attachItems, ...items]
        })
    }

    render() {

        const { selectIndex, attachItems } = this.state

        var selectedItem = []
        const {navigation} = this.props
        if (navigation.state.params) {
            selectedItem = navigation.state.params.selectedItem
        }

        console.log("attach item: " + attachItems)

        let listPages = attachItems.map((item, index) => {
            return this.renderScrollItem(item, index);
        });

        return (

            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => this.getSelectedAttach(selectIndex, selectedItem)} />

                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                    <TouchableOpacity onPress={() => this.actionBack()} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>
                    <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>New Post</Text>
                </View>

                <View style={{flexDirection: 'row', width: windowWidth - 60, height: 50, marginLeft: 30, alignItems: 'center', marginTop: 20}}>
                    <TextInput style={{flex: 1, height: 40, fontSize: 13, color: color.white, marginRight: 10}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Type to here ..."
                        placeholderTextColor = {color.label_color}
                        autoCapitalize = "none"
                        onChangeText={(comment) => this.setState({comment: comment})}
                        value={this.state.comment} />
                </View>

                <View style={{marginTop: 20}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false} >

                        {listPages}

                    </ScrollView>
                </View>

                <TouchableOpacity onPress={() => this.actionPost()} style={{width: 200, height: 50, backgroundColor: color.white, borderRadius: 25, marginTop: 35, alignItems: 'center', justifyContent: 'center', marginLeft: (windowWidth - 200) / 2}}>
                    <Text style={{fontSize: 16, color: color.main_color}}>Post</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', width: windowWidth, height: 64, backgroundColor: color.bg_color, position: 'absolute', left: 0, bottom: 0, alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.actionSheet(0)} >
                        <Image source={ require("../resource/pic.png") } style={[{width: 22, height: 22, marginLeft: 30}]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.actionSheet(1)} >
                        <Image source={ require("../resource/video.png") } style={[{width: 22, height: 20, marginLeft: 30}]} />
                    </TouchableOpacity>
                </View>

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={(selectIndex == 0) ? ['Take Photo', 'Photo Gallery', 'Cancel'] : ['Take Video', 'Video Gallery', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { 
                        if (index == 0 || index == 1) {
                            this.actionSelect(index) 
                        }
                    }} />

                <Loading ref="loading"/>   
            </View>
        )
    }
}

