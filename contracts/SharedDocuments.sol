pragma solidity ^0.4.19;

contract SharedDocuments {

    struct Message{
        bytes32 hashValue;
        address sender;
        address recipient;
        string fileName;
    }

    Message[] public messages;

    mapping(address => uint32) sentCount;
    mapping(address => uint32) receivedCount;

    function createMessage(bytes32 _documentHashValue, address _recipient, string _fileName) public{
        messages.push(Message(_documentHashValue, msg.sender, _recipient, _fileName));
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