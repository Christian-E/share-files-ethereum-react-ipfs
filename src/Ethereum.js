import Web3 from 'web3'
import TruffleContract from 'truffle-contract';

class EthereumRemote{
    constructor(){
        //den Provider aus MetaMask holen 
        this.web3Provider = Web3.givenProvider;

        //web3 initialisieren
        this.web3 = new Web3(this.web3Provider);
        
        let data = require("./contracts/SharedDocuments.json");
        //Truffle Contract initialisieren
        this.SharedDocumentsContract = TruffleContract(data);
        this.SharedDocumentsContract.setProvider(this.web3Provider);
    }

    getReceivedMessages(addMessage){
        var contract;
        this.web3.eth.getAccounts((error, accounts) => {
          this.SharedDocumentsContract.deployed().then((instance) => {
            contract = instance;
            return contract.getReceivedMessages.call({from:accounts[0]});
          }).then((messageIds) => {
            messageIds.forEach((id) =>{
              contract.messages.call(id).then((message) =>{
                addMessage(id.toNumber(),message);
              });
            })
          }).catch((err) => {
            console.log(err.message);
          });
        });
      }
    
      getSentMessages(addMessage){
        var contract;
        this.web3.eth.getAccounts((error, accounts) => {
          this.SharedDocumentsContract.deployed().then((instance) => {
            contract = instance;
            return contract.getSentMessages.call({from:accounts[0]});
          }).then((messageIds) => {
            messageIds.forEach((id) =>{
              contract.messages.call(id).then((message) =>{
                addMessage(id.toNumber(),message);
              });
            })
          }).catch((err) => {
            console.log(err.message);
          });
        });
      }

      createMessage(recipient, docHash){
        var contract;
        this.web3.eth.getAccounts((error, accounts) => {
          this.SharedDocumentsContract.deployed().then((instance) => {
            contract = instance;
            return contract.createMessage(docHash, recipient, {from:accounts[0]});
          }).then((transaction) => {
            console.log(transaction);
          }).catch((err) => {
            console.log(err.message);
          });
        });
      }
}

export default EthereumRemote;