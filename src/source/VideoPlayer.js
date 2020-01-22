'use strict';
import React, {
  Component
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  View,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';

import Video from 'react-native-video';
import { color, windowWidth } from "./styles/theme"

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isNav: false
    }
  }

  render() {

    const {goBack} = this.props.navigation
    let video_link = this.props.navigation.state.params.video_link

    return <View 
            style={styles.container}>
            <Video
                ref={p => { this.videoPlayer = p; }}
                source={{uri: video_link}}
                style={{backgroundColor: color.main, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                controls={true}
            />

            <View style={{position: 'absolute', left: 0, top: 0, backgroundColor: color.main_color, width: windowWidth, height: 70}}>
                <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, alignSelf: 'center'}, (Platform.OS == 'android') ? {marginTop: 5} : {marginTop: 35}]} />
                <View style={{flexDirection: 'row', width: windowWidth - 60, marginLeft: 15, alignItems: 'center', marginTop: 15}}>
                    <TouchableOpacity onPress={() => goBack()} style={styles.backBtnPadding}>
                        <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
                    </TouchableOpacity>
                </View>
            </View>
        
    </View>
  }
  onPress() {
    if (this.videoPlayer!=null)
      this.videoPlayer.presentFullscreenPlayer();
  }

  actionBack = (router) => {
      this.props.navigation.navigate(router);
  }

//   actionClick = () => {
//     this.setState({
//         isNav: !this.state.isNav
//     })
//   }
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.main_color,
  },
});