import Web3 from 'web3'
import TruffleContract from 'truffle-contract';
import bs58 from 'bs58';

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
                addMessage(this.getMessageObjectFromArray(id, message));
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
                addMessage(this.getMessageObjectFromArray(id, message));
              });
            })
          }).catch((err) => {
            console.log(err.message);
          });
        });
      }

      getMessageObjectFromArray(messageId, messageArray){
        let messageObject = {
          id: messageId.toNumber(),
          ipfsHash: this.getIpfsHashFromBytes32(messageArray[0]),
          sender: messageArray[1],
          recipient: messageArray[2],
          fileName:messageArray[3],
        }
        return messageObject;
      }

      createMessage(recipient, hashString, fileName, transactionCallback){
        this.getBytes32FromIpfsHash(hashString);
        var contract;
        this.web3.eth.getAccounts((error, accounts) => {
          this.SharedDocumentsContract.deployed().then((instance) => {
            contract = instance;
            let hashObject = this.getBytes32FromIpfsHash(hashString);
            return contract.createMessage(hashObject.hash, recipient, fileName, {from:accounts[0]});
          }).then((transaction) => {
            transactionCallback(transaction);
          }).catch((err) => {
            console.log(err.message);
          });
        });
      }

      // Return bytes32 hex string from base58 encoded ipfs hash,
      // stripping leading 2 bytes from 34 byte IPFS hash
      // Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
      // E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
      // "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"

      getBytes32FromIpfsHash(ipfsListing) {
        let base58 = bs58.decode(ipfsListing);
        let hashFunction = base58.slice(0,1)[0];
        let size = base58.slice(1,2)[0];
        let hash = "0x"+base58.slice(2).toString('hex');
        return {hashFunction: hashFunction,
                size: size,
                hash: hash
              };
      }

      // Return base58 encoded ipfs hash from bytes32 hex string,
      // E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
      // --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

      getIpfsHashFromBytes32(bytes32Hex) {
        // Add our default ipfs values for first 2 bytes:
        // function:0x12=sha2, size:0x20=256 bits
        // and cut off leading "0x"
        const hashHex = "1220" + bytes32Hex.slice(2)
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes)
        return hashStr
      }
}

export default EthereumRemote;