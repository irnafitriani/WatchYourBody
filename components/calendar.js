'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Dimensions,
  AsyncStorage
} from 'react-native';

import CalendarPicker from 'react-native-calendar-picker';
import CalendarDetail from './calendarDetail';


export default class Calendar extends Component{
    constructor(props){
   super(props);
   this.state = {
     date: new Date(),
   };
 }

ComponentDidMount(){
  AsyncStorage.getItem("dateSelected").then((value) => {
    this.setState({"dateSelected": value});
  }).done();
}

 _onSaveButtonPressed(){
   console.log("abcd");
        AsyncStorage.setItem("weight", this.state.formData.weight);
        this.setState({"weight":this.state.formData.weight});
        console.log("w " + this.props.weight);
        AsyncStorage.setItem("height",this.state.formData.height);
        this.setState({"height":this.state.formData.height});
        console.log("h " + this.props.height);
 }
 
onDateChange(date){
  AsyncStorage.setItem("dateSelected", date.toLocaleDateString());
  this.setState({"dateSelected":date.toLocaleDateString()});
   this.setState({date: date});
   this.props.navigator.push({
     title: "Detail",
     component: CalendarDetail,
     passProps: { dateSelect: this.state.date,
       ref : (component => {this.pushedComponent = component})},
     rightButtonTitle:'Save',
     onRightButtonPress:() => {this.pushedComponent}
   });
 }

 render(){
    const { date } = this.state;
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
    const month = new Array(12);
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Des";
     return(
         <View style={styles.container}>
            <View style={styles.selectedDateView}>
                      <Text style={{fontSize:66, textAlign:'center', color:'white'}}>{month[date.getMonth()]}</Text>
                      <Text style={{textAlign:'center',color:'white', fontSize:15}}>{weekday[date.getDay()]}</Text>
                      <Text style={{fontSize:66, textAlign:'center', color:'white'}}>{date.getDate()}</Text>
                      <Text style={{textAlign:'center',color:'white',fontSize:15}}>{date.getFullYear()}</Text>
            </View> 
            <CalendarPicker navigator={this.props.navigator}
                  selectedDate={this.state.date}
                  onDateChange={this.onDateChange.bind(this)}
                  screenWidth={Dimensions.get('window').width}
                  selectedBackgroundColor={'blue'} />
        </View>
     );
 }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  selectedDateView: {
    backgroundColor: 'blue',
    marginLeft: 3,
    marginRight: 3,
    marginTop: 0,
    width: Dimensions.get('window').width,
    height: 250,
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});