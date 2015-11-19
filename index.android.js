/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  AppRegistry,
  StyleSheet,
  DeviceEventEmitter,
  Text,
  View,
} = React;

var NatModules = require("react-native-cmmc")
var {
  MQTT
} = NatModules;

var _ = require("underscore")


var devices = { };

var cmmcTest = React.createClass({
  componentWillMount: function() {
    console.log("componentWillMount");
    var that = this;

      MQTT.connect({
        host: 'cmmc.xyz',
        port: 1883,
        clientId: String((Math.random()*1000).toFixed(5)),
        username: '',
        password: '',
      }, function(err, result) {
        if (err) {
          console.log("NOT CONNECTED " + err);
        }
        else {
          MQTT.subscribe("/NatWeerawan/gearname/+/status");
        }
      });

      DeviceEventEmitter.addListener('messageArrived', function(params) {
        console.log("messageArrived", params.topic)
        try {
          var obj = JSON.parse(params.message);
          devices[obj.d.myName] = obj;
          that.setState({events: obj.d.seconds });
          // that.setState({
          //   dataSource: that.state.dataSource.cloneWithRows(_.values(devices)),
          //   loaded: false,
          // });
        }
        catch(ex) {
          console.log("ERROR", ex);
        }
      });

  },

  componentDidMount: function(){

  },

  renderRow: function(row) {
    return (
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{row.d.myName}</Text>
          <Text style={styles.year}>{row.d.seconds}</Text>
        </View>
      </View>
    );
  },

  getInitialState: function() {
    return { 
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,

    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.title}>{this.state.events}</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listView}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
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
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('cmmcTest', () => cmmcTest);
