import React, { Component } from 'react';
import './App.css';
import EthereumRemote from './Ethereum';
import NewMessageForm from './NewMessageForm';

class App extends Component {

  constructor(props){
    super(props);
    
    this.state={
      received:[],
      sent:[],
      recipient:"",
      file:null,
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

  addReceivedMessageToState(id, message){
    this.setState({received:[...this.state.received, [id, ...message]]});
  }

  addSentMessageToState(id, message){
    this.setState({sent:[...this.state.sent, [id, ...message]]});
  }

  render() {
    //<a download="test123" href={"https://ipfs.infura.io/ipfs/"+message[1]}>Dokument öffnen</a>
    let received = this.state.received.map((message)=>
      <a download="test123" href={"https://ipfs.infura.io/ipfs/"+message[1]} key={message[0]}>
        <li className="mdc-list-item" >
          <span className="mdc-list-item__text">
          {message[1]}
            <span className="mdc-list-item__secondary-text">
            {"Von: " + message[2]}
            </span>
          </span>
        </li>
      </a>
    )
    let sent = this.state.sent.map((message)=>
      <a download="test123" href={"https://ipfs.infura.io/ipfs/"+message[1]} key={message[0]}>
        <li className="mdc-list-item" >
          <span className="mdc-list-item__text">
          {message[1]}
            <span className="mdc-list-item__secondary-text">
            {"An: " + message[3]}
            </span>
          </span>
        </li>
      </a>
    );
    return (
      <div>
        <header className="mdc-toolbar">
          <div className="mdc-toolbar__row">
            <section className="mdc-toolbar__section">
              <span className="mdc-toolbar__title">d.chain - Dokumente sicher teilen</span>
            </section>
          </div>
        </header>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell--span-6">
              <h1 className="mdc-typography--title">Empfangen</h1>
              <ul className="mdc-list mdc-list--two-line">
                {received}
              </ul>
            </div>
            <div className="mdc-layout-grid__cell--span-6">
              <h1 className="mdc-typography--title">Gesendet</h1>
              <ul className="mdc-list mdc-list--two-line">
                {sent}
              </ul>
            </div>
          </div>
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell--span-4">
            <NewMessageForm ethereum={this.ethereum}/>
            </div>
          </div>
        </div>
      </div>
        
        
      
    );
  }
}

export default App;
