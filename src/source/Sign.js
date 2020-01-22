import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import SliderEntry from '../components/SliderEntry';

import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import { styles, color } from "./styles/theme"

const SLIDER_1_FIRST_ITEM = 0;

const siginData = [
    {
        page_index: 0,
    },
    {
        page_index: 1
    }
];

export default class Sign extends Component {

    constructor(props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} index={1} page_index={item.page_index}/>;
    }

    render() {

        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.container}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == "android") ? {marginTop: 5} : {marginTop: 35}]} />
                <Text style={{color: color.white, fontSize: 14, textAlign: 'center', marginTop: 20}}>{ (slider1ActiveSlide == 0) ? "Sign In" : "Sign Up"}</Text>

                <View style={{alignItems: 'center'}}>
                    <Carousel
                        data={siginData}
                        renderItem={this._renderLightItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        containerCustomStyle={styles.slider}
                        layout={'tinder'}
                        layoutCardOffset={(Platform.OS == 'android') ? `17` : `20`}
                        loop={true}
                        cardNum={2}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    />
                </View>
            </View>
        )
    }
}

