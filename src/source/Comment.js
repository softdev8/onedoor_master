import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList, TextInput, Alert, Keyboard, KeyboardAvoidingView} from 'react-native';

import { styles, color, windowWidth, windowHeight } from "./styles/theme"
import CommentItem from '../components/CommentItem';

import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase'

import { App } from "./Global"
import Loading from 'react-native-whc-loading'

export default class Comment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            commentList: [],
            commentCnt: '',
            visibleHeight: 0
        }
    }

    componentWillMount () {
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

    actionBack = (route) => {
        this.props.navigation.navigate(route)
    }

    getComments = async (feedId) => {

        const commentRef = await firebase.database().ref().child(`comments/${feedId}`);
        commentRef.on('value', snapshot => {
            var  commentDetail = snapshot.val();
            var childNum = snapshot.numChildren()
            var index  = 0;
            var records = [];
            snapshot.forEach((childSnapshot) => {

                var name = '', avatar=''
                var userRef = firebase.database().ref(`/users/${commentDetail[childSnapshot.key]['userId']}`);
                userRef.once('value').then(userSnapshot => {
                    var userDetails = userSnapshot.val()

                    name = userDetails['name']
                    avatar = userDetails['avatar']

                    records[index] = {
                        comment:commentDetail[childSnapshot.key]['comment'],
                        created_at:commentDetail[childSnapshot.key]['created_at'],
                        userName: name,
                        userAvatar: avatar
                    }
                    index++;

                    this.setState({ commentList: records, commentCnt: childNum })    
                }) 
            })
        })
    }

    postComment = (feedId) => {

        var obj = this
        var loading = this.refs.loading 

        const {comment} = this.state
        if (comment.length == 0) {
            Alert.alert(
                'Input Error',
                'Please enter comment',
                [
                    {text: 'Yes', onPress: () => {}, style: 'cancel'}
                ],
                { cancelable: false }
            )

        } else {

            loading.show(); 

            var datetime = new Date().getTime()
            let commentData = {comment, created_at: datetime, userId: App.userId}

            this.setState({comment: ''})

            const commentRef = firebase.database().ref().child('comments');
            commentRef.child('counter').transaction(function(currentValue) {
                return (currentValue||100) + 1
            },function(err, committed, ss){
                if(err){
                    console.log(err)
                }
                else if(committed){
                    var comment_id = ss.val()

                    commentRef.child(`${feedId}`).child(comment_id).update({...commentData})
                    .then(() => {
                        loading.close();

                        // obj.getComments(feedId)
                    })
                    .catch((error) => {
                        loading.close();
                        console.log("error:" + error)
                    });
                }
            })
        }
    }

    render() {

        const {commentList, commentCnt, visibleHeight} = this.state

        const {navigation} = this.props
        let route = navigation.state.params.route
        let feedId = navigation.state.params.feedId
        let userId = navigation.state.params.userId

        let keyboardBottom = (Platform.OS == 'ios') ? visibleHeight : 0

        return (
            <View style={styles.container}>

                <NavigationEvents
                    onWillFocus={payload => this.getComments(feedId)} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>

                    <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                    <View style={{flexDirection: 'row', width: windowWidth - 60, height: 50, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                        <TouchableOpacity onPress={() => this.actionBack(route)} style={styles.backBtnPadding}>
                            <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                        </TouchableOpacity>
                        <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>{commentCnt} comments</Text>
                    </View>

                    <FlatList
                        style={{height: windowHeight - 183 - keyboardBottom}}
                        data={commentList}
                        keyExtractor={(item, index) => item.index}
                        renderItem={({item, index}) => 
                            <CommentItem item={item} isUserFriend={false} navigation={this.props.navigation} route={"Comment"} />
                        }
                    />
                    
                    {(userId != App.userId) ?
                        <View style={{flexDirection: 'row', width: windowWidth, height: 64, backgroundColor: color.bg_color, alignItems: 'center'}}>
                            <TextInput style={{flex: 1, height: 40, fontSize: 13, color: color.white, marginLeft: 30, marginRight: 10}}
                                underlineColorAndroid = "transparent"
                                placeholder = "Type comments here ..."
                                placeholderTextColor = {color.label_color}
                                autoCapitalize = "none"
                                onChangeText={(comment) => this.setState({comment: comment})}
                                value={this.state.comment} />
                            
                            <TouchableOpacity onPress={() => this.postComment(feedId)} style={{paddingTop: 10, paddingBottom: 10}}>
                                <Image source={ require("../resource/send.png") } style={[{width: 22, height: 14, marginRight: 30}]} />
                            </TouchableOpacity>
                        </View> : undefined }
                </KeyboardAvoidingView>

                <Loading ref="loading"/>  

            </View>
        )
    }
}

