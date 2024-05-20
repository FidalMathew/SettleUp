// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SettleUp {
    struct Group {
        string name;
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
    }

    Expense[] expenses;

    mapping(uint256 => Group) public groups;
    uint256 public groupCount;

    event GroupCreated(uint256 groupId, string name, address creator);
    event MemberAdded(uint256 groupId, address member);
    event ExpenseUpdated(
        uint256 groupId,
        address debtor,
        address creditor,
        uint256 amount
    );
    event DebtPaidInLink(
        uint256 groupId,
        address indexed debtor,
        address indexed creditor,
        uint256 usdcAmount,
        uint256 linkAmount
    );

    modifier onlyGroupMember(uint256 groupId) {
        require(isMember(groupId, msg.sender), "Not a member of the group");
        _;
    }

    function createGroup(string memory name) public {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.name = name;
        newGroup.members.push(msg.sender);

        emit GroupCreated(groupCount, name, msg.sender);
    }

    function addMember(
        uint256 groupId,
        address member
    ) public onlyGroupMember(groupId) {
        require(!isMember(groupId, member), "Already a member of the group");
        groups[groupId].members.push(member);

        emit MemberAdded(groupId, member);
    }

    function addExpense(
        uint256 _groupId,
        address _creditor,
        address[] memory _debtors,
        uint256[] memory _amounts,
        uint256 _total
    ) public onlyGroupMember(_groupId) {
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
            _total
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
    ) private {
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
}
