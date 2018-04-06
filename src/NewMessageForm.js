import React, { Component } from 'react';
import './NewMessageForm.css';
import EthereumRemote from './Ethereum';
import ipfsAPI from 'ipfs-api';
import{MDCTextField} from '@material/textfield';
import {MDCSnackbar} from '@material/snackbar';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class NewMessageForm extends Component{
    constructor(props){
        super(props);
        
        this.state={
          recipient:"",
          file:null,
          disabled:false,
        }

        this.ethereum = new EthereumRemote(); 
        this.ipfsApi = ipfsAPI('ipfs.infura.io', '5001', {protocol: "https"})
    
        this.setRecipient = this.setRecipient.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleFileChange.bind(this);
        this.saveToIpfs = this.saveToIpfs.bind(this);
        this.displayTransaction = this.displayTransaction.bind(this);
      }

      componentDidMount(){
        MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
        this.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
      }

      setRecipient(event) {
        this.setState({recipient: event.target.value});
        this.setState({disabled:false});
      }
    
      sendMessage(event) {
        event.preventDefault();
        if(this.state.file===null || this.state.recipient===""){
          this.snackbar.show({message:"Bitte eine Datei auswählen",actionText:"Ok"});
          return;
        }
    
        var reader = new FileReader();
        reader.readAsArrayBuffer(this.state.file, "UTF-8");
        reader.onload = function (event) {
            console.log(event.target.result);
            this.saveToIpfs(reader, this.state.file.name);
        }.bind(this)
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
      }
    
      handleFileChange(selectorFile){
        console.log(selectorFile);
        this.setState({file:selectorFile});
        this.setState({disabled:false});
      }
      
      displayTransaction(transaction){
        this.setState({disabled:true});
        console.log(transaction);
        this.snackbar.show({message:"Transaktion wurde erstellt: "+transaction.tx,actionText:"Ok"});
      }

      saveToIpfs(reader, fileName){
        let ipfsHashString
        const buffer = Buffer.from(reader.result)
        this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
          .then((response) => {
            ipfsHashString = response[0].hash
            console.log(ipfsHashString)
            this.ethereum.createMessage(this.state.recipient,ipfsHashString, fileName, this.displayTransaction);
          }).catch((err) => {
            console.error(err)
          })
      }

      render() {
        return (
          <div>
          <header className="mdc-toolbar">
            <div className="mdc-toolbar__row">
              <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                <Link to="/">
                  <i className="material-icons mdc-toolbar__menu-icon">arrow_back</i>
                </Link>
                <span className="mdc-toolbar__title">Dokument versenden</span>
              </section>
            </div>
          </header>
          <form onSubmit={this.sendMessage}>
          <div className="mdc-layout-grid">
            <div className="mdc-layout-grid__inner">
              <div className="mdc-layout-grid__cell--span-6">
                <div className="mdc-text-field--with-leading-icon mdc-text-field fullwidth">
                  <i className="material-icons mdc-text-field__icon">person</i>
                  <input type="text" id="my-text-field" className="mdc-text-field__input" value={this.state.recipient} onChange={this.setRecipient} required pattern="^0x[a-fA-F0-9]{40}$"/>
                  <label className="mdc-floating-label" htmlFor="my-text-field">Empfänger</label>
                  <div className="mdc-line-ripple"></div>
                </div>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent" aria-hidden="true">
                  Muss eine gültige Ethereum-Adresse sein
                </p>
              </div>
              <div className="mdc-layout-grid__cell--span-12">
                  <input type="file" onChange={ (e) => this.handleFileChange(e.target.files[0]) } id="fileSelect" className="inputfile" />
                  <label className="mdc-button mdc-button--raised" htmlFor="fileSelect">
                    <i className="material-icons mdc-button__icon">file_upload</i>
                    {!!this.state.file ? this.state.file.name : "Datei auswählen"}
                  </label>
              </div>
              <div className="mdc-layout-grid__cell--span-12">
                <div className="mdc-form-field">
                  {this.state.disabled
                  ?
                    <input type="submit" value="Absenden" className="mdc-button mdc-button--raised" disabled />
                  :
                    <input type="submit" value="Absenden" className="mdc-button mdc-button--raised"  />
                  }
                </div>
              </div>
            </div>
          </div>
          </form>

          <div className="mdc-snackbar"
              aria-live="assertive"
              aria-atomic="true"
              aria-hidden="true">
            <div className="mdc-snackbar__text"></div>
            <div className="mdc-snackbar__action-wrapper">
              <button type="button" className="mdc-snackbar__action-button"></button>
            </div>
          </div>
          </div>
        );
      }
}

export default NewMessageForm;