import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import ChatList from "./ChatList";

const Navigation = createStackNavigator({
    
    ChatList: { screen: ChatList ,
        navigationOptions: {
            header: null
        }
    },

}, {
    initialRouteName: 'ChatList',
    /* The header config from FirstScreen is now here */
    navigationOptions: {

        headerStyle: {
            backgroundColor: '#fbf1dc',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
});

const TabStack = createAppContainer(Navigation);

export default TabStack;

