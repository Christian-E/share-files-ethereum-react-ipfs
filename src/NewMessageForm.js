import React, { Component } from 'react';
import ipfsAPI from 'ipfs-api';

class NewMessageForm extends Component{
    constructor(props){
        super(props);
        
        this.state={
          recipient:"",
          file:null,
        }

        this.ethereum = this.props.ethereum;
        this.ipfsApi = ipfsAPI('ipfs.infura.io', '5001', {protocol: "https"})
    
        this.setRecipient = this.setRecipient.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleFileChange.bind(this);
        this.saveToIpfs = this.saveToIpfs.bind(this);
      }

      setRecipient(event) {
        this.setState({recipient: event.target.value});
      }
    
      sendMessage(event) {
        event.preventDefault();
        if(this.state.file===null || this.state.recipient===""){
          alert("Bitte einen Empfänger angeben und eine Datei auswählen");
          return;
        }
    
        var reader = new FileReader();
        reader.readAsArrayBuffer(this.state.file, "UTF-8");
        reader.onload = function (event) {
            console.log(event.target.result);
            this.saveToIpfs(reader);
        }.bind(this)
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
      }
    
      handleFileChange(selectorFile){
        console.log(selectorFile);
        this.setState({file:selectorFile});
      }
    
      saveToIpfs(reader){
        let ipfsId
        const buffer = Buffer.from(reader.result)
        this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
          .then((response) => {
            ipfsId = response[0].hash
            console.log(ipfsId)
            this.ethereum.createMessage(this.state.recipient,ipfsId);
          }).catch((err) => {
            console.error(err)
          })
      }

      render() {
        return (
          <div>
            <form onSubmit={this.sendMessage}>
              <label>
                Empfänger:
                <input type="text" value={this.state.recipient} onChange={this.setRecipient} />
              </label><br/>
              <label>
                Datei:
                <input type="file" onChange={ (e) => this.handleFileChange(e.target.files[0]) } />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        );
      }
}

export default NewMessageForm;