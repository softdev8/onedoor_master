import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';

import { styles, color, windowWidth } from "../styles/theme"
import MapStyle from "../styles/MapStyle.json"
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import firebase from 'react-native-firebase'
import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import {MyCustomMarkerView} from '../../components/MyCustomMarkerView';
import * as geolib from 'geolib';
import { App } from "../Global"

import Geocoder from 'react-native-geocoding';

export default class Event extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            avatar: '',
            city: ''
        }
    }

    async componentDidMount() {

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'CarFriends App',
                        'message': 'CarFriends App access to your location '
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getGPSlocation()
                } else {
                    console.log("location permission denied")
                }
            } catch (err) {
                alert(JSON.stringify(err))
            }
        } else {
            this.getGPSlocation()
        }
    }

    async getGPSlocation() {

        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)
        
            console.log("Current Location:"+lat + " " + long);

            var city = '';
            Geocoder.init('AIzaSyDQnNu7t79jqzhO7rt7_SyHwWSXfcbj35k');
            Geocoder.from(lat, long)
            .then(json => {
                console.log(json);              
                
                var addressComponents = json.results[0].address_components;

                console.log(addressComponents)

                for (let index = 0; index < addressComponents.length; index++) {
                    if (addressComponents[index].types[0] == "locality") {
                        city = addressComponents[index].long_name

                        this.setState({
                            city: city
                        });

                        break
                    }         
                }
            })
            .catch(error => console.warn(error));

            firebase.auth().onAuthStateChanged (user => {
                if (user.uid != null && user.uid != "") {
    
                    var recentPostsRef = firebase.database().ref(`users/${user.uid}`);
                    recentPostsRef.once('value').then(snapshot => {
                        this.setState({ avatar: snapshot.val().avatar })
                    })
                }    
            })
    
            var recentPostsRef = firebase.database().ref('/events');
            recentPostsRef.once('value').then(snapshot => {
    
                console.log("events:" + JSON.stringify(snapshot.val()))
                this.setState({ data: snapshot.val() })
            })
            
            this.setState({
                latitude: lat,
                longitude: long
            });
        }, 
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000})
    }

    actionEventDetails = (item) => {
        this.props.navigation.navigate("EventDetails", {item: item, current_latitude: this.state.latitude, current_longitude: this.state.longitude})
    }

    actionUserList = () => {
        this.props.navigation.navigate("Invite", {route: "Event"})
    }

    renderScrollItem(item, index) {
        
        // let listPages = item.userList.map((subitem, index) => {

        //     if (index > 2) {
        //         return (
        //             <TouchableOpacity onPress={() => this.actionUserList()} >
        //                 <View style={{width: 36, height: 36, backgroundColor: color.green_color, borderRadius: 18, alignItems: 'center', justifyContent: 'center'}}>
        //                     <Text style={{color: color.white, fontSize: 12}}>+{item.userList.length - index}</Text>
        //                 </View>   
        //             </TouchableOpacity>
        //         )
        //     } else {
        //         return this.renderUserListItem(subitem, index);
        //     }
        // });   

        let distance = geolib.getDistance({latitude: this.state.latitude, longitude: this.state.longitude}, {
            latitude: item.latitude,
            longitude: item.longitude,
        })

        let miles = geolib.convertDistance(distance, 'mi').toFixed(3)
        console.log(miles)

        return (
            <TouchableOpacity onPress={() => this.actionEventDetails(item)} style={[{width: 194, marginLeft: 30}]}>
                <View style={{width: 170, height: 220, borderTopRightRadius: 30, borderBottomLeftRadius: 30, backgroundColor: color.white, paddingTop: 23, paddingLeft: 29}}>
                    <Text style={{width: 100, fontSize: 15, fontWeight: 'bold', color: color.main_color}}>{item.title}</Text>

                    <Text style={{fontSize: 14, fontWeight: 'bold', color: color.green_color, marginTop: 20}}>{(item.price == 0) ? "Free" : `$${item.price}`}</Text>
                    <Text style={{fontSize: 14, color: color.label_color, marginTop: 15}}>{miles} mi</Text>
                </View>

                {/* <View style={{flexDirection: 'row', position: 'absolute', left: 29, bottom: 25}}>
                    {listPages}
                </View> */}
            </TouchableOpacity>
        );
    }

    renderUserListItem(item, index) {
        return (
            <Image source={item.picture} style={{width: 36, height: 36, borderRadius: 18, marginRight: 6}}/>
        );
    }

    actionProfile = () => {
        this.props.navigation.navigate("Profile", {userId: App.userId, route: 'event'})
    }

    getEvent = () => {
        // var recentPostsRef = firebase.database().ref('/events');
        // recentPostsRef.once('value').then(snapshot => {
        //     console.log("events:" + JSON.stringify(snapshot.val()))
        //     // this.setState({ stores: snapshot.val() })
        // })
    }

    render() {

        const { data, avatar, latitude, longitude, city } = this.state
        
        let listPages = data.map((item, index) => {
            return this.renderScrollItem(item, index);
        });

        return (
            <View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
                <NavigationEvents
                    onWillFocus={payload => this.getEvent()} />

                {(latitude != null) ?
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={style.map}
                        customMapStyle={MapStyle}
                        region={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }} >

                        <Marker 
                            coordinate={{latitude: latitude, longitude: longitude}}>
                            
                            <View style={{width: 80, height: 80}}>
                                <Image source={ require('../../resource/ic_pin.png') } style={{resizeMode: 'stretch', width: 80, height: 80}} />
                            </View>

                        </Marker>

                        {data.length != 0 && data.map((marker, index) => (
                            <Marker
                                key={marker.title}
                                coordinate={{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)}} >

                                <MyCustomMarkerView />

                            </Marker>
                        ))} 
                    </MapView> : undefined }

                <Image source={ require("../../resource/logo.png") } style={[{width: 70, height: 19, position: 'absolute', alignSelf: 'center'}, (Platform.OS == 'android') ? {top: 5} : {top: 35}]} />

                <View style={[{flexDirection: 'row', width: windowWidth - 60, height: 70, position:'absolute'}, (Platform.OS == 'android') ? {top: 40} : {top: 70}]}>
                    <TouchableOpacity onPress={() => this.actionProfile()} >
                        {(avatar != "") ?
                            <Image source={{ uri: avatar }} style={{width: 70, height: 70, borderRadius: 35}} /> : undefined }
                    </TouchableOpacity>

                    <View style={{flex: 1, marginTop: 10}}>
                        <Text style={style.label}>Events around you</Text>
                        <Text style={style.label}>
                            <Text>in </Text>
                            <Text style={{textDecorationLine: 'underline', textDecorationColor: color.white}}>{city}</Text>
                        </Text>
                    </View>
                </View>

                <View style={{height: 220, position: 'absolute', bottom: 35}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false} >

                        {listPages}

                    </ScrollView>
                </View>

                <Loading ref="loading"/>           
            </View>
        )
    }
}

const style = StyleSheet.create({
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    label: {
        color: color.white, 
        fontSize: 14, 
        textAlign: 'right'
    }
});