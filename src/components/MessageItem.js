import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import { color, windowWidth, styles } from "../source/styles/theme"
import { App } from "../source/Global"

export default class MessageItem extends Component {
    constructor(props) {
        super(props);
    }

    actionVideoPlay = (navigation, video_link) => {
        navigation.navigate("VideoPlayer", {video_link: video_link})    
    }

    actionFullScreen = (navigation, img_link) => {
        navigation.navigate("FullScreenImage", {file_link: img_link})    
    }

    render() {

        const { item, navigation } = this.props

        return (
            <View style={{width: windowWidth - 40, marginLeft: 20, marginTop: 10, marginBottom: 5}}>
            {(App.userId !== item.senderId) ? 
                ((item.attach) ?    //receiver
                    ((item.attach.isPhoto) ?
                        <TouchableOpacity onPress={() => this.actionFullScreen(navigation, item.attach.file)} >
                            <Image source={{uri: item.attach.file}} style={{width: 200, height: 200, borderRadius: 15, alignSelf: 'flex-start'}} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.actionVideoPlay(navigation, item.attach.file)} style={{width: 200, height: 200, alignSelf: 'flex-start'}}>
                            <Image source={{ uri: item.attach.thumbnail }} style={{width: 200, height: 200, opacity: .5, borderRadius: 15}} />
                            <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30, position: 'absolute', top: 85, left: 85}} /> 
                        </TouchableOpacity>
                    ) :
                    <View style={{padding: 15, backgroundColor: color.white, alignSelf: 'flex-start', borderBottomLeftRadius: 25, borderTopRightRadius: 25, borderBottomRightRadius: 25}}>
                        <Text>{item.message}</Text>
                    </View>) : 
                ((item.attach) ?    //sender
                    ((item.attach.isPhoto) ?
                        <TouchableOpacity onPress={() => this.actionFullScreen(navigation, item.attach.file)} >
                            <Image source={{uri: item.attach.file}} style={{width: 200, height: 200, borderRadius: 15, alignSelf: 'flex-end'}} /> 
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.actionVideoPlay(navigation, item.attach.file)} style={{width: 200, height: 200, alignSelf: 'flex-end'}} >
                            <Image source={{ uri: item.attach.thumbnail }} style={{width: 200, height: 200, opacity: .5, borderRadius: 15}} />
                            <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30, position: 'absolute', top: 85, left: 85}} /> 
                        </TouchableOpacity>
                    ) :
                    <View style={{padding: 15, backgroundColor: 'black', alignSelf: 'flex-end', borderBottomLeftRadius: 25, borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
                        <Text style={{color: color.white}}>{item.message}</Text>
                    </View>) }
            </View>
        );
    }
}

