//import Web3 from "web3";
//import Web3 from "web3";
//import "web3/dist/web3.min.js";
//import "/home/johnson/used/learning/NFT\ Talents/Dapp/Einfach_Frontend/node_modules/web3/dist/web3.min.js"
import "/node_modules/web3/dist/web3.min.js";
//import "../../../node_modules/web3/dist/web3.js";
//import "../../../node_modules/web3/dist/web3"
// checkweb provider

//let web3;
let userAccount;
let contract;
let web3Gateway;
let isMetaMaskConnected = false;
//async function init_contract()

// address of the contract deployed
const address = "0x1842b40bd3A49269007EF99Bf6fA4295da5DD114";

async function popup_metamask()
{
    // lib web3 is correctly loaded
    if(typeof web3 !== 'undefined') 
    {
        // create a gateway to web3 with a web3 provider from the webbrowser, here metamask
        web3 = new Web3(window.ethereum);
        console.log('MetaMask is installed!');
        console.log(web3);
        console.log(web3.eth.accounts);
        // Popup metamask to connect
        // and return the web3 object
        await window.ethereum.request({method: 'eth_requestAccounts'}).then(result => 
        {
            console.log('MetaMask is connected!');  
            isMetaMaskConnected = true;  
            web3Gateway = web3;
            console.log(web3Gateway);  
        });
        
        
    }

}


function init_contract()
{

    // check web3 provider
    console.log(web3);
    // lib web3 found
    if(typeof web3 !== 'undefined') 
    {
        // create a gateway to web3 with a web3 provider from the webbrowser, here metamask
        web3 = new Web3(window.ethereum);
        console.log('MetaMask is installed!');
        // Popup metamask to connect
        //await window.ethereum.request({method: 'eth_requestAccounts'});
        console.log(web3);
        console.log(web3.eth.accounts);
    }

    // if (typeof window.ethereum !== 'undefined') {
    //     console.log('MetaMask is installed!');
    //     await window.ethereum.request({method: 'eth_requestAccounts'});
    //     web3 = new Web3(window.ethereum);
    //     console.log(web3);
    //   }
      
    else
    {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
        console.log("you don t have a provider, install metamask");
    }

    const contract_address = address;

    // parameters web3.eth.Contract(abi, contract)
    contract = new web3.eth.Contract([
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "newQuote",
                    "type": "string"
                }
            ],
            "name": "setQuote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getQuote",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "currentQuote",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "currentOwner",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "quote",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ], contract_address);
    console.log(contract)
}


function init_contract2()
{

    const myWeb3 = web3Gateway;
    // check web3 provider
    console.log(myWeb3);
    // lib web3 found
    if(isMetaMaskConnected) 
    {

        const contract_address = address;

        // parameters myWeb3.eth.Contract(abi, contract)
        contract = new myWeb3.eth.Contract([
            
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "newQuote",
                            "type": "string"
                        }
                    ],
                    "name": "setQuote",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getLengthQuote",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "length",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getQuote",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "currentQuote",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "currentOwner",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "quote",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            
        ], contract_address);
        console.log(contract)
    }
    else
    {
        console.log("connect your MetaMask wallet");
    }
}



async function get_Quote()
{
    // let account;
    // // retrieve the different account from the web3 provider (hier metamask)
    // // as it might take some time usage of an asynchronous function call
    // try{

    //     const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    //     account = accounts[0];
    // }
    // catch(e)
    // {
    //     console.error(e);
    // }
    
    // // retrieving the first account on the list
    
    // console.log('acoount');
    // console.log(account);
    //he transaction that will be match to the function of the smart contract we want to use
    //const tx = await contract.methods.getQuote.call();
    //const quote = tx._method.outputs[0].name;
    let quote, owner, length;
   // const tx = await contract.methods.getQuote.call();
    // console.log('tx');
    // console.log(tx);
    // await contract.methods.getQuote().call().then(
    // console.log
    // );

    // get value using the promise
    await contract.methods.getQuote().call({from: address}, function(error, result){
        quote = result.currentQuote;
        owner = result.currentOwner;
    });


    // get quote length using the promise
    // await contract.methods.getLengthQuote().call({from: address}, function(error, result){
    // length = result.length;
    // });


     // get value using callback
    //  await contract.methods.getQuote().call({from:address}).then(function(result){
    //     quote = result.currentQuote;
    //     }
    // );

        // await contract.methods.getQuote.call(function (error,result)
    // {
    //     console.log("in call back:");
    //     console.log("result:");
    //     console.log(result);
    //     // console.log('quote in call back');
    //     // console.log(result.currentQuote);
    //     // console.log('owner in call back');
    //     // console.log(result.currentOwner);
    //     // quote = saved_quote;
    // }
        

    

    console.log('quote');
    console.log(quote);

    document.getElementById("read_out").innerHTML = '"' + quote + '"';
    document.getElementById("owner").innerHTML = 'Author : ' + owner;
    document.getElementById("quote_length").innerHTML = 'Quote length : ' + quote.length + 'characters';


}


async function set_Quote(quote)
{
    let account;
    // retrieve the different account from the web3 provider (hier metamask)
    // as it might take some time usage of an asynchronous function call
    try{

        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        account = accounts[0];
    }
    catch(e)
    {
        console.error(e);
    }
    
    // // retrieving the first account on the list
    
    // console.log('acoount');
    // console.log(account);
    //he transaction that will be match to the function of the smart contract we want to use
    const tx = await contract.methods.setQuote(quote).send({from:account});
    //const quote = tx._method.outputs[0].name;

    // console.log('quote');
    // console.log(quote);

    // document.getElementById("read_out").innerHTML = quote;


}

//init_contract();

const form = document.getElementById("quotesform");
const connect = document.getElementById("connect");
const quote_in = document.getElementById("quote_input");
const write_in = document.getElementById("submit_write");

// form.addEventListener('submit',(event) =>
//     {
//         event.preventDefault();
//         init_contract();
//         get_Quote();
//     }
// )

form.addEventListener('submit',(event) =>
    {
        event.preventDefault();
        if(isMetaMaskConnected) 
        {
            init_contract2(web3Gateway);
            get_Quote();
        }
        else
        {
            console.log('Metamask not connected');
            popup_metamask();
        }
        
    }
)

connect.addEventListener('click',(event) =>
    {
        event.preventDefault();
        //web3Gateway = popup_metamask();
        popup_metamask();
    }
)


write_in.addEventListener('click',(event) =>
    {
        event.preventDefault();
        if(isMetaMaskConnected) 
        {
            const text_input = quote_in.value;
            console.log(text_input);
            if(text_input !== null)
            {
                set_Quote(text_input);
            }
            else
            {
                console.log('write a quote');
                //popup_metamask();
            }   
        }
        else
        {
            console.log('Metamask not connected');
            console.log('Click on the button connect to link Metamask');
            popup_metamask();
        }
        
        //web3Gateway = popup_metamask();
        //popup_metamask();
    }
)

//init_contract();
