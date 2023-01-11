// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Quote {
    string public quote; // the quote to be stored on the blockchain
    address public owner; // the author of the quote

    function setQuote(string memory newQuote) public {
        quote = newQuote; // updating quote with user quote
        owner = msg.sender; // updating author with caller address
    }

    function getQuote() public view returns (string memory currentQuote, address currentOwner)
    {
        currentQuote = quote; // return the current quote
        currentOwner = owner; // return the current author of the quote
    }

    function getLengthQuote() public view returns (uint256 length) 
    {
        length = bytes(quote).length;
        return length; // return the length of the quote
    }
}