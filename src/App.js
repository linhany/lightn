import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from './Chart';
import TopBar from './TopBar';
import ActivitySleep from './ActivitySleep';
import sad from './images/sad.png'
import { ImageSwitchVideo } from 'material-ui';
import { token } from './token.js'

class App extends Component {
  state = {
    times: [],
    values: [],
    isHidden: false
  }

  componentDidMount() {
    fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json', {
            headers: {'Authorization': 'Bearer ' + token},
        })
        .then(response => response.json())
        .then(data => this.getGraphData(data))
        .catch(err => console.log(err))

    this.callInfinity();
  }

  callInfinity = () => {
    
    var fetchNow = () => {
      fetch('https://light-n.herokuapp.com/retrieve')
      .then(response => response.json())
      .then(data => {
        this.setEmoticon();
      })
      .catch(err =>  {
        console.log("ERRORED, fetching again...")
        setTimeout(function () {
          fetchNow();
        }, 5000);
      })
    }

    fetchNow();
  }

  getGraphData(obj) {
    var fullArr=obj["activities-heart-intraday"]["dataset"];
    var lastSixtyArr=fullArr.slice(Math.max(fullArr.length - 61, 1));

    var allTimes = [];
    var values = [];
    var times = [];

    lastSixtyArr.map(item => {
      allTimes.push(item.time);
      values.push(item.value);
    })

    for (var i = 0; i < allTimes.length; i++) {
      if (i%10 == 0) {
        times.push(allTimes[i]);
      } else {
        times.push('');
      }
    }

    this.setState({times, values});
  }

  constructor(props) {
    super(props);
    this.state = {isHidden: true};

    this.setEmoticon=this.setEmoticon.bind(this);
  }

  // the api request from fitbit native app will unhide this
  setEmoticon() {
    console.log("edwdw");
    this.setState({isHidden: false});
  }

  render() {
    return (
      <div className="App" style={divStyle}>
        <TopBar />
        <div hidden={!this.state.isHidden} >
          <br />
          <br />
        </div>
        <div hidden={this.state.isHidden} >
          <br />
          <img style={imgStyle} src={sad} width="25px" height="25px" />
        </div>
        <Chart values={this.state.values} times={this.state.times} />
        <br />
        <ActivitySleep />
      </div>
    );
  }
}

var divStyle = {
  paddingRight: "10%",
  paddingLeft: "10%",
};

var imgStyle = {
  float: "right",
};

export default App;
