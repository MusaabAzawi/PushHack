const { deploy } = require('./web3-lib.ts');
const Web3 = require('web3');
const ethers = require('ethers');
const contractABI = require('./abi2.json');


(async () => {
    try {
            const result = await deploy('SendNotifications2', ["ring"]);
            console.log(`address: ${result.address}`);
            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const contract_abi = contractABI;
            const contract_address = `${result.address}`
            console.log(contract_abi);
            console.log(contract_address);
            const value = "abc";
            const NameContract = new web3.eth.Contract(contract_abi, contract_address);
            NameContract.methods.sendNotification(value).send({
                from: "0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0",
                gas: 950000,
                gasPrice: 70000000
            }).then(function(newContractInstance){
                console.log(newContractInstance.options.address) // instance with the new contract address
            });
        }
    catch (e) {
        console.log(e.message);
    }
})();

