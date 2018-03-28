pragma solidity ^0.4.17;

contract SharedDocuments {
    struct Message{
        string documentHash;
        address sender;
        address recipient;
    }

    Message[] public messages;

    mapping(address => uint32) sentCount;
    mapping(address => uint32) receivedCount;

    function createMessage(string _documentHash, address _recipient) public{
        messages.push(Message(_documentHash,msg.sender,_recipient));
        sentCount[msg.sender]++;
        receivedCount[_recipient]++;
    }

    function getSentMessages() public view returns(uint[]){
        uint[] memory result = new uint[](sentCount[msg.sender]);
        uint counter = 0;
        for(uint i = 0; i<messages.length; i++){
            if(messages[i].sender == msg.sender){
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getReceivedMessages() public view returns(uint[]){
        uint[] memory result = new uint[](receivedCount[msg.sender]);
        uint counter = 0;
        for(uint i = 0; i<messages.length; i++){
            if(messages[i].recipient == msg.sender){
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}