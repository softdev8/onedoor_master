import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Image, Platform} from 'react-native';

import { styles, color, windowWidth } from "../styles/theme"

import Carousel from 'react-native-snap-carousel';
import SliderEntry from '../../components/SliderEntry';

import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';

const siginData = [
    {
        page_index: 0,
    },
    {
        page_index: 1
    }
];

export default class Ticket extends Component {

    constructor(props) {
        super(props);

    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} index={2} />;
    }

    render() {

        return (
            <View style={[styles.container]}>
                
                <Image source={ require("../../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />

                <View style={{flexDirection: 'row', width: windowWidth - 60, height: 50, marginLeft: 30, alignItems: 'center'}}>
                    <Image source={ require("../../resource/ic_search.png") } style={{width: 15, height: 15}} />
                    <TextInput style={{flex: 1, height: 40, fontSize: 13, color: color.white, marginRight: 10, marginLeft: 10}}
                        underlineColorAndroid = "transparent"
                        placeholder = "Type to search ..."
                        placeholderTextColor = {color.label_color}
                        autoCapitalize = "none" />
                </View>

                <View style={{alignItems: 'center'}}>
                    <Carousel
                        data={siginData}
                        renderItem={this._renderLightItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        containerCustomStyle={styles.slider}
                        layout={'tinder'}
                        layoutCardOffset={`17`}
                        loop={true}
                        cardNum={3}
                    />
                </View>

            </View>
        )
    }
}

