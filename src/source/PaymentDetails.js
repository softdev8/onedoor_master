import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Platform, ScrollView, TextInput, TouchableOpacity} from 'react-native';

import { styles, color, windowWidth } from "./styles/theme"

let paymentData = [
    {
        img_link: require('../resource/visa.png')
    },
    {
        img_link: require('../resource/mastercard.png')
    },
    {
        img_link: require('../resource/express.png')
    },
    {
        img_link: require('../resource/paypal.png')
    }
]

export default class PaymentDetails extends Component {

    constructor(props) {
        super(props);

    }

    actionBack = () => {
        this.props.navigation.navigate("EventDetails")
    }

    renderScrollItem(item, index) {
        return (
            <View>
                <Image source={ item.img_link } style={{width: 70, height: 70, marginRight: 25}} />
            </View>
        );
    }

    render() {

        let listPages = paymentData.map((item, index) => {
            return this.renderScrollItem(item, index);
        });

        return (
            <View style={styles.container}>
                <View style={{backgroundColor: '#181D27'}}> 
                    <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == "android") ? {marginTop: 5} : {marginTop: 35}]} />
                    
                    <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, marginTop: 15, alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.actionBack()} style={styles.backBtnPadding}>
                            <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                        </TouchableOpacity>
                        <Text style={{flex: 1, color: color.white, fontSize: 16, fontWeight: 'bold', marginLeft: 30}}>Payment Details</Text>
                    </View>

                    <View style={{height: 70, marginLeft: 60, marginTop: 40, marginBottom: 40}}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false} >

                            {listPages}

                        </ScrollView>
                    </View>
                </View>

                <View style={[style.input_view]}>
                    <TextInput style={[style.text_input]}
                        underlineColorAndroid = "transparent"
                        placeholder = "Full name"
                        placeholderTextColor = {color.white}
                        autoCapitalize = "none" />
                </View>

                <View style={[style.input_view, {marginTop: 25}]}>
                    <TextInput style={[style.text_input]}
                        underlineColorAndroid = "transparent"
                        placeholder = "2679 2679 2679 2679"
                        placeholderTextColor = {color.white}
                        autoCapitalize = "none" />
                </View>

                <View style={[style.input_view, {marginTop: 25}]}>
                    <TextInput style={[style.text_input]}
                        underlineColorAndroid = "transparent"
                        placeholder = "08/18"
                        placeholderTextColor = {color.white}
                        autoCapitalize = "none" />
                </View>

                <View style={[style.input_view, {marginTop: 25}]}>
                    <TextInput style={[style.text_input]}
                        underlineColorAndroid = "transparent"
                        placeholder = "CVV"
                        placeholderTextColor = {color.white}
                        autoCapitalize = "none" />
                </View>

                <View style={{width: 200, height: 50, backgroundColor: color.white, borderRadius: 25, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', marginTop: 35, marginRight: 30}}>
                    <Text style={{fontSize: 16, color: color.main_color}}>Pay</Text>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    input_view: {
        height: 46, 
        width: windowWidth - 90, 
        marginLeft: 60,
        borderRadius: 23, 
        borderColor: '#BDC2C8',
        borderWidth: 1,
        marginTop: 30
    },
    text_input: {
        flex: 1, 
        height: 46,
        color: color.white,
        fontSize: 14,
        paddingLeft: 30
    },
});

