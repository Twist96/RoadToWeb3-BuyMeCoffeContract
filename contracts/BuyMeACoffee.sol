// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable owner;
    address deployer;

    constructor() {
        deployer = msg.sender;
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of coffe buyer
     * @param _message a nice message from the coffe buyer
     */
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "can't buy coffee with 0 eth");
        // Add the memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        // Emit a log event when a new memo is created!
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in the contract ti the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function updateOwner() public {
        require(
            msg.sender == deployer,
            "Ownner address can only be changed by deployer"
        );
        owner = payable(msg.sender);
    }
}
