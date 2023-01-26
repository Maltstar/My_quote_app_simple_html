import "/node_modules/web3/dist/web3.min.js";
// checkweb provider

function main()
{
    //let web3;
    let userAccount;
    let contract;
    let web3Gateway;
    let isMetaMaskConnected = false;
    let contract_inferface;
    let allAuthors = [];
    let allQuotes = {};
    let current_quote, current_owner, current_timestamp;
    let QuotesbyOwner = [];

    let address_backend="" ; // arbitrary value to identify the backend, optional

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

    // fetch smart contract address and abi from json file
    async function  get_contract_interface()
    {
        await fetch('/src/contracts/infos_contract.json')
        .then((response) => response.json())
        .then((json_contract_interface) => 
        {
            // modify global interface with fetched interface
        contract_inferface = json_contract_interface;
        })
    }

    async function init_contract()
    {
        await connect_to_SmartContract();
    }

    async function connect_to_SmartContract()
    {
        // update global interface with interface declared in json
        await get_contract_interface()
        
        console.log('connect_to_SmartContract');
        console.log(contract_inferface);
        const myWeb3 = web3Gateway;

        // lib web3 found
        if(isMetaMaskConnected) 
        {
            // connect to smart contract via web3 gateway
            contract = new myWeb3.eth.Contract(contract_inferface['abi'], contract_inferface['address']);
            //address_backend = contract_inferface['address'];
            console.log(contract)
        }
        else
        {
            console.log("connect your MetaMask wallet");
        }
    }


    // wrapper to getQuote() from smart contract
    async function get_Quote()
    {

        // get value using the promise and update global variables
        await contract.methods.getQuote().call({from: address_backend}, function(error, result){
            current_quote = result.currentQuote;
            current_owner = result.currentOwner;
            current_timestamp = result.currentTimestamp;
        });

    }


    async function displayCurrentQuote()
    {
        await get_Quote() ;
        const result_current_quote = document.getElementById('result_read_current');
        if(current_quote)
        {
            // clearing previous results
            while (result_current_quote.hasChildNodes()) {
                result_current_quote.removeChild(result_current_quote.firstChild);
                }

            console.log('current_quote');
            console.log(current_quote);
            
            const quote_ar = document.createElement('article');
            const title = document.createElement('h4');
            title.innerHTML = 'last quote';
            title.className="quote_title";
            quote_ar.appendChild(title);
            
            const result = document.createElement('ul');
            const quote = document.createElement('li');
            const quote_timestamp = document.createElement('li');
            const author = document.createElement('li');
            
            quote.innerHTML = '"' + current_quote + '"';
            quote_timestamp.innerHTML = 'written on: ' + convert_timestamp_to_date(current_timestamp);
            author.innerHTML = 'Author : ' + current_owner;
            
            result.appendChild(quote);
            result.appendChild(quote_timestamp);
            result.appendChild(author);
            
            console.log('result');
            console.log(result);

            quote_ar.appendChild(result);
            result_current_quote.appendChild(quote_ar);
            const read_current = document.getElementById('current_quote');
            const button_text = 'clear quote';
            add_clear_button(read_current,result_current_quote,button_text);        
        }
    
    }

    // wrapper to get_AllAuthors() from smart contract
    async function get_AllAuthors()
    {
        await contract.methods.getAllAuthors().call({from: address_backend},function(error, result){
            allAuthors = result;
        });
    }


    async function displayAllAuthors()
    {
        await get_AllAuthors();
        console.log(allAuthors);
        let author_nb = 0;
        const result_all_authors = document.getElementById('result_all_authors');

        if(allAuthors.length>0)
        {
            // clearing previous results
            while (result_all_authors.hasChildNodes()) {
                result_all_authors.removeChild(result_all_authors.firstChild);
                }

            const result = document.createElement('ul');
            // iterate over each author
                allAuthors.map(author => {
                    console.log('author');
                    console.log(author);
                    
                    const owner = document.createElement('li');
                    const title = document.createElement('h3');
                    author_nb++;
                    title.innerHTML = 'Author ' + author_nb.toString() + ' : ' + author;
                    result_all_authors.appendChild(title);
                });
                
            

                console.log('result_all_authors');
                console.log(result_all_authors);

                const all_authors = document.getElementById('all_authors');
                const button_text = 'clear all authors';
                add_clear_button(all_authors,result_all_authors,button_text);
            }    
    }

    // list every quote with timestamp and authors recorded on the blockchain
    async function get_AllQuotes()
    {

        await get_AllAuthors();

        // for each author, collect their quotes
        for(let i=0;i<allAuthors.length;i++)
        {
            await  contract.methods.getQuotesbyOwner(allAuthors[i]).call({from: address_backend},function(error, result){
                allQuotes[allAuthors[i]] =result;
            });
        }


    }


    // param quote_details_arr: the array of quote for an author
    // param node_for_result: the html element where the quotes shall be appended
    function format_quotes(quote_details_arr,node_for_result)
    {
        let quote_nb = 0;
        //iterate over each quote of the author
        quote_details_arr.map(quote_details => {
            console.log('quote_details');
            console.log(quote_details);
            const quote_ar = document.createElement('article');
            const result = document.createElement('ul');
            const current_quote = document.createElement('li');
            const quote_timestamp = document.createElement('li');
            const quote_title = document.createElement('h4');
            // update the number of the quote
            quote_nb++;
        
            quote_title.innerHTML  =  'quote ' + quote_nb.toString() + ' :';
            quote_title.className="quote_title";
            current_quote.innerHTML = '"' + quote_details[1] + '"';
            quote_timestamp.innerHTML = 'written on: ' +  convert_timestamp_to_date(quote_details[0]);

            // adding quote informations to node
            result.appendChild(current_quote);
            result.appendChild(quote_timestamp);

            // displaying the quote number with quote details
            quote_ar.appendChild(quote_title);
            quote_ar.appendChild(result);

            // append the quote results with title to a node html
            node_for_result.appendChild(quote_ar);
        });
        // add break line for next author
        node_for_result.appendChild(document.createElement('br'));

    }

    async function displayAllQuotes()
    {
        await get_AllQuotes();
        console.log(allQuotes);
        console.log(allAuthors);
        let author_nb = 0;
        let quote_nb = 0;
        const result_all_quotes = document.getElementById('result_all_quotes');

        if(allAuthors.length>0)
        {
            // clearing previous results
            while (result_all_quotes.hasChildNodes()) {
                result_all_quotes.removeChild(result_all_quotes.firstChild);
                }

            // iterating each author
            for (const [author, quote_details] of Object.entries(allQuotes)) {
                //console.log(`${author} -> ${quote_details}`)
                const title = document.createElement('h3');
                author_nb++;
                // init the number of quote for each author
                quote_nb = 0;
                title.innerHTML = 'Author ' + author_nb.toString() + ' : ' + author;
                result_all_quotes.appendChild(title);
                // iterate over each quote of the author
                format_quotes(quote_details,result_all_quotes);
               
            }

                console.log('result_all_quotes');
                console.log(result_all_quotes);

                const all_quotes = document.getElementById('all_quotes');
                const button_text = 'clear all quotes';
                add_clear_button(all_quotes,result_all_quotes,button_text);

        }  

        
    }


    async function set_Quote(quote)
    {
        let account;
        // retrieve the different account from the web3 provider (hier metamask)
        // as it might take some time usage of an asynchronous function call
        try{

            const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
            // taking per default the 1st account of the wallet
            account = accounts[0];
        }
        catch(e)
        {
            console.error(e);
        }
        
        const tx = await contract.methods.setQuote(quote).send({from:account});


    }


    function convert_timestamp_to_date(timestamp)
    {
        return new Date(timestamp*1000).toUTCString();
    }

    function check_input_author(author)
    {
        const regx = "^0x.*S";
        let check = false;
        // checking syntax of input user as an address
        //checking the format of the input, the smart contract expect a bytes20 
        //0x566851a04fb394f9bbd4672d3429dd2a2192bd80
        // new contract with private state variable 0xc1df7fdbacecbbf1eadd6c9d20389c1235c75c8b
        if(author.search(regx))
        {
            console.log(author.length);
            if(author.length == 42)
            {
                // call the smart contract with a default 20 bytes
                check = true;
            }
        }

        console.log('check',check);
        return check;
    }

    async function get_QuotebyOwner(addressOwner)
    {
        
        let author = addressOwner;
        // check for the format of the author address
        let check = check_input_author(addressOwner);
        // if the address of the author is not correct
        if(!check_input_author(addressOwner))
        {
            // call the smart contract with a default 20 bytes since they are no record for a bad formated input
            addressOwner = "0x0000000000000000000000000000000000000000";
        }
        
        // retrieve quote from author
        await contract.methods.getQuotesbyOwner(addressOwner).call({from: address_backend}, function(error, result){
        
        // display the result in the front end    
        const list_quoteDetails = document.createElement('div');
        const resultQuotes = document.getElementById('result_quote_by_author');
        let quotes;

        console.log(result);

        // displaying nicely when there is a result
        if(result.length != 0)
        {
            const title = document.createElement('h3');
            title.innerHTML = 'Author ' + ' : ' + addressOwner;
            resultQuotes.appendChild(title);
            quotes = document.createElement('ul'); // dummy html element
            format_quotes(result,resultQuotes);

        }
        else // signaling that none were retrieved
        {
            quotes = document.createElement('p');
            quotes.innerHTML = "there are no quotes written by the author " + '"' + author + '"';
        }
        
        
        // done in order to have a common behavior execution independently of the results
        // dummy in case of the result is found
        list_quoteDetails.append(quotes);

        const quote_by_author = document.getElementById('quote_by_author');
        // dummy in case of the result is found
        resultQuotes.appendChild(list_quoteDetails);
        const button_text = 'clear quotes';
        // add a button to clear the quotes displayed
        add_clear_button(quote_by_author,resultQuotes,button_text);    

        });
    }

    function add_clear_button(parent_div,result,button_text)
    {
        const clear = document.createElement('button');
        clear.innerHTML = button_text;
        console.log('clear.innerHTML');
        console.log(clear.innerHTML);
        // to avoid duplicate clear button
        if(parent_div.lastChild.innerHTML != clear.innerHTML)
        {
            parent_div.appendChild(clear);
            clear.addEventListener('click',(event) =>
            {
                clear_node(result);
                clear.remove();
            });
        }
    }

    function clear_node(node)
    {
        // clearing previous results
        while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        } 
    }

    // initialize Metamask Wallet and fetch contract address and abi in json file
    async function initialize_ressources()
    {
        await popup_metamask();
        await init_contract();
    }

    async function initialize_metamask()
    {
        await popup_metamask();
    }

    // Map buttons with events

    const read_current = document.getElementById("read_current");
    const read_all = document.getElementById("read_all_quotes");
    const read_all_authors = document.getElementById("read_all_authors");
    const connect = document.getElementById("connect");
    const read_quotes_from_author = document.getElementById("read_quotes_from_author");
    const author_input = document.getElementById("author_input");
    const quote_in = document.getElementById("quote_input");
    const write_in = document.getElementById("submit_write");


    // display current quote on click
    read_current.addEventListener('click',(event) =>
        {
            event.preventDefault();
            if(isMetaMaskConnected) 
            {
                displayCurrentQuote();
            }
            else
            {
                console.log('Metamask not connected');
                initialize_metamask();
            }
            
        }
    )

        // display all quotes on click
        read_all.addEventListener('click',(event) =>
        {
            event.preventDefault();
            if(isMetaMaskConnected) 
            {
                displayAllQuotes();
            }
            else
            {
                console.log('Metamask not connected');
                initialize_metamask();
            }
            
        });

    // display all authors on click
        read_all_authors.addEventListener('click',(event) =>
        {
            event.preventDefault();
            if(isMetaMaskConnected) 
            {
                displayAllAuthors();
            }
            else
            {
                console.log('Metamask not connected');
                initialize_metamask();
            }
            
        });

        // display all quotes from an author
        read_quotes_from_author.addEventListener('click',(event) =>
        {
            event.preventDefault();
            if(isMetaMaskConnected) 
            {
                get_QuotebyOwner(author_input.value);
            }
            else
            {
                console.log('Metamask not connected');
                initialize_metamask();
            }
            
        });

        // popup metamask to connect to the webapp
        connect.addEventListener('click',(event) =>
        {
            event.preventDefault();
            initialize_metamask();
        }
    )

        // display a text area to write the quote
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
                }   
            }
            else
            {
                console.log('Metamask not connected');
                console.log('Click on the button connect to link Metamask');
                popup_metamask();
            }
            
        }
    )
    
    // per default poping metamask and connecting to smart contract without user interaction when page is loaded
    initialize_ressources();

}

main();

