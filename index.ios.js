/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS
} from 'react-native';

import Calendar from './components/calendar';
import Graph from './components/graph';
import History from './components/history';
import Setting from './components/setting';

export default class WatchYourBody extends Component {
  constructor(props){
    super(props);
    this.state = {
      tab : 'calendar',
    };
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          icon={{uri: 'calendar'}}
          title='Calendar'
          onPress={() => {this.setState({tab: 'calendar'});}}
          selected={this.state.tab === 'calendar'}
        >
          <NavigatorIOS style={styles.nav}
            barTintColor='#F7F7F7'
            initialRoute={{
              title: 'Calendar', 
              component: Calendar
            }}
          />

        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={{uri: 'History'}}
          title='History'
          onPress={() => {this.setState({tab: 'history'});}}
        >
          <NavigatorIOS
              barTintColor='#3D728E'
              style={styles.container}
              initialRoute={{title: 'History', component: History}}
            />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={{uri: 'Chart'}}
          title='Graph'
          onPress={() => {this.setState({tab: 'graph'});}}
        >
          <NavigatorIOS
              barTintColor='#3D728E'
              style={styles.container}
              initialRoute={{title: 'Graph', component: Graph}}
            />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={{uri : 'Settings-icon'}}
          title='Setting'
          onPress={() => {this.setState({tab: 'setting'});}}
        >
          <NavigatorIOS
              barTintColor='#3D728E'
              style={styles.container}
              initialRoute={{title: 'Setting', component: Setting}}
            />
        </TabBarIOS.Item>
      </TabBarIOS>
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
  nav: {
    flex:1,
    marginTop: 20,
  }
});

AppRegistry.registerComponent('WatchYourBody', () => WatchYourBody);
