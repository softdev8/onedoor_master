import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, NavigationActions} from 'react-navigation'

import WalkThrough from "./src/source/WalkThrough";
import Sign from "./src/source/Sign";

import Event from "./src/source/event/Event";
import Ticket from "./src/source/ticket/TabStack";
import Feed from "./src/source/feed/TabStack";
import ChatList from "./src/source/chat/TabStack";

import EventDetails from "./src/source/EventDetails";
import PaymentDetails from "./src/source/PaymentDetails";
import Profile from "./src/source/Profile";
import FriendProfile from "./src/source/FriendProfile";
import Invite from "./src/source/Invite";
import Comment from "./src/source/Comment";
import Post from "./src/source/Post";
import Conversation from "./src/source/Conversation";
import Gallery from "./src/source/Gallery";
import FullScreenImage from "./src/source/FullScreenImage";
import VideoPlayer from "./src/source/VideoPlayer";
import ForgotPassword from "./src/source/ForgotPassword";
import MyCamera from "./src/source/MyCamera";

import { color, windowWidth } from "./src/source/styles/theme"

import SplashScreen from 'react-native-splash-screen'

const TabStack = createBottomTabNavigator({
    
  Event: {
      screen: Event,
      navigationOptions: ({navigation}) => ({
        header: null,
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      })
  },
  Ticket: {
      screen: Ticket,
      navigationOptions: ({navigation}) => ({
        header: null,
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      })
  },
  Feed: {
      screen: Feed,
      navigationOptions: ({navigation}) => ({
        header: null,
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      })
  },
  ChatList: {
      screen: ChatList,
      navigationOptions: ({navigation}) => ({
        header: null,
        gesturesEnabled: false,
        drawerLockMode: 'locked-open'
      })
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      console.log('onPress:', navigation.state.routeName);

      navigation.dispatch(NavigationActions.navigate({ routeName: navigation.state.routeName }));
      
      defaultHandler()
    },
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      
      if (routeName == "Event") {
        return <Image source={require('./src/resource/tab_map.png')} style={{ width: 25, height: 25 }} />    
      } else if (routeName == "Ticket") {
          return <Image source={require('./src/resource/tab_ticket.png')} style={{ width: 18, height: 25 }} />    
      } else if (routeName == "Feed") {
        return (        
          <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
            <Image source={require('./src/resource/tab_notification.png')} style={{ height: 24, width: 25 }} />
            <View style={{ position: 'absolute', right: -8, top: -3, backgroundColor: color.white, borderRadius: 2.5, width: 5, height: 5, justifyContent: 'center', alignItems: 'center' }} />
          </View> 
        );
        // return <Image source={require('./src/resource/tab_notification.png')} style={{ width: 24, height: 25 }} />    
      } else if (routeName == "ChatList") {
        return (        
          <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
            <Image source={require('./src/resource/tab_chat.png')} style={{ height: 24, width: 24 }} />
            <View style={{ position: 'absolute', right: -8, top: -3, backgroundColor: color.white, borderRadius: 2.5, width: 5, height: 5, justifyContent: 'center', alignItems: 'center' }} />
          </View> 
        );  
        // return <Image source={require('./src/resource/tab_chat.png')} style={{ width: 24, height: 24 }} />    
      } 
    },
  }),    
  tabBarOptions: {
      showLabel: false,
      activeTintColor: 'white',
      activeBackgroundColor: color.main_color,
      inactiveTintColor: 'gray',
      height: 70,
      style: {
          backgroundColor: color.bg_color,
          shadowOffset: { width: 5, height: 1 },
          shadowColor: 'white',
          shadowOpacity: 0.5,
          elevation: 5
      }
  }
});

const HomeStack = createStackNavigator({
  WalkThrough: {
    screen: WalkThrough,
    navigationOptions: {
      header: null
  }},
  Sign: { screen: Sign,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  TabStack: { screen: TabStack,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  EventDetails: { screen: EventDetails,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  PaymentDetails: { screen: PaymentDetails,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Profile: { screen: Profile,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  FriendProfile: { screen: FriendProfile,
    navigationOptions: ({navigation}) => ({
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Invite: { screen: Invite,
    navigationOptions: ({navigation}) => ({
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Comment: { screen: Comment,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Post: { screen: Post,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Conversation: { screen: Conversation,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  Gallery: { screen: Gallery,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  FullScreenImage: { screen: FullScreenImage,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  VideoPlayer: { screen: VideoPlayer,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  ForgotPassword: { screen: ForgotPassword,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  },
  MyCamera: { screen: MyCamera,
    navigationOptions: ({navigation}) => ({
      header: null,
      gesturesEnabled: false,
      drawerLockMode: 'locked-open'
    })
  }
});

const App = createAppContainer(HomeStack);

export default class AppNavigation extends Component {

  componentDidMount() {
    // do stuff while splash screen is shown
      // After having done stuff (such as async tasks) hide the splash screen
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
  }

  render() {

    return (
      <App />      
    );
  }
}