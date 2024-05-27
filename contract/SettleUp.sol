// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SettleUp {
    struct Group {
        string name;
        string category;
        string from;
        string to;
        address[] members;
        mapping(address => mapping(address => uint256)) debts;
        uint256 spending;
    }

    struct Expense {
        uint256 groupId;
        address creditor;
        address[] debtors;
        uint256[] amount;
        uint256 total;
        string desc;
        string date;
        string category;
    }

    Expense[] expenses;

    mapping(uint256 => Group) public groups;
    uint256 public groupCount;

    // constructor() {
    //     createGroup("Testing", "food", "12-1-2024", "15-1-2024");
    //     addMember(1, 0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736);

    //     uint256[] memory val2 = new uint256[](1);
    //     val2[0] = 10;

    //     address[] memory members = new address[](1);
    //     members[0] = 0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736;

    //     addExpense(1, msg.sender, members, val2, 20);
    // }

    mapping(string => address) nameMap;
    mapping(address => string) addressMap;

    function createUser(string memory _name) public {
        require(nameMap[_name] == address(0), "Username already exists");

        nameMap[_name] = msg.sender;
        addressMap[msg.sender] = _name;
    }

    function fetchName(address user) public view returns (string memory) {
        return addressMap[user];
    }

    function fetchAddress(string memory user) public view returns (address) {
        return nameMap[user];
    }

    function createGroup(
        string memory name,
        string memory category,
        string memory from,
        string memory to
    ) public {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.name = name;
        newGroup.category = category;
        newGroup.from = from;
        newGroup.to = to;
        newGroup.members.push(msg.sender);
        newGroup.spending = 0;
    }

    function getGroupsForMember(
        address member
    )
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            string[] memory,
            string[] memory,
            string[] memory
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= groupCount; i++) {
            if (isMember(i, member)) {
                count++;
            }
        }

        uint256[] memory groupIds = new uint256[](count);
        string[] memory names = new string[](count);
        string[] memory categories = new string[](count);
        string[] memory fromDates = new string[](count);
        string[] memory toDates = new string[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= groupCount; i++) {
            if (isMember(i, member)) {
                Group storage group = groups[i];
                groupIds[index] = i;
                names[index] = group.name;
                categories[index] = group.category;
                fromDates[index] = group.from;
                toDates[index] = group.to;
                index++;
            }
        }

        return (groupIds, names, categories, fromDates, toDates);
    }

    function getGroupSpending(uint256 groupId) public view returns (uint256) {
        require(groupId <= groupCount, "Group does not exist");
        return groups[groupId].spending;
    }

    function addMember(uint256 groupId, address member) public {
        require(!isMember(groupId, member), "Already a member of the group");
        groups[groupId].members.push(member);
    }

    function getGroupMembers(
        uint256 groupId
    ) public view returns (address[] memory) {
        Group storage group = groups[groupId];
        return group.members;
    }

    function addExpense(
        uint256 _groupId,
        address _creditor,
        address[] memory _debtors,
        uint256[] memory _amounts,
        uint256 _total,
        string memory _desc,
        string memory _date,
        string memory _category
    ) public {
        require(
            isMember(_groupId, _creditor),
            "Debtor is not a member of the group"
        );

        Group storage group = groups[_groupId];

        for (uint256 i = 0; i < _debtors.length; i++) {
            if (_amounts[i] >= group.debts[_creditor][_debtors[i]]) {
                group.debts[_debtors[i]][_creditor] =
                    _amounts[i] -
                    group.debts[_creditor][_debtors[i]];
                group.debts[_creditor][_debtors[i]] = 0;
            } else {
                group.debts[_creditor][_debtors[i]] -= _amounts[i];
                group.debts[_debtors[i]][_creditor] = 0;
            }
        }
        group.spending += _total;
        Expense memory exp = Expense(
            _groupId,
            _creditor,
            _debtors,
            _amounts,
            _total,
            _desc,
            _date,
            _category
        );
        expenses.push(exp);
    }

    function viewAllExpenses() public view returns (Expense[] memory) {
        return expenses;
    }

    function viewAllExpensesOfGroup(
        uint256 groupId
    ) public view returns (Expense[] memory) {
        uint256 count = 0;
        // First, count the number of expenses for the group
        for (uint256 i = 0; i < expenses.length; i++) {
            if (expenses[i].groupId == groupId) {
                count++;
            }
        }

        // Create an array to hold the group's expenses
        Expense[] memory groupExpenses = new Expense[](count);
        uint256 index = 0;

        // Populate the array with the group's expenses
        for (uint256 i = 0; i < expenses.length; i++) {
            if (expenses[i].groupId == groupId) {
                groupExpenses[index] = expenses[i];
                index++;
            }
        }

        return groupExpenses;
    }

    function getAllDebts(
        uint256 groupId
    )
        public
        view
        returns (address[] memory, address[] memory, uint256[] memory)
    {
        Group storage group = groups[groupId];
        uint256 memberCount = group.members.length;
        uint256 debtCount = 0;

        // Calculate the number of debts
        for (uint256 i = 0; i < memberCount; i++) {
            for (uint256 j = 0; j < memberCount; j++) {
                if (group.debts[group.members[i]][group.members[j]] > 0) {
                    debtCount++;
                }
            }
        }

        address[] memory debtors = new address[](debtCount);
        address[] memory creditors = new address[](debtCount);
        uint256[] memory amounts = new uint256[](debtCount);
        uint256 index = 0;

        // Populate the arrays with debt data
        for (uint256 i = 0; i < memberCount; i++) {
            for (uint256 j = 0; j < memberCount; j++) {
                uint256 debt = group.debts[group.members[i]][group.members[j]];
                if (debt > 0) {
                    debtors[index] = group.members[i];
                    creditors[index] = group.members[j];
                    amounts[index] = debt;
                    index++;
                }
            }
        }

        return (debtors, creditors, amounts);
    }

    function getDebt(
        uint256 groupId,
        address debtor,
        address creditor
    ) public view returns (uint256) {
        return groups[groupId].debts[debtor][creditor];
    }

    function isMember(
        uint256 groupId,
        address member
    ) internal view returns (bool) {
        Group storage group = groups[groupId];
        for (uint256 i = 0; i < group.members.length; i++) {
            if (group.members[i] == member) {
                return true;
            }
        }
        return false;
    }

    function payDebt(
        uint256 _groupId,
        address _creditor,
        uint256 token
    ) public {
        address _tokenAddress;
        address priceFeed;
        Group storage group = groups[_groupId];

        if (token == 0) {
            // LINK
            _tokenAddress = 0x0F5CC78D949c3cD5B6264A9Fb1a423A6075bf68A;
            priceFeed = 0x5310f2d4B531BCEA8126e2aEE40BAd71B707f530;

            payInLink(
                _creditor,
                group.debts[msg.sender][_creditor],
                _tokenAddress,
                priceFeed
            );

            group.debts[msg.sender][_creditor] = 0;
        } else {
            revert("Unsupported token type");
        }
    }

    // payments
    function payInLink(
        address creditor,
        uint256 usdAmount,
        address _link,
        address _priceFeed
    ) public {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(_priceFeed);
        ERC20 link = ERC20(_link);

        // Get the latest LINK/USD price
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");

        // Assuming price feed has 8 decimals, adjust the price
        uint256 priceWithDecimals = uint256(price) * 1e10; // Convert price to 18 decimals

        // Calculate the amount of LINK to send
        uint256 linkAmount = (usdAmount * 1e18 * 1e18) / priceWithDecimals;

        // Transfer LINK from msg.sender to creditor
        require(
            link.transferFrom(msg.sender, creditor, linkAmount),
            "LINK transfer failed"
        );
    }

    function getAmountRemainingToBePaid(
        address account,
        uint256 groupId
    ) public view returns (uint256) {
        Group storage group = groups[groupId];
        uint256 totalDebt = 0;

        for (uint256 i = 0; i < group.members.length; i++) {
            address member = group.members[i];
            if (member != account) {
                totalDebt += group.debts[account][member];
            }
        }

        return totalDebt;
    }

    function getAmountRemainingToBeReceived(
        address account,
        uint256 groupId
    ) public view returns (uint256) {
        Group storage group = groups[groupId];
        uint256 totalCredit = 0;

        for (uint256 i = 0; i < group.members.length; i++) {
            address member = group.members[i];
            if (member != account) {
                totalCredit += group.debts[member][account];
            }
        }

        return totalCredit;
    }

    function getTotalDebt(address sender) public view returns (uint256) {
        uint256 totalDebt = 0;

        // Iterate over all groups
        for (uint256 i = 1; i <= groupCount; i++) {
            if (isMember(i, sender)) {
                Group storage group = groups[i];
                // Iterate over all members of the group
                for (uint256 j = 0; j < group.members.length; j++) {
                    address member = group.members[j];
                    if (member != sender) {
                        totalDebt += group.debts[sender][member];
                    }
                }
            }
        }

        return totalDebt;
    }

    function getTotalCredit(address sender) public view returns (uint256) {
        uint256 totalCredit = 0;

        // Iterate over all groups
        for (uint256 i = 1; i <= groupCount; i++) {
            if (isMember(i, sender)) {
                Group storage group = groups[i];
                // Iterate over all members of the group
                for (uint256 j = 0; j < group.members.length; j++) {
                    address member = group.members[j];
                    if (member != sender) {
                        totalCredit += group.debts[member][sender];
                    }
                }
            }
        }

        return totalCredit;
    }
}
