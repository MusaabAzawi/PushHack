import Web3 from 'web3';
import contractABI from './abi.json';
const web3 = new Web3(window.ethereum);
const contract_abi = contractABI;
const contract_address = ""
const NameContract = web3.eth.Contract(contract_abi, contract_address);
const ethers = require('ethers')
const network = 'goerli'
const provider = ethers.getDefaultProvider(network)
const address = '0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0'
// Listen Ether balance changes
let lastBalance = ethers.constants.Zero
provider.on('block', () => {
    provider.getBalance(address).then((balance) => {
        if (!balance.eq(lastBalance)) {
         lastBalance = balance
   // convert a currency unit from wei to ether
   const balanceInEth = ethers.utils.formatEther(balance)
   console.log(`balance: ${balanceInEth} ETH`)
   NameContract.methods.setName(`balance: ${balanceInEth} ETH`).send();
        }
    })
})
