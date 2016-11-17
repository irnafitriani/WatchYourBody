/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

export default class WatchYourBody extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TabBarIOS>
          <TabBarIOS.item icon={{}} title='Calendar'></TabBarIOS.item>
          <TabBarIOS.item icon={{}} title='History'></TabBarIOS.item>
          <TabBarIOS.item icon={{}} title='Graph'></TabBarIOS.item>
          <TabBarIOS.item icon={{}} title='Setting'></TabBarIOS.item>
        </TabBarIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('WatchYourBody', () => WatchYourBody);
