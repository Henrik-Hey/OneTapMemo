'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const styles = require('../styles.js')
const constants = styles.constants;
const { 
    StyleSheet, 
    Text, 
    View, 
    TouchableHighlight
} = ReactNative;

class AddLocationButton extends Component {
  render() {
    return (
        <View style={styles.addLocationContainer}>
            <TouchableHighlight 
                style={styles.addLocation}
                underlayColor={constants.actionColor}
                onPress={this.props.onPress}>
                <View>
                    <Text style={styles.addLocationText}>+</Text>
                </View>
            </TouchableHighlight>
      </View>
    );
  }
}

module.exports = AddLocationButton;