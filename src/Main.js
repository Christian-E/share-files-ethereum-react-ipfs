import React, { Component } from 'react';
import EthereumRemote from './Ethereum';
import MessageList from './MessageList';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {

  constructor(props){
    super(props);
    
    this.state={
      received:[],
      sent:[],
    }
    this.ethereum = new EthereumRemote();    

    this.addReceivedMessageToState  =this.addReceivedMessageToState.bind(this);
    this.addSentMessageToState = this.addSentMessageToState.bind(this);
  }

  componentWillMount(){  
    this.setState({received:[]});  
    this.ethereum.getReceivedMessages(this.addReceivedMessageToState);
    this.setState({sent:[]});
    this.ethereum.getSentMessages(this.addSentMessageToState);
  }

  addReceivedMessageToState(message){
    this.setState({received:[...this.state.received, message]});
  }

  addSentMessageToState(message){
    this.setState({sent:[...this.state.sent, message]});
  }

  render() {
    return (
      <div>
        <header className="mdc-toolbar">
            <div className="mdc-toolbar__row">
                <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                <span className="mdc-toolbar__title">d.chain - Dokumente sicher teilen</span>
                </section>
            </div>
        </header>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell--span-6">
              <MessageList messages={this.state.received} listType="received"/>
            </div>
            <div className="mdc-layout-grid__cell--span-6">
              <MessageList messages={this.state.sent} listType="sent"/>
            </div>
          </div>
        </div>
        <Link to="/new">
            <button className="mdc-fab material-icons app-fab--absolute" aria-label="Favorite">
            <span className="mdc-fab__icon">
                send
            </span>
            </button>
        </Link>
        
      </div>
        
        
      
    );
  }
}

export default Main;
