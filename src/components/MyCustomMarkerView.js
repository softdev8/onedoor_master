import React from 'react';
import {Text, Image, View, StyleSheet, Platform} from 'react-native';

export const MyCustomMarkerView = (props) => {

    const markerImage = (Platform.OS === 'ios') ? require('../resource/ic_pin1.png') : require('../resource/ic_pin1.png')
    
    return (
        <View style={{width: 30, height: 30}}>
            <Image source={ markerImage } style={{resizeMode: 'stretch', height: 30, width: 30}} />
        </View>
    )
};


