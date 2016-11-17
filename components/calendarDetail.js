'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Dimensions,
  TextInput,
  Switch,
  ScrollView,
  AlertIOS,
  ListView,
  AsyncStorage
} from 'react-native';

import {
    Form,
    InputField,
    LinkField,
    SwitchField,
    PickerField,
    DatePickerField,
    TimePickerField
}from 'react-native-form-generator';
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);
SQLite.enablePromise(false);

// import Icon from 'react-native-vector-icons/Ionicons';

const database_name = "WatchYourBody.db";
const database_version = "1.0";
const database_displayname = "WatchYourBody Database";
const database_size = 200000;
var  db;


export default class CalendarDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            date: this.props.dateSelect,
            formData:{},
            bmiValue:0,
            bmiCategory:"",
            progress:[],
            datasource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }

    ComponentDidMount(){
        
        AsyncStorage.getItem("weight").then((weight) => {
            this.setState({"weight": weight});
        }).done();

        AsyncStorage.getItem("height").then((height) => {
            this.setState({"weight": height});
        }).done();
    }

    _onSaveButtonPressed(){
        AsyncStorage.setItem("weight", this.state.formData.weight);
        this.setState({"weight":this.state.formData.weight});
        console.log("w " + this.props.weight);
        AsyncStorage.setItem("height",this.state.formData.height);
        this.setState({"height":this.state.formData.height});
        console.log("h " + this.props.height);
/*
        fetch("http://localhost:3000/api/BMIData",{method: "POST", body: JSON.stringify(
            {
                date:this.state.formData.date,
                weight:this.state.weight, 
                height: this.state.height
            })}).then((response) => response.json())
            .then((responseData) => {
                AlertIOS.alert(
                    "POST Response",
                    "Response Body ->" + JSON.stringify(responseData.body)
                )
            }).done();*/
    }      

/* Database */

    componentWillUnmount(){
        console.log("test");
         var route = this.props.navigationContext.currentRoute;
        route.onRightButtonPress = () =>{
            this._onSaveButtonPressed();
        };

        this.props.navigator.replace(route);
        this.closeDatabase();
    }

    errorCB(err){
        console.log("error: ", err);
        this.state.progress.push("Error: " +(err.message || err));
        this.setState(this.state);
        return false;
    }

    successCB(){
        console.log("SQL executed");
    }

    openCB(){
        this.state.progress.push("Database OPEN");
        this.setState(this.state);
    }

    closeCB(){
        this.state.progress.push("Database CLOSED");
        this.setState(this.state);
    }

    deleteCB(){
        console.log("Database DELETED");
        this.state.progress.push("Database DELETED");
        this.setState(this.state);
    }

    populateDatabase(db){
        var that = this;
        that.state.progress.push("Database integrity check");
        that.setState(that.state);
        db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
            function () {
                that.state.progress.push("Database is ready ... executing query ...");
                that.setState(that.state);
                db.transaction(that.queryEmployees,that.errorCB,function() {
                    that.state.progress.push("Processing completed");
                    that.setState(that.state);
                });
            },
            function (error) {
                console.log("received version error:", error);
                that.state.progress.push("Database not yet ready ... populating data");
                that.setState(that.state);
                db.transaction(that.populateDB, that.errorCB, function () {
                    that.state.progress.push("Database populated ... executing query ...");
                    that.setState(that.state);
                    db.transaction(that.queryEmployees,that.errorCB, function () {
                        console.log("Transaction is now finished"); 
                        that.state.progress.push("Processing completed");
                        that.setState(that.state);
                        that.closeDatabase();
                    });
                });
            });
    }

    populateDB(tx) {
        this.state.progress.push("Executing DROP WatchYourBody");
        this.setState(this.state);

        tx.executeSql('DROP TABLE IF EXISTS WatchYourBody;');

        this.state.progress.push("Executing CREATE WatchYourBody");
        this.setState(this.state);

        tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
            + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB);

        tx.executeSql('CREATE TABLE IF NOT EXISTS WatchYourBody( '
            + 'id INTEGER PRIMARY KEY NOT NULL, '
            + 'date DATE, '
            + 'weight FLOAT, '
            + 'height FLOAT, ');

        this.state.progress.push("Executing INSERT WatchYourBody");
        this.setState(this.state);
        console.log("all config SQL done");
    }

    queryEmployees(tx) {
        console.log("Executing sql...");
        tx.executeSql('SELECT a.name, b.name as deptName FROM Employees a, Departments b WHERE a.department = b.department_id and a.department=?', [3], 
            this.queryEmployeesSuccess,this.errorCB);
        //tx.executeSql('SELECT a.name, from TEST', [],() => {},this.errorCB);
    }

    queryEmployeesSuccess(tx,results) {
        this.state.progress.push("Query completed");
        this.setState(this.state);
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            this.state.progress.push(`Empl Name: ${row.name}, Dept Name: ${row.deptName}`);
        }
        this.setState(this.state);
    }

    loadAndQueryDB(){
        this.state.progress.push("Opening database ...");
        this.setState(this.state);
        db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
        this.populateDatabase(db);
    }

    deleteDatabase(){
        this.state.progress = ["Deleting database"];
        this.setState(this.state);
        SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
    }

    closeDatabase(){
        var that = this;
        if (db) {
            console.log("Closing database ...");
            that.state.progress.push("Closing database");
            that.setState(that.state);
            db.close(that.closeCB,that.errorCB);
        } else {
            that.state.progress.push("Database was not OPENED");
            that.setState(that.state);
        }
    }

    runDemo(){
        this.state.progress = ["Starting SQLite Demo"];
        this.setState(this.state);
        this.loadAndQueryDB();
    }

    handleFormChange(formData){

        this.setState({formData:formData});
        this.props.onFormChange && this.props.onFormChange(formData);
         console.log(formData);
    }

    handleFormFocus(e, component){
        console.log("handle");
    }

    calculateBMI(){
        var weight = this.state.formData.weight;
        var height = this.state.formData.height/100;
        var value = weight/height/height;
        this.setState({bmiValue:Math.round(value*100)/100});
        if (value < 18.5){
            this.setState({bmiCategory:"Underweight"})
        }else if (18.5 <= value <= 24.9 ){
            this.setState({bmiCategory:"Normal weight"})
        }else if (25 <= value <= 29.9){
            this.setState({bmiCategory:"Overweight"})
        }else{
            this.setState({bmiCategory:"Obesity"})
        }
    }

    render(){
        return(
            <ScrollView keyboardShouldPersistTaps={true} style={{paddingLeft:10,paddingRight:10, height:200}}>
                <Form ref="form"
                    onFocus={this.handleFormFocus.bind(this)}
                    onChange={this.handleFormChange.bind(this)}
                    label>
                    <DatePickerField ref='date' placeholder='Date'
                        minimumDate={new Date('1/1/1900')}
                        maximumDate={new Date()}
                        mode='date'
                        date = {this.state.date}
                        />
                    <InputField ref='weight' label='Weight' placeholder='Weight' value={this.state.weight}/>
                    <InputField ref='height' label='Height' placeholder='Height' value={this.state.height}/>
                </Form>
            <View style={styles.calculate}>
                <TouchableHighlight style={styles.calculatebutton} onPress={this.calculateBMI.bind(this)}>
                    <View style={[{
                    backgroundColor:'blue',
                        flex:1, alignItems:'center',
                        borderColor:'#2398c9',
                        borderWidth:1,
                        width:100,
                        marginLeft:10,
                        marginTop:10
                    },
                ]}>
                    <Text style={{fontSize:13,padding:10,color:'white'}}>Calculate</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.BMILabel}>
                    <View style={[{
                    backgroundColor:'grey',
                        flex:1, alignItems:'flex-start',
                        borderColor:'#2398c9',
                        borderWidth:1,
                        width:130,
                        marginRight:10,
                        marginTop:10
                    },
                ]}>
                    <Text style={{fontSize:13,padding:10,color:'white'}}>BMI:  {this.state.bmiValue}</Text>
                    </View>
                </TouchableHighlight>
            </View>
                

         <TouchableHighlight>
          <View style={[{
            backgroundColor:'grey',
              flex:1, alignItems:'center',
              borderColor:'#2398c9',
              borderWidth:1,
              width:400,
              marginTop: 30
            },
          ]}>
          <Text style={{fontSize:15,padding:10,color:'white'}}>Body Mass Index Category:{this.state.bmiCategory}</Text></View>
        </TouchableHighlight>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  input: {
      width: 500,
      padding: 12,
      margin: 8,
      backgroundColor: 'grey'
  },
  calculate:{
      flexDirection:'row'
  },
  calculatebutton:{
      flex:1
  },
  BMILabel:{
      flex:0
  }
});