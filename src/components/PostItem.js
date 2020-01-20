import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import { color, windowWidth, styles } from "../source/styles/theme"

import firebase from 'react-native-firebase'

import { App } from "../source/Global"

export default class PostItem extends Component {
    constructor(props) {
        super(props);
    }

    actionFullscreen = (navigation, file_link, isPhoto) => {
        if (isPhoto) {
            navigation.navigate("FullScreenImage", {file_link: file_link})    
        } else {
            navigation.navigate("VideoPlayer", {video_link: file_link})    
        }        
    }

    renderScrollItem(navigation, item, index) {
        console.log(item)
        return (
            <TouchableOpacity onPress={()=>this.actionFullscreen(navigation, item.file, item.isPhoto)} >
                <View style={{marginRight: 10, backgroundColor: '#949fab'}}>
                    {(!item.isPhoto) ? 
                        <View style={{width: 200, height: 100}}>
                            <Image source={{ uri: item.thumbnail }} style={{width: 200, height: 100, opacity: .5}} />
                            <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30, position: 'absolute', top: 35, left: 85}} /> 
                        </View>: <Image source={{ uri: item.file }} style={{width: 200, height: 100, opacity: .5}} /> }
                </View>
            </TouchableOpacity>
        );
    }

    actionProfile = (navigation, userId, route) => {
        navigation.navigate("Profile", {userId: userId, route: route})
    }

    actionComment = (navigation, route, feedId, userId) => {
        navigation.navigate("Comment", {route: route, feedId: feedId, userId})
    }

    actionLike = (index, feedId, userId) => {

        if (this.props.callback) {
            this.props.callback(index, feedId, userId);
        }
    }

    render() {

        const { item, navigation, route } = this.props

        let listPages = item.attach.map((item, index) => {
            return this.renderScrollItem(navigation, item, index);
        });

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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: color.time_color, fontSize: 13, marginLeft: 30, width: 60}}>{val}</Text>
                    <TouchableOpacity onPress={() => this.actionProfile(navigation, item.userId, route)} >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={{ uri: item.userAvatar }} style={[styles.avatar]} />
                            <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>{item.userName}</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
                <Text style={{fontSize: 15, marginLeft: 30, marginTop: 15}}>
                    <Text style={{color: color.white}}>{item.comment}</Text>
                </Text>
                <View style={{height: 100, marginTop: 20}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false} >

                        {listPages}

                    </ScrollView>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginTop: 20}}>
                    <TouchableOpacity onPress={() => this.actionLike(item.itemIndex, item.feedId, item.userId)} >
                        <View style={{flexDirection: 'row'}}>
                            <Image source={ require("../resource/ic_like.png") } style={[{width: 22, height: 22, marginRight: 10}]} />
                            <Text style={{color: color.white, fontSize: 13, marginTop: 7}}>{item.likes.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.actionComment(navigation, route, item.feedId, item.userId)} >
                        <View style={{flexDirection: 'row'}}>
                            <Image source={ require("../resource/ic_comment.png") } style={[{width: 22, height: 20, marginLeft: 30, marginRight: 10}]} />
                            <Text style={{color: color.white, fontSize: 13, marginRight: 30, marginTop: 7}}>{item.commentCnt}</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>

                <View style={{height: 1, backgroundColor: color.line_color, marginLeft: 30, marginTop: 20}}/>
            </View>
        );
    }
}

