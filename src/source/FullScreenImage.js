import React, {Component} from 'react';
import {View, Image, Platform, TouchableOpacity, Text} from 'react-native';

import { color, styles, windowWidth, windowHeight, navbarHeight} from "./styles/theme"

export default class FullScreenImage extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {goBack} = this.props.navigation;

        const {navigation} = this.props
        let file_link = navigation.state.params.file_link

        return (
            <View style={styles.container}>
                <View style={[{width: windowWidth, height: navbarHeight, backgroundColor: color.main_color, alignItems: 'center', justifyContent: 'center'}, (Platform.OS == 'ios') ? {paddingTop: 25} : null]}>
                    <Text style={[{color: color.white}]}>Image</Text>
                    <TouchableOpacity onPress={() => goBack()} style={[{position: 'absolute', left: 15, alignSelf: 'center'}, (Platform.OS == 'ios') ? {top: 38} : null]} >
                        <Image source={require("../resource/ic_back.png")} style={[{width: 10, height: 17}]}/>
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: file_link }} style={{width: windowWidth, height: windowHeight}}/>
            </View>
        )
    }
}
