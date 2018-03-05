/**
 * 
 * @name OneTapMemo
 * @description A app that lets u save any location with one single tap!
 * 
 * @author Henrik Hey
 * 
 * @todo Make the damn thing...
 */

//------------------------------------------------------------IMPORTS------------------------------------------------------------//

/**
 * @borrows all the core dependencies
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ListView,
  View,
  Alert,
  Modal,
  TouchableHighlight,
  Animated,
  Linking,
  TextInput,
} from 'react-native';

import * as firebase from 'firebase';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'

/**
 * @borrows the all custom dependencies
 */

const AddLocationButton = require('./components/AddLocationButton');
const ActionButton      = require('./components/ActionButton');
const StatusBar         = require('./components/StatusBar');
const ListItem          = require('./components/ListItem');
const styles            = require('./styles.js');

//------------------------------------------------------------FIREBASE------------------------------------------------------------//

// Initialize Firebase
const firebaseConfig = {
  apiKey            : "AIzaSyCuR1Dc8oRgmuARQ0pY0ctozGh-_BiIKTA",
  authDomain        : "onetapmemo.firebaseapp.com",
  databaseURL       : "https://onetapmemo.firebaseio.com/",
  projectId         : "onetapmemo",
  storageBucket     : "onetapmemo.appspot.com",
  messagingSenderId : "273187286380",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

//------------------------------------------------------------APP------------------------------------------------------------//

type Props = {};

class App extends Component<Props> {
  constructor(props) {
    super(props);
    const ds         = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.itemsRef    = firebaseApp.database().ref();
    this.Animation   = new Animated.Value(0);
    this.state       = {
      dataSource       : ds.cloneWithRows(['row 1', 'row 2']),
      visibleViewIndex : 0,
      modalVisible     : false,
      currentItem      : {},
      canEdit          : false,
      saveColor        : 'grey',             
      newTitle         : '',
      newComments      : '',
    }
  }

  /**
   * @function getLocation
   * @param callback
   * @description completes a given callback function upon recieving geo data
   */

  getLocation(callback) {
    navigator.geolocation.getCurrentPosition(callback);
  }

  /**
   * @function componentDidMount
   * @description react-native function, gets called for each mounting of a component
   */
  
  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          _key       : child.key, 
          title      : child.val().title,
          address    : child.val().address,
          linkingURL : child.val().linkingURL,                          
          comments   : child.val().comments      
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
      
    });
  }

  /**
   * @function _renderItems
   * @param    {!Obejct} => item
   * 
   * @returns  A list item with the containing data from a corresponding index within the datasource {!Array} 
   */

  _renderItem(item) {
    return (
      <ListItem item={item} onPress={()=>{
        this.setState({
          modalVisible : true,
          currentItem  : item,
        });
      }}/>
    );
  }

  _updateItem(key) {
    let updates = {};
    updates['/'+key+'/title']    = this.state.newTitle;
    updates['/'+key+'/comments'] = this.state.newComments;
    this.itemsRef.update(updates);
  }
  /**
   * @function render
   * @returns the current screen view
   */

  render() {
    
    //the background color configuration for the statusbar
    const BackgroundColorConfig = this.Animation.interpolate({
          inputRange  : [ 0, 1 ],
          outputRange : [ '#212121', '#414141' ]
      }
    );

    const { region } = this.props;
    console.log(region);

    return (

      <View style={styles.container}>

        <Animated.View style = {[ styles.MainContainer, { backgroundColor: BackgroundColorConfig } ]}>
          <StatusBar title="One Tap Memo"/>
        </Animated.View>

        {this.state.visibleViewIndex == 0 && 
          <AddLocationButton onPress={() => {
            let _this = this;
            this.getLocation(
              function (position) {
                let currentLatitude  = position.coords.latitude;
                let currentLongitude = position.coords.longitude;
                fetch(
                  'https://maps.googleapis.com/maps/api/geocode/json?address=' + 
                  currentLatitude + 
                  ',' + 
                  currentLongitude + 
                  '&key=' + 'AIzaSyCwbMCeeTZVExvge4pr_TXXpBrfYVb3ECQ'
                )
                .then((response) => response.json())
                .then((responseJson) => {
                    let location_url = ('https://www.google.com/maps/search/?api=1&query=' + 
                      currentLatitude +
                      ',' + 
                      currentLongitude +
                      '&query_place_id=' +
                      responseJson.results[0].place_id
                    );
                    let location_title = (
                      responseJson.results[0].address_components[0].long_name + ' ' + 
                      responseJson.results[0].address_components[1].long_name + ' ' +
                      responseJson.results[0].address_components[2].long_name
                    );
                    _this.itemsRef.push({ 
                      title      : location_title,                            /* Should be a {!String} storing the title of the location          */ 
                      address    : responseJson.results[0].formatted_address, /* Should be a {!String} storing the address of the location        */ 
                      linkingURL : location_url,                              /* Should be a {!String} storing the linking URL of the location    */ 
                      comments   : 'Add a comment...'                         /* Should be a {!String} storing the Users comments on the location */  
                    })
                });   
              }
            );

          }}/>
        }

        {this.state.visibleViewIndex == 1 && 
          <View style={styles.listViewContainer}>       
            <ListView dataSource={this.state.dataSource} renderRow={(rowData) => this._renderItem(rowData)} style={styles.listview} />
          </View>
        }

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: false,
              visibleViewIndex : 1,
            });
          }}>
          <View style={styles.locationModal}>
            <View>
              <View style={{backgroundColor:'#212121'}}> 
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <View style={{marginTop: '5%', marginRight: '20%'}}>
                    <Text style={styles.navbarTitle}>Location</Text>
                  </View>
                  <View style={{width: 50, height: 50, marginTop: '5%', marginRight: '1%'}}>
                    {this.state.canEdit &&
                      <Icon 
                        size={30} 
                        color="white" 
                        name="save" 
                        onPress={() => {
                          this._updateItem(this.state.currentItem._key);
                          alert("Changes have been saved!");
                        }
                      }/>
                    } 
                    {!this.state.canEdit &&
                      <Icon 
                        size={30} 
                        color="grey" 
                        name="save" 
                      />
                    } 
                  </View>
                  <View style={{width: 50, height: 50, marginTop: '5%', marginRight: '1%'}}>
                    <Icon size={30} color="white" name="edit" onPress={()=>{
                      this.setState({
                        canEdit : !this.state.canEdit,
                      });
                    }}/>
                  </View>
                  <View style={{width: 50, height: 50, marginTop: '5%', marginRight: '1%'}}>
                    <Icon size={30} color="white" name="delete-forever" onPress={()=>{
                      // Works on both iOS and Android
                      Alert.alert(
                        'Delete Location?',
                        'This location will be deleted!',
                        [
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'OK', onPress: () => {
                            this.itemsRef.child(this.state.currentItem._key).remove()
                            this.setState({
                              modalVisible: false,
                              visibleViewIndex : 1,
                            });
                          }},
                        ],
                        { cancelable: false }
                      )
                    }}/> 
                  </View>
                  <View style={{width: 50, height: 50, marginTop: '5%', marginRight: '1%'}}>
                    <Icon size={30} color="white" name="close" onPress={()=>{
                      this.setState({
                        modalVisible: false,
                        visibleViewIndex : 1,
                      });
                    }}/> 
                  </View>
                </View>
              </View>  
                  
              <ActionButton 
                title = {"View In Google Maps"}
                onPress = {() => {
                  Linking.openURL(this.state.currentItem.linkingURL);
                }}
              />

              <View   
                style={{
                  marginTop: '5%',
                  justifyContent: 'center',
                  alignItems: 'center',
              }}>
                <Icon size={50} color="red" name="location-on" />
              </View>

              <Text style={styles.locationModalItemHeader}>Title:</Text>
              <TextInput
                style={styles.locationModalItemContent}
                placeholder = {this.state.currentItem.title}
                placeholderTextColor = {'#fff'}
                editable  = {this.state.canEdit}
                onChangeText={(text) => {
                    this.setState({newTitle : text})
                  }
                }
                maxLength = {40}      
              />

              <Text style={styles.locationModalItemHeader}>Comments:</Text>
              <TextInput
                style={styles.locationModalItemContent}
                placeholder      = {this.state.currentItem.comments}
                placeholderTextColor = {'#fff'}
                multiline = {true}
                editable  = {this.state.canEdit}
                onChangeText={(text) => {
                    this.setState({newComments : text})
                  }
                }
                maxLength = {40}      
              />

              <Text style={styles.locationModalItemHeader}>Address: {this.state.currentItem.address}</Text>
            
            </View>
          </View>
        </Modal>

        <BottomNavigation
          labelColor  ="white"
          rippleColor ="white"
          style={{
              height    : 75,
              elevation : 8,
              position  : 'absolute',
              left      : 0,
              bottom    : 0,
              right     : 0
            }
          }
          onTabChange={ newTabIndex => {
              this.state.visibleViewIndex = newTabIndex;
              this.forceUpdate();
              Animated.timing(
                this.Animation, {
                  toValue  : newTabIndex,
                  duration : 650
                }
              ).start();
            }
          }>
          <Tab
            barBackgroundColor="#212121"
            label="Home"
            icon={<Icon size={24} color="white" name="home" />}
          />
          <Tab
            barBackgroundColor="#414141"
            label="Saved Locations"
            icon={<Icon size={24} color="white" name="location-on" />}
          />
        </BottomNavigation>
      </View>
    );
  }
}

export default App;