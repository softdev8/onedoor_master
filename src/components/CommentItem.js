import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import { color, windowWidth, styles } from "../source/styles/theme"

export default class CommentItem extends Component {
    constructor(props) {
        super(props);
    }

    actionProfile = (navigation, userId, route) => {
        navigation.navigate("Profile", {userId: userId, route: route})
    }

    render() {

        const { item, navigation, isUserFriend, route } = this.props

        var current_time = new Date().getTime()
        var post_time = item.created_at

        var val = ""
        var diff = (current_time - post_time) / 1000
        if (diff < 60) {
            val = `${parseInt(diff)} s`
        } else if (diff < 3600) {
            val = `${parseInt(diff / 60)} m`
        } else if (diff < (3600 * 24)) {
            val = `${parseInt(diff / 3600)} h`
        } else {
            val = `${parseInt(diff / (3600 * 24))} d`
        }

        return (
            <View style={{marginTop: 20}}>
                <TouchableOpacity onPress={() => this.actionProfile(navigation, item.userId, route)} >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: color.time_color, fontSize: 13, marginLeft: 30, width: 60}}>{val}</Text>
                        <Image source={{ uri: item.userAvatar }} style={[styles.avatar]} />
                        <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>{item.userName}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Text style={{flex: 1, fontSize: 15, marginLeft: 30, color: color.white}}>{item.comment}</Text>
                    {(isUserFriend) ?
                        <Image source={ require("../resource/ic_user_friends.png") } style={{width: 22, height: 22, marginRight: 30}} /> : undefined }
                </View>

                <View style={{height: 1, backgroundColor: color.line_color, marginLeft: 30, marginTop: 20}}/>
            </View>
        );
    }
}

