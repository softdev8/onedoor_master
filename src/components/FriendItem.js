import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import { color, windowWidth, styles } from "../source/styles/theme"

export default class FriendItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { item } = this.props

        return (
            <View style={{flexDirection: 'row', height: 65, alignItems: 'center', marginLeft: 60}}>
                <Image source={ item.avatar } style={[styles.avatar]} />
                <Text style={{color: color.white, fontSize: 15, marginLeft: 10}}>{item.name}</Text>
            </View>
        );
    }
}

