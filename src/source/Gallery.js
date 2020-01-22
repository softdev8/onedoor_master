
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';
import { color, windowWidth, windowHeight } from "./styles/theme"

import firebase from 'react-native-firebase'
import Loading from 'react-native-whc-loading'
import { App } from "./Global"
import RNThumbnail from 'react-native-thumbnail';

var chatId, receiverId, attachPage

export default class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      selected: [],
    };

    this.getSelectedImages = this.getSelectedImages.bind(this);
  }

  getSelectedImages(images, current) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    }, () => {
      if (attachPage == "conversation") {
        this.sendMessageAttach(this.state.selected)
      }
    });
  }

  async sendMessageAttach(attachItems) {

    var obj = this
    var loading = this.refs.loading 
    loading.show(); 

    if (attachItems.length != 0) {
      attachItems.map((item, index) => {

          const uploadUri = Platform.OS === 'ios' ? item.uri.replace('file://', '') : item.uri

          var path = uploadUri.split(".")
          var extension = path[path.length - 1]

          var file_type = "video"
          if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") {
            file_type = "image"
          }

          var time = new Date().getTime()

          firebase.storage()
              .ref(`message/${file_type}_${time}`)
              .putFile(uploadUri)
              .then(uploadedFile => {
                  // console.log(uploadedFile.downloadURL);

                  if (file_type == "video") {

                    RNThumbnail.get(uploadUri).then((result) => {
                      const thumbnailUrl = Platform.OS === 'ios' ? result.path.replace('file://', '') : result.path 

                      firebase.storage()
                          .ref(`message/thumbnail_${time}`)
                          .putFile(thumbnailUrl)
                          .then(uploadedThumbFile => {

                            let conversation = {created_at: time, message: null, senderId: App.userId, receiverId: receiverId, attach: {"file" : uploadedFile.downloadURL, "thumbnail" : uploadedThumbFile.downloadURL, "isPhoto" : (file_type == "image") ? true : false}}
                            obj.addStorage(chatId, conversation)
                      })
                    })                                   
                  } else {
                    let conversation = {created_at: time, message: null, senderId: App.userId, receiverId: receiverId, attach: {"file" : uploadedFile.downloadURL,  "isPhoto" : (file_type == "image") ? true : false}}

                    obj.addStorage(chatId, conversation)
                  }
              })
              .catch(err => {
                  loading.close();
                  console.log("upload error : " +err);
              });
      })
    }
  }

  addStorage(chatId, conversation) {

    console.log(conversation)

    var navigation = this.props.navigation
    var loading = this.refs.loading 

    const conversationRef = firebase.database().ref().child('conversation');
    conversationRef.child('counter').transaction(function(currentValue) {
      return (currentValue||1000) + 1
    },function(err, committed, ss){
      if(err){
          console.log(err)
      }
      else if(committed){
          var conversation_id = ss.val()

          conversationRef.child(`${chatId}`).child(conversation_id).update({...conversation})
          .then(() => {
              loading.close();
              navigation.navigate("Conversation")
          })
      }
    })
  }

  actionBack = () => {
    if (attachPage == "conversation") {
      this.props.navigation.navigate("Conversation")
    } else {
      this.props.navigation.navigate("Post", {selectedItem: this.state.selected})
    }
  }

  render() {

    const {selected, num} = this.state

    const {navigation} = this.props
    let assetType = (navigation.state.params.index == 0) ? "Photos" : "Videos"
    attachPage = navigation.state.params.page

    if (navigation.state.params.chatId) {
      chatId = navigation.state.params.chatId  
    }
    if (navigation.state.params.receiverId) {
      receiverId = navigation.state.params.receiverId  
    }
    

    return (
      <View style={styles.container}>
        <Image source={ require("../resource/logo.png") } style={[{width: 70, height: 19, position: 'absolute', alignSelf: 'center'}, (Platform.OS == 'android') ? {top: 5} : {top: 35}]} />
        <View style={[styles.content, {flexDirection: 'row'}]}>
          <TouchableOpacity onPress={() => this.actionBack()} style={{paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10}}>
              <Image source={ require("../resource/ic_back.png") } style={[{width: 10, height: 17}]} />
          </TouchableOpacity>
          <Text style={styles.text}>
            <Text style={styles.bold}> {num} </Text> {assetType} has been selected
          </Text>
        </View>
        <CameraRollPicker
          groupTypes='All'
          maximum={3}
          selected={selected}
          assetType={assetType}
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages} />

          <Loading ref="loading"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.main_color,
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
});


