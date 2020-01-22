import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, ScrollView, FlatList} from 'react-native';

import PostItem from '../components/PostItem';
import FriendItem from '../components/FriendItem';

import { styles, color, windowWidth } from "./styles/theme"

let postData = [
    {
        name: 'Peter Zlan',
        avatar: require('../resource/avatar1.png'),
        time: "4 m",
        title: "Photos of",
        mark: "Music Night",
        like: 39,
        comment: 5,
        items: [
            {
                photo_link: "",
                isPhoto: true
            },
            {
                photo_link: "",
                isPhoto: true
            },
            {
                photo_link: "",
                isPhoto: true
            }
        ]
    },
    {
        name: 'Peter Zlan',
        avatar: require('../resource/avatar1.png'),
        time: "3 h",
        title: "Videos of",
        mark: "Music Night",
        like: 10,
        comment: 20,
        items: [
            {
                photo_link: "",
                isPhoto: false
            },
            {
                photo_link: "",
                isPhoto: true
            }
        ]
    },
    {
        name: 'Peter Zlan',
        avatar: require('../resource/avatar1.png'),
        time: "3 d",
        title: "Wow !!!",
        mark: "",
        like: 50,
        comment: 30,
        items: [
            {
                photo_link: "",
                isPhoto: false
            }
        ]
    }
]

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
    }
]

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page_index: 0
        }
    }

    actionBack = () => {
        this.props.navigation.navigate("Profile")
    }

    actionSelect = (index) => {
        this.setState({
            page_index: index
        })
    }

    render() {

        const { page_index } = this.state

        let pageData = (page_index == 0) ? postData : userList

        return (
            <View style={[styles.container, {backgroundColor: color.bg_color}]}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == "android") ? {marginTop: 5} : {marginTop: 35}]} />
                    
                <View style={{flexDirection: 'row', width: windowWidth - 50, marginLeft: 15, marginTop: 15}}>
                    <TouchableOpacity onPress={() => this.actionBack()} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>

                    <View style={{flex: 1, flexDirection: 'row', height: 70, alignItems: 'center'}}>
                        <Image source={ require("../resource/avatar1.png") } style={[{width: 70, height: 70, marginLeft: 20}]} />

                        <View style={{marginLeft: 15}}>
                            <Text style={{color: color.white, fontSize: 16, fontWeight: 'bold'}}>Peter Zlan</Text>
                            <Text style={{color: color.white, fontSize: 12, marginTop: 10}}>iOS Dev</Text>
                        </View>                        
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Image source={ require("../resource/tab_chat.png") } style={[{width: 22, height: 22, marginRight: 25}]} />
                        <Image source={ require("../resource/ic_user_friends.png") } style={[{width: 21, height: 21}]} />
                    </View>
                </View>

                <View style={{marginTop: 30, backgroundColor: '#232a38', alignItems: 'center'}}>
                    <View style={{width: 200, height: 100, backgroundColor: '#283042', alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30}} />
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.actionSelect(0)} style={[style.tab, (page_index == 0) ? {backgroundColor: color.main_color} : {backgroundColor: color.bg_color}]}>
                        <Image source={ require("../resource/ic_post.png") } style={[{width: 25, height: 25}]} />
                        <Text style={{color: color.label_color, fontSize: 15, marginLeft: 10}}>3</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionSelect(1)} style={[style.tab, (page_index == 0) ? {backgroundColor: color.bg_color} : {backgroundColor: color.main_color}]} >
                        <Image source={ require("../resource/ic_friends.png") } style={[{width: 25, height: 20}]} />
                        <Text style={{color: color.label_color, fontSize: 15, marginLeft: 10}}>3</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{flex: 1}}
                    data={pageData}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        (page_index == 0) ?
                            <PostItem item={item} navigation={this.props.navigation} route={"FriendProfile"} /> : <FriendItem item={item} />
                    }
                />

                {/* <View style={{flexDirection: 'row', height: 65, alignItems: 'center', marginLeft: 60}}>
                    <Image source={ require("../resource/avatar.png") } style={[styles.avatar]} />
                    <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>Steve Patrick</Text>
                </View> */}
                
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


