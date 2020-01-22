import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {RNCamera} from 'react-native-camera';

import { color, windowWidth, windowHeight } from "./styles/theme"

export default class MyCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
       <RNCamera
           ref={(cam) => {
             this.camera = cam;
           }}
           style={styles.preview}
           ratio={"4:3"} >
           <Text style={styles.capture} onPress={() => this.takePicture()}>[CAPTURE]</Text>
       </RNCamera>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: false };
      const data = await this.camera.takePictureAsync(options);
      console.warn('takePicture ', data);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
   flex: 1,
   justifyContent: 'flex-end',
   alignItems: 'center',
   height: windowHeight,
   width: windowWidth
 },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});