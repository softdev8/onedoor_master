import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import { color, windowWidth, styles } from "../source/styles/theme"

export default class ChatUserItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { item } = this.props

        return (
            <View style={{marginTop: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{ uri: item.avatar }} style={[styles.avatar, {marginLeft: 30}]} />
                    <Text style={{flex: 1, color: color.white, fontSize: 13, marginLeft: 10}}>{item.name}</Text>
                    {(item.unread != 0) ?
                        <Text style={{color: color.time_color, fontSize: 13, marginRight: 30}}>{item.unread}</Text> : undefined }
                </View>

                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Text style={{flex: 1, fontSize: 15, marginLeft: 30, color: color.white}}>{item.last_message}</Text>
                </View>

                <View style={{height: 1, backgroundColor: color.line_color, marginLeft: 30, marginTop: 20}}/>
            </View>
        );
    }
}

