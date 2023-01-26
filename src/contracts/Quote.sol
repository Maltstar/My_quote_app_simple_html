// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Quote {
    

    struct QuoteDetails{

        uint256 timestamp;
        string myQuote;
    }

    //address[] Authors;
    bytes20[] private Authors;
    // using a bytes20 type instead of an address type to avoid the automatic checksum verification
    mapping(bytes20 => QuoteDetails[]) private quotesArray; // dict with the author as key and his quotes as an array
    //mapping(address => QuoteDetails[]) quotesArray; // dict with the author as key and his quotes as an array


    /* Write quote details on blockchain */
    function setQuote(string memory newQuote) public {

        // adding to Authors history current user (caller) if non existent
        QuoteDetails[] memory ReadQuotes = getQuotesbyOwner(bytes20(msg.sender));
        if(ReadQuotes.length == 0)
        {
            Authors.push(bytes20(msg.sender));
        }
        
        // adding quote detail in history
        QuoteDetails memory MyNewQuoteDetails = QuoteDetails(block.timestamp,newQuote);
        quotesArray[(bytes20(msg.sender))].push(MyNewQuoteDetails);       

    }

    /* Read current quote detail (current quote with the associated author) */
    function getQuote() public view returns (string memory currentQuote, bytes20 currentOwner, uint256 currentTimestamp)
    {
        //checking if there is at least 1 Author
        if (Authors.length > 0)
        {
            currentOwner = Authors[Authors.length - 1]; // looking for last author
            QuoteDetails[] memory ReadQuotes = quotesArray[currentOwner]; // looking for quotes array associated to the author
            currentQuote = ReadQuotes[ReadQuotes.length-1].myQuote; // looking for last quote on quotes array 
            currentTimestamp = ReadQuotes[ReadQuotes.length-1].timestamp; // looking for last timestamp on quotes array 
        }
        else
        {
            currentQuote = "No quotes were written, be the 1st author!!";
            currentTimestamp = 0;
            currentOwner = bytes20(0x00);

        }

        return(currentQuote, currentOwner, currentTimestamp);
    }

    /* Read quote from author) */
    function getQuotesbyOwner(bytes20 author) public view returns (QuoteDetails[] memory authorQuotes)
    {
        //checking if there is at least 1 Author
        if (Authors.length > 0)
        {
            authorQuotes = quotesArray[author];
        }

        return authorQuotes;
    }

    /* Read all authors*/
    function getAllAuthors() public view returns (bytes20[] memory allAuthors)
    {
        return Authors;
    }


    // get the length of the current quote
    function getLengthQuote() public view returns (uint256 length) 
    {
        //checking if there is at least 1 Author
        if (Authors.length > 0)
        {
            QuoteDetails[] memory ReadQuotes = quotesArray[Authors[Authors.length - 1]]; // looking for quotes array associated to the author
            string memory currentQuote = ReadQuotes[ReadQuotes.length-1].myQuote; // looking for last quote on quotes array 
            length = bytes(currentQuote).length;
        }
        else
        {
            length = 0;
        }

        return length;
    }
}