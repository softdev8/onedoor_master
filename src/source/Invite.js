import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList} from 'react-native';

import { styles, color, windowWidth } from "./styles/theme"
import FriendItem from '../components/FriendItem';

let userList = [
    {
        name: 'Steve Patrick',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Clyde ...',
        avatar: require('../resource/avatar1.png')
    },
    {
        name: 'Donec Facilisis',
        avatar: require('../resource/avatar.png')
    },
    {
        name: 'Steve Patrick',
        avatar: require('../resource/avatar1.png')
    },
    {
        name: 'Donec Facilisis',
        avatar: require('../resource/avatar.png')
    }
]


export default class Invite extends Component {

    constructor(props) {
        super(props);

    }

    actionBack = (route) => {
        this.props.navigation.navigate(route)
    }

    render() {

        const {navigation} = this.props
        let route = navigation.state.params.route

        return (
            <View style={styles.container}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                    <TouchableOpacity onPress={() => this.actionBack(route)} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>
                    <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>6 People party together</Text>
                </View>

                <FlatList
                    style={{flex: 1, marginTop: 20}}
                    data={userList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        <FriendItem item={item} />
                    }
                />

                <View style={{width: 200, height: 50, backgroundColor: color.white, borderRadius: 25, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', marginRight: 30, marginBottom: 30}}>
                    <Text style={{fontSize: 16, color: color.main_color}}>Invite Friends</Text>
                </View>
            </View>
        )
    }
}

