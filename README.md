# PushHack

## Demo:

[![](https://markdown-videos-api.jorgenkh.no/youtube/ubh1Lw5SBvU)](https://youtu.be/ubh1Lw5SBvU)


## The problem ETH-Push solves

The recent launch of Revolut's bank account system for teenagers marks a significant stride in financial technology. This innovative platform empowers parents with real-time control over their children's expenditures. Intrigued by this Web2 application, we sought to transplant its capabilities into the realm of Web3. Our vision encompasses a dynamic endeavor: real-time tracking of ETH wallet balances.

However, our ambitions reach beyond this singular feature. Imagine a corporate entity striving to streamline expenditure oversight across diverse accounts. Enter our solution—a versatile dapp poised to tackle multifaceted monitoring challenges. Central to our undertaking is the seamless monitoring of ETH wallet balances. This endeavor dovetails with our overarching mission to furnish a server with a user interface endowed with login functionality, leveraging the PUSH-Protocol through a dedicated PUSH-Channel.

Our dapp's scope encompasses vigilant balance monitoring for ETH wallets, while simultaneously addressing broader monitoring needs, epitomized by corporate expenditure supervision. The crux of our innovation lies in the integration of the PUSH-Protocol, channeled via a dedicated PUSH-Channel, thus cementing our commitment to ushering in a new era of sophisticated monitoring solutions.

## Challenges we ran into

To begin with, the process of deploying a smart contract from a JavaScript script posed a formidable challenge. Equally intricate was the task of invoking functions within the deployed smart contract from the very same script.

Navigating the intricacies of communication via the PUSH-Protocols Channel presented its own set of complexities. This entailed not only scripting the composition of messages onto the channel but also orchestrating the establishment of socket connections to retrieve these messages.

Furthermore, in our pursuit of a functional login mechanism, a pivotal aspect entailed the meticulous design of the user database. This foundational structure underpins the seamless operation of the login functionality, ensuring a smooth user experience.

In essence, our journey encompassed grappling with multifaceted obstacles, from deploying and interacting with smart contracts to delving into the intricacies of PUSH-Protocols Channel communication. Amidst this, the crux lay in crafting a robust user database, culminating in a sophisticated login system.

## Deployment

To send messages to the UI copy the content of the contracts folder as well as the content of the scripts folder in the corresponding folders in your local remix installation. After you did this you can change your remix enviroment to Injected Provider and then manually run the js script called: runthisscript.js. This deploys a contract and starts the message sending to the UI. To make the messages acually appear in the UI you need to create your own PUSH-Protocol channel and add the smartcontracts address to the delegates list.
