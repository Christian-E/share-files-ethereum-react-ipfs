import React, { Component } from 'react';

class MessageList extends Component {

  render() {
    let secondaryCaption;
    if(this.props.listType==="received"){
      secondaryCaption = "Von";
    }else{
      secondaryCaption = "An";
    }
    let title;
    if(this.props.listType==="received"){
      title = "Empfangen";
    }else{
      title = "Gesendet";
    }

    let messages = this.props.messages.slice(0).reverse().map((message)=>
      <a download={message.fileName} href={"https://ipfs.infura.io/ipfs/"+message.ipfsHash} key={message.id}>
        <li className="mdc-list-item" >
          <span className="mdc-list-item__text">
          {message.fileName}
            <span className="mdc-list-item__secondary-text">
            {secondaryCaption + ": " + (this.props.listType==="received"?message.sender:message.recipient)}
            </span>
          </span>
        </li>
      </a>
    )
    return (
    <div>
        <h1 className="mdc-typography--title">{title}</h1>
        <ul className="mdc-list mdc-list--two-line">
            {messages}
        </ul>
    </div>
    );
  }
}

export default MessageList;
