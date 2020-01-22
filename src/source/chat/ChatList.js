import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TextInput, Platform, FlatList, TouchableOpacity} from 'react-native';

import { styles, color, windowWidth } from "../styles/theme"
import ChatUserItem from '../../components/ChatUserItem';

import firebase from 'react-native-firebase'
import { App } from "../Global"

export default class ChatList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chatList: [],
            temp: []
        }
    }

    async componentDidMount() {
        this.getUserList()
    }

    getUserList = async () => {

        const chatRef = await firebase.database().ref().child(`conversation`);
        chatRef.child('records').on('value', snapshot => {
            var  chatDetail = snapshot.val();

            // console.log(chatDetail)

            var receivers = []
            var messages = []
            var unread = []

            console.log(App.userId)

            snapshot.forEach((childSnapshot) => {
                console.log(childSnapshot)

                if (chatDetail[childSnapshot.key]['receiverId'] == App.userId || chatDetail[childSnapshot.key]['senderId'] == App.userId) {
                    
                    var rId = (chatDetail[childSnapshot.key]['receiverId'] == App.userId) ? chatDetail[childSnapshot.key]['senderId'] : chatDetail[childSnapshot.key]['receiverId']

                    if (receivers.indexOf(rId) == -1) {
                        receivers.push(rId)
                        messages.push(chatDetail[childSnapshot.key]['message'])
                    } else {
                        if (chatDetail[childSnapshot.key]['message']) {
                            messages[receivers.indexOf(rId)] = chatDetail[childSnapshot.key]['message']    
                        }                        
                    }
                }
            })

            var records = [];

            for (let index = 0; index < receivers.length; index++) {
                
                var userRef = firebase.database().ref(`/users/${receivers[index]}`);
                userRef.once('value').then(userSnapshot => {
                    var userDetails = userSnapshot.val()

                    var receiver_name = userDetails['name']
                    var receiver_avatar = userDetails['avatar']

                    records[index] = {
                        name:receiver_name,
                        avatar:receiver_avatar,
                        receiverId: receivers[index],
                        last_message:messages[index],
                        unread:0
                    }

                    this.setState({ chatList: records, temp: records }) 
                })   
            }
        })
    }

    actionMessage = (receiver_name, receiver_avatar, receiverId) => {
        App.receiverId = receiverId
        this.props.navigation.navigate("Conversation", {receiver_name: receiver_name, receiver_avatar: receiver_avatar, receiverId: receiverId})
    }

    onSort(e) {
        let text = e.toLowerCase()
    
        let fullList = this.state.temp;
    
        console.log("FEED DATA", fullList);
        let filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
          if(item.name.toLowerCase().match(text) || item.last_message.toLowerCase().match(text))
            return item;
        })
        if (!text || text === '') {
          this.setState({
            chatList: fullList
        })
        } else if (!filteredList.length) {
         // set no data flag to true so as to render flatlist conditionally
           console.log("EMPTY DATA");
        }
        else if (Array.isArray(filteredList)) {
          this.setState({
            chatList: filteredList
          })
        }
    }

    renderScrollItem(item, index) {

        console.log(item)

        return (
            <TouchableOpacity onPress={() => this.actionMessage(item.name, item.avatar, item.receiverId)} style={{flexDirection: 'row', marginRight: 15, alignItems: 'center'}}>
                <Image source={{ uri: item.avatar }} style={{width: 36, height: 36, borderRadius: 18}} />
                <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    render() {

        const { chatList } = this.state

        // console.log(chatList)

        let listPages = chatList.map((item, index) => {
            return this.renderScrollItem(item, index);
        });

        return (
            <View style={[styles.container]}>
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

                <View style={{marginTop: 15, marginLeft: 30}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false} >

                        {listPages}

                    </ScrollView>
                </View>

                <View style={{height: 1, backgroundColor: color.line_color, marginLeft: 30, marginTop: 20}}/>

                <FlatList
                    style={{flex: 1, marginTop: 20}}
                    data={chatList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        <TouchableOpacity onPress={() => this.actionMessage(item.name, item.avatar, item.receiverId)} >
                            <ChatUserItem item={item} />
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}

