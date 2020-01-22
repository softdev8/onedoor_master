import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, Platform, AsyncStorage} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';

import { styles, color, windowWidth } from "./styles/theme"
import { App } from "./Global"
import firebase from 'react-native-firebase'

// import AsyncStorage from '@react-native-community/async-storage';

const SLIDER_1_FIRST_ITEM = 0;

const walkthrough = [
    {
        title: 'Find Unique Experiences in Your City',
        subtitle: 'Cras quis nulla commodo, aliquam lectus sed, blandit augue.',
        illustration: require("../resource/walkthrough1.png")
    },
    {
        title: 'Get Your Tickets',
        subtitle: 'Cras quis nulla commodo, aliquam lectus sed, blandit augue.',
        illustration: require("../resource/walkthrough2.png")
    },
    {
        title: 'Do More, See More & Like More',
        subtitle: 'Cras quis nulla commodo, aliquam lectus sed, blandit augue.',
        illustration: require("../resource/walkthrough3.png")
    }
];

export default class WalkThrough extends Component {

    constructor(props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    async componentDidMount() {

        if (Platform.OS == 'ios') {
            navigator.geolocation.requestAuthorization();    
        }

        // try {
        //     const userId = await AsyncStorage.getItem('@userId')
        //     if(userId !== null && userId !== "") {
        //         // value previously stored
        //         console.log(userId)
        //         App.userId = userId
        //         this.props.navigation.navigate('TabStack')
        //     }
        // } catch(e) {
        //     // error reading value
        //     console.log("storage:" + e)
        // }
        
        // firebase.auth().onAuthStateChanged (user => {
        //     if (user) {
        //         console.log(user)
        //         if (user.uid != null && user.uid != "") {
        //             App.userId = user.uid
        //             this.props.navigation.navigate('TabStack')
        //         }    
        //     }            
        // })
    }

    actionSkip = () => {
        App.navigation = this.props.navigation
        console.log(this.props);
        this.props.navigation.navigate('Sign')
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} index={0}/>;
    }

    changeSwipe = (index) => {

        console.log(index);
        if (App.slideIndex == 2 && index == 0) {
            this.actionSkip()
        } else {
            App.slideIndex = index
        
            this.setState({
                slider1ActiveSlide: index
            })
        }
    }

    render() {

        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.container}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == "android") ? {marginTop: 5} : {marginTop: 35}]} />
                <TouchableOpacity onPress={() => this.actionSkip()} >
                    <Text style={{color: color.white, fontSize: 14, textAlign: 'center', marginTop: 20}}>Skip</Text>
                </TouchableOpacity>

                <View style={{alignItems: 'center'}}>
                    <Carousel
                        ref={c => this._slider1Ref = c}
                        data={walkthrough}
                        renderItem={this._renderLightItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        containerCustomStyle={styles.slider}
                        layout={'tinder'}
                        layoutCardOffset={(Platform.OS == 'android') ? `17` : `20`}
                        loop={true}
                        onSnapToItem={(index) => this.changeSwipe(index) }
                        cardNum={3}
                    />
                </View>

                <Pagination
                    dotsLength={walkthrough.length}
                    activeDotIndex={slider1ActiveSlide}
                    dotColor={color.indicate_bg}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={color.white}
                    inactiveDotScale={1}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />
            </View>
        )
    }
}

