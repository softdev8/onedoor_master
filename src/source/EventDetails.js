import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Platform, ScrollView, TouchableOpacity} from 'react-native';

import { styles, color, windowWidth, windowHeight } from "./styles/theme"

import MapStyle from "./styles/MapStyle.json"
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {NavigationActions, NavigationEvents} from 'react-navigation'

import * as geolib from 'geolib';
import Geocoder from 'react-native-geocoding';

import { App } from "./Global"

function hp (percentage) {
    const value = (windowHeight * percentage) / 100;
    return Math.round(value);
}

let userList = [
    {
        picture: require('../resource/avatar1.png'),
    },
    {
        picture: require('../resource/avatar.png'),
    },
    {
        picture: require('../resource/avatar1.png'),
    },
    {
        picture: require('../resource/avatar1.png'),
    }
]

export default class EventDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: ''
        }
    }

    actionBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'TabStack',  //Parent route
            params: {},
          
            // navigate can have a nested navigate action that will be run inside the child router
            action: NavigationActions.navigate({ routeName: 'Event'})    //Chile route
        })
        this.props.navigation.dispatch(navigateAction)
    }

    actionUserList = () => {
        this.props.navigation.navigate("Invite", {route: "EventDetails"})
    }

    actionBuy = () => {
        this.props.navigation.navigate("PaymentDetails")
    }

    renderScrollItem(item, index) {
        return (
            <View>
                <Image source={ item.photo_link } style={{width: 200, height: hp(17), opacity: .5}} />
                {(!item.isPhoto) ? <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30, position: 'absolute', top: (hp(17) - 30) / 2, left: 85}} /> : undefined }
            </View>
        );
    }

    renderUserItem(item, index) {
        if (index > 2) {
            return (
                <TouchableOpacity onPress={() => this.actionUserList()} >
                    <View style={{width: 36, height: 36, backgroundColor: color.green_color, borderRadius: 18, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: color.white, fontSize: 12}}>+{userList.length - index}</Text>
                    </View>   
                </TouchableOpacity>
            )
        } else {
            return (
                <Image source={item.picture} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}}/>
            );
        }
    }

    getEventDetails = (latitude, longitude) => {
        Geocoder.init(App.GOOGLE_MAPS_APIKEY); 
        Geocoder.from(latitude, longitude)
        .then(json => {
            var addressComponent = json.results[0].formatted_address;
            console.log(addressComponent);

            this.setState({
                address: addressComponent
            })
        })
        .catch(error => console.warn(error));
    }

    render() {

        const {navigation} = this.props
        let item = navigation.state.params.item
        let current_latitude = navigation.state.params.current_latitude;
        let current_longitude = navigation.state.params.current_longitude;

        let distance = geolib.getDistance({latitude: current_latitude, longitude: current_longitude}, {
            latitude: item.latitude,
            longitude: item.longitude,
        })

        let miles = geolib.convertDistance(distance, 'mi').toFixed(3)
        console.log(miles)

        let userlist = userList.map((item, index) => {
            return this.renderUserItem(item, index);
        });

        var utcDate1 = new Date(item.datetime * 1000)

        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => this.getEventDetails(item.latitude, item.longitude)} />
                
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={style.map}
                    customMapStyle={MapStyle}
                    region={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }} >

                    <Marker 
                        coordinate={{latitude: item.latitude, longitude: item.longitude}}>
                        
                        <View style={{flexDirection: 'row'}}>
                            <Image source={ require('../resource/pin.png') } style={{resizeMode: 'stretch', width: 30, height: 30}} />
                            <Text style={{width: 150, fontSize: 14, color: color.white, marginLeft: 25, marginTop: 5}}>{this.state.address}</Text>
                        </View>

                    </Marker>

                </MapView>
                
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, position: 'absolute', alignSelf: 'center'}, (Platform.OS == 'android') ? {top: 5} : {top: 35}]} />

                <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, position: 'absolute', top: 35, alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.actionBack()} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>
                    <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>{item.title}</Text>
                    <Text style={{color: color.green_color, fontSize: 15}}>{(item.price == 0) ? "Free" : `$${item.price}`}</Text>
                </View>

                <Text style={{color: color.label_color1, fontSize: 15, position: 'absolute', top: 160, right: 30}}>{miles} mi</Text>

                <View style={{backgroundColor: '#232a38', alignItems: 'center'}}>
                    <View style={{width: 200, height: 100, backgroundColor: '#283042', alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={ require("../resource/ic_video.png") } style={{width: 30, height: 30}} />
                    </View>
                </View>
                
                <View style={{width: windowWidth - 70, marginLeft: 40}}>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Image source={ require("../resource/ic_time.png") } style={[{width: 22, height: 22}]} />
                        <Text style={{color: color.time_color, fontSize: 15, marginLeft: 30}}>{utcDate1.toUTCString()}</Text>
                    </View>
                    
                    <View style={{flexDirection: 'row', marginTop: 30}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            {userlist}
                        </View>
                        
                        <View style={{width: 100, height: 36, backgroundColor: color.white, borderRadius: 18, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, color: color.main_color}}>Invite +</Text>
                        </View>
                    </View>

                    <Text style={{color: color.white, fontSize: 15, marginTop: 30}}>{item.description}</Text>
                    
                    <TouchableOpacity onPress={() => this.actionBuy()} >
                        <View style={{width: 200, height: 50, backgroundColor: color.white, borderRadius: 25, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', marginTop: 35}}>
                            <Text style={{fontSize: 16, color: color.main_color}}>Buy Ticket</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const style = StyleSheet.create({
    map: {
        width: windowWidth,
        height: hp(32),
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

