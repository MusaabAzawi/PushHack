// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


// PUSH Comm Contract Interface
interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract Owner {

    function balanceOf()public view returns(uint){
        return address(this).balance;
    }

    function depositEth() public payable{}

    
    function sendNotification() payable external {
         IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
            0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0, // ???from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "1", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Test", // this is notificaiton title
                        "+", // segregator
                        "Hello World" // notification body
                    )
                )
            )
        );
    }
} 
