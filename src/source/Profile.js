import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, ScrollView, FlatList} from 'react-native';

import PostItem from '../components/PostItem';
import FriendItem from '../components/FriendItem';
import CommentItem from '../components/CommentItem';

import {NavigationActions, NavigationEvents} from 'react-navigation'

import { styles, color, windowWidth } from "./styles/theme"

import firebase from 'react-native-firebase'

import { App } from "./Global"
import Loading from 'react-native-whc-loading'

let userList = [
    {
        name: 'Steve Patrick',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Clyde ...',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Donec Facilisis',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Alan Caldwell',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Mykhailo Storozhuk',
        avatar: require('../resource/avatar.png')
    }
]

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page_index: 0,
            postData: [],
            totalCnt: 0,
            name: '',
            avatar: ''
        }
    }

    actionBack = (route) => {

        if (route == 'event') {
            const navigateAction = NavigationActions.navigate({
                routeName: 'TabStack',  //Parent route
                params: {},
              
                // navigate can have a nested navigate action that will be run inside the child router
                action: NavigationActions.navigate({ routeName: 'Event'})    //Chile route
            })
            this.props.navigation.dispatch(navigateAction)    
        } else {
            this.props.navigation.navigate(route)    
        }        
    }

    actionSelect = (index) => {
        this.setState({
            page_index: index
        })
    }

    actionFriendProfile = () => {
        this.props.navigation.navigate("FriendProfile")
    }

    getProfile = async (userId) => {

        var obj = this

        var feedRef = firebase.database().ref('feeds/records');
        feedRef.on('value', snapshot => {

            var  feedDetail = snapshot.val();
            var index  = 0;
            var userRecord = [];
            snapshot.forEach((childSnapshot) => {

                var feedID = childSnapshot.key

                if (feedDetail[feedID]['userId'] == userId) {

                    var name = '', avatar=''
                    var userRef = firebase.database().ref(`/users/${feedDetail[feedID]['userId']}`);
                    userRef.once('value').then(userSnapshot => {
                        var userDetails = userSnapshot.val()

                        name = userDetails['name']
                        avatar = userDetails['avatar']

                        obj.setState({
                            name: name,
                            avatar: avatar
                        })

                        var commentRef = firebase.database().ref(`/comments/${feedID}`);
                        commentRef.once('value').then(commentSnapshot => {
                            var cCnt = commentSnapshot.numChildren()

                            var likeRef = firebase.database().ref(`/likes/${feedID}`);
                            likeRef.once('value').then(likeSnapshot => {
                                
                                var likeDetails = likeSnapshot.val()

                                var i = 0
                                var arrlikes = [];
                                likeSnapshot.forEach((childSnapshot) => {
                                    var likeID = childSnapshot.key

                                    arrlikes[i] = likeDetails[likeID]['userId']
                                    i++
                                })

                                userRecord[index] = {
                                    itemIndex: index,
                                    comment:feedDetail[feedID]['comment'],
                                    created_at:feedDetail[feedID]['created_at'],
                                    attach:feedDetail[feedID]['attach'],
                                    feedId:feedID,
                                    userId:feedDetail[feedID]['userId'],
                                    userName: name,
                                    userAvatar: avatar,
                                    commentCnt: cCnt,
                                    likes: arrlikes
                                }
                                index++;

                                this.setState({ postData: userRecord, totalCnt: index })    
                            })
                        })
                    })
                }           
            })
        })        
    }

    async onHandledCallback(index, feedId, userId) {
        
        const {postData} = this.state

        if (userId != App.userId) {     //not same user

            var datetime = new Date().getTime()
            let likeData = {created_at: datetime, userId: App.userId}

            const likeRef = await firebase.database().ref().child('likes');
            likeRef.child(`${feedId}`).orderByChild("userId").equalTo(App.userId).once("value").then(snapshot => {
                if (snapshot.val()) {
                    // data exist, do something else
                    snapshot.forEach((childSnapshot) => {
                        likeRef.child(`${feedId}`).child(childSnapshot.key).remove();
                    })
                } else {

                    likeRef.child('counter').transaction(function(currentValue) {
                        return (currentValue||100) + 1
                    },function(err, committed, ss){
                        if(err){
                            console.log(err)
                        }
                        else if(committed){
                            var like_id = ss.val()

                            likeRef.child(`${feedId}`).child(like_id).update({...likeData})
                            .then(() => {
                                console.log("Like", likeData)
                            })
                            .catch((error) => {
                                console.log("error:" + error)
                            });
                        }
                    })
                }
            }) 

            var temp = postData
            var itemIdx = temp[index].likes.indexOf(App.userId)
            if (itemIdx == -1) {
                temp[index].likes.push(App.userId)
            } else {
                temp[index].likes.splice(itemIdx, 1);
            }

            console.log(temp)
            this.setState({
                pageData: temp
            })
        } 
    }

    actoinMessage = (name, avatar, userId) => {
        App.receiverId = userId
        this.props.navigation.navigate("Conversation", {receiver_name: name, receiver_avatar: avatar, receiverId: userId})
    }

    render() {

        const { page_index, postData, totalCnt, name, avatar } = this.state

        let pageData = (page_index == 0) ? postData : userList

        const {navigation} = this.props
        let userId = navigation.state.params.userId
        let route = navigation.state.params.route

        return (
            <View style={[styles.container, {backgroundColor: color.bg_color}]}>
                <NavigationEvents
                    onWillFocus={payload => this.getProfile(userId)} />

                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == "android") ? {marginTop: 5} : {marginTop: 35}]} />
                    
                <View style={{flexDirection: 'row', width: windowWidth - 50, marginLeft: 15, marginTop: 15}}>
                    <TouchableOpacity onPress={() => this.actionBack(route)} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>

                    <View style={{flex: 1, flexDirection: 'row', height: 70, alignItems: 'center'}}>
                        <Image source={{ uri: avatar }} style={[{width: 70, height: 70, marginLeft: 20, borderRadius: 35}]} />

                        <View style={{marginLeft: 15}}>
                            <Text style={{color: color.white, fontSize: 16, fontWeight: 'bold'}}>{name}</Text>
                            <Text style={{color: color.white, fontSize: 12, marginTop: 10}}>UI Designer</Text>
                        </View>                        
                    </View>

                    {(userId == App.userId) ?
                        <Image source={ require("../resource/ic_search.png") } style={[{width: 22, height: 22}]} /> :
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <TouchableOpacity onPress={() => this.actoinMessage(name, avatar, userId)} >
                                <Image source={ require("../resource/tab_chat.png") } style={[{width: 22, height: 22, marginRight: 25}]} />
                            </TouchableOpacity>
                            <Image source={ require("../resource/ic_user_friends.png") } style={[{width: 21, height: 21}]} />
                        </View> }
                </View>

                <View style={{marginTop: 30, backgroundColor: '#232a38', alignItems: 'center'}}>
                    <View style={{width: 200, height: 100, backgroundColor: '#283042', alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30}} />
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.actionSelect(0)} style={[style.tab, (page_index == 0) ? {backgroundColor: color.main_color} : {backgroundColor: color.bg_color}]}>
                        <Image source={ require("../resource/ic_post.png") } style={[{width: 25, height: 25}]} />
                        <Text style={{color: color.label_color, fontSize: 15, marginLeft: 10}}>{totalCnt}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionSelect(1)} style={[style.tab, (page_index == 0) ? {backgroundColor: color.bg_color} : {backgroundColor: color.main_color}]} >
                        <Image source={ require("../resource/ic_friends.png") } style={[{width: 25, height: 20}]} />
                        <Text style={{color: color.label_color, fontSize: 15, marginLeft: 10}}>5</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{flex: 1}}
                    data={pageData}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        (page_index == 0) ?
                            ((item.attach) ?
                                <PostItem item={item} navigation={this.props.navigation} route={"Profile"} callback={this.onHandledCallback.bind(this)} />  : <CommentItem item={item} isUserFriend={true} route={"Feed"} />) : <TouchableOpacity onPress={() => this.actionFriendProfile()}><FriendItem item={item} /></TouchableOpacity>
                    }
                />
                
                <Loading ref="loading"/> 
            </View>
        )
    }
}

const style = StyleSheet.create({
    tab: {
        flexDirection: 'row', 
        width: windowWidth / 2, 
        height: 65, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});


