import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Platform, TextInput, FlatList} from 'react-native';

import { styles, color, windowWidth } from "../styles/theme"
import PostItem from '../../components/PostItem';
import CommentItem from '../../components/CommentItem';

import ActionButton from 'react-native-action-button';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase'

import { App } from "../Global"

export default class Feed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            temp: []
        }
    }

    async componentDidMount() {
        this.getFeeds()
    }

    actionPost = () => {
        this.props.navigation.navigate("Post")
    }

    getFeeds = async () => {

        var feedRef = firebase.database().ref().child('feeds/records');
        feedRef.on('value', snapshot => {

            var  feedDetail = snapshot.val();
            var index  = 0;
            var userRecord = [];
            snapshot.forEach((childSnapshot) => {

                var feedID = childSnapshot.key

                var name = '', avatar=''
                var userRef = firebase.database().ref().child(`users/${feedDetail[feedID]['userId']}`);
                userRef.once('value').then(userSnapshot => {
                    var userDetails = userSnapshot.val()

                    name = userDetails['name']
                    avatar = userDetails['avatar']

                    var commentRef = firebase.database().ref().child(`comments/${feedID}`);
                    commentRef.once('value').then(commentSnapshot => {
                        var cCnt = commentSnapshot.numChildren()

                        var likeRef = firebase.database().ref().child(`likes/${feedID}`);
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

                            this.setState({ dataList: userRecord, temp: userRecord })
                        })
                    })
                }) 
            })               
        })        
    }

    onSort(e) {
        let text = e.toLowerCase()
    
        let fullList = this.state.temp;
    
        console.log("FEED DATA", fullList);
        let filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
          if(item.userName.toLowerCase().match(text) || item.comment.toLowerCase().match(text))
            return item;
        })
        if (!text || text === '') {
          this.setState({
            dataList: fullList
        })
        } else if (!filteredList.length) {
         // set no data flag to true so as to render flatlist conditionally
           console.log("EMPTY DATA");
        }
        else if (Array.isArray(filteredList)) {
          this.setState({
            dataList: filteredList
          })
        }
    }

    async onHandledCallback(index, feedId, userId) {
        
        const {dataList} = this.state

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

            var temp = dataList
            var itemIdx = temp[index].likes.indexOf(App.userId)
            if (itemIdx == -1) {
                temp[index].likes.push(App.userId)
            } else {
                temp[index].likes.splice(itemIdx, 1);
            }

            this.setState({
                dataList: temp
            })
        } 
    }

    render() {

        const {dataList} = this.state

        // console.log(dataList)

        return (
            <View style={[styles.container]}>
                {/* <NavigationEvents
                    onWillFocus={payload => this.getFeeds()} /> */}

                <Image source={ require("../../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />

                <View style={{flexDirection: 'row', width: windowWidth - 60, height: 50, marginLeft: 30, alignItems: 'center'}}>
                    <Image source={ require("../../resource/ic_search.png") } style={{width: 15, height: 15}} />
                    <TextInput style={{flex: 1, height: 40, fontSize: 13, color: color.white, marginRight: 10, marginLeft: 10}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Type to search ..."
                        placeholderTextColor = {color.label_color}
                        autoCapitalize = "none"
                        onChangeText={this.onSort.bind(this)} />
                </View>

                <FlatList
                    style={{flex: 1, marginTop: 20}}
                    data={dataList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        (item.attach) ?
                        <PostItem item={item} navigation={this.props.navigation} route={"Feed"} callback={this.onHandledCallback.bind(this)}/> : <CommentItem item={item} navigation={this.props.navigation} isUserFriend={true} route={"Feed"}  /> 
                    }
                />
                
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#FFFFFF' onPress={() => this.actionPost()}>
                        <Image source={ require("../../resource/ic_menu_video.png") } style={{width: 50, height: 50}} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#FFFFFF' onPress={() => this.actionPost()}>
                        <Image source={ require("../../resource/ic_menu_pic.png") } style={{width: 50, height: 50}} />
                    </ActionButton.Item>
                </ActionButton>

            </View>
        )
    }
}

