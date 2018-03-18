pragma solidity ^0.4.18;

contract LotteryContract {
    
    event NotifyWinner(address winnerAddress, uint moneyWinner, uint atPickedNumber);
    event NotifyResultPickNumber(uint picknumber, uint joining, uint totalMoney, uint winnerMoney, uint odds);

    struct Player {
        address addressOfAccount;
        uint countTickets;
        mapping(uint => uint) betNumbers; // Key is a play number and Value is money
    }

    struct Winner {
        address playerAddress;
        uint gamePlay;
        uint atNumber;
        uint money;
    }
    //Constant variables
    uint constant MAXIMUM_PLAYES_CAN_PLAY_TICKETS = 4;
    uint constant MAXIMUM_PLAYING_TICKETS = 10;

    // Variables 
    uint callPickNumber;
    uint minimumAmount;    
    uint gamePlay;
    uint countCallPickNumber;

    mapping(uint => Winner[]) historyWinners;
    mapping(uint => mapping(address => Player)) public historyGamePlayers;
    mapping(uint => uint) mappingTotalAmountOfNumbers;
    mapping(uint => uint) mappingTotalPlayersPickNumbers;

    address[] public playersIsPlaying;

    // Constructor
    function LotteryContract(uint callpickNumber, uint minimum) public {
        callPickNumber = callpickNumber;
        minimumAmount = minimum;
        startGamePlay();
    }

    function startGamePlay() private {
        gamePlay += 1;
        countCallPickNumber = 0;
        resetAmountForNumbers();
    }

    function pickNumber(uint picknumber) payable public {
        if (msg.value > minimumAmount) {
           
            if (countCallPickNumber == callPickNumber) {
                uint randomValue = random();
                findWinners(randomValue);
                notifyWinnersChange(randomValue);
            } else {
                if (countCallPickNumber < callPickNumber && historyGamePlayers[gamePlay][msg.sender].countTickets < MAXIMUM_PLAYES_CAN_PLAY_TICKETS) {
                    // Update bet number for Player 
                    if (historyGamePlayers[gamePlay][msg.sender].betNumbers[picknumber] == 0) {  // PickNumber has not pick 
                        // The player is the first time to play
                        if (historyGamePlayers[gamePlay][msg.sender].countTickets == 0) {
                            historyGamePlayers[gamePlay][msg.sender].addressOfAccount = msg.sender;
                            playersIsPlaying.push(msg.sender);
                        }
                        historyGamePlayers[gamePlay][msg.sender].betNumbers[picknumber] = msg.value;
                    }
                    historyGamePlayers[gamePlay][msg.sender].countTickets += 1;
                    mappingTotalAmountOfNumbers[picknumber] += msg.value;  // Counting total Amount 
                    mappingTotalPlayersPickNumbers[picknumber] += 1;
                    
                    uint playersJoining = mappingTotalPlayersPickNumbers[picknumber];
                    uint totalMoneyOfNumber = mappingTotalAmountOfNumbers[picknumber];
                    uint winnerMoney = totalMoneyOfNumber / playersJoining;
                    uint odds = (playersJoining / MAXIMUM_PLAYING_TICKETS) + 4;
                    countCallPickNumber += 1;
                    NotifyResultPickNumber(picknumber, playersJoining, totalMoneyOfNumber, winnerMoney, odds);
                }    
            }
        }
    }

    function random() private view returns (uint) { 
        return uint8(uint256(keccak256(block.timestamp, block.difficulty)) % 10); 
    }

    function findWinners(uint numberWinner) private {
        uint totalMoney = mappingTotalAmountOfNumbers[numberWinner];
        uint totalPlayerJoin = mappingTotalPlayersPickNumbers[numberWinner];
        mapping(address => Player) players = historyGamePlayers[gamePlay];
        
        // Loop with list players are playing
        for (uint i = 0; i < playersIsPlaying.length; i ++) {   
            address playerAddress = playersIsPlaying[i];
            uint valueAmount = players[playerAddress].betNumbers[numberWinner];
            if (valueAmount > 0) {  // Player has picked finney to that number 
                uint monneyofWinner = totalMoney / totalPlayerJoin;
                Winner memory winner = Winner(playersIsPlaying[i], gamePlay, numberWinner, monneyofWinner);
                historyWinners[gamePlay].push(winner);
            }
        }
    }

    function resetAmountForNumbers() private {
        for (uint i = 1 ; i <= 10; i ++) {
            mappingTotalAmountOfNumbers[i] = 0;
            mappingTotalPlayersPickNumbers[i] = 0;
        }
        if (playersIsPlaying.length > 0) {
            for (uint index = 0; index < playersIsPlaying.length; index++) {
                delete playersIsPlaying[index];
                index = 0;
                playersIsPlaying.length -= 1;
            } 
        }
    }

    function getPlayer(address playerAddress, uint picknumber) public view returns (address p1, uint countPlay ,uint money) {
        p1 = historyGamePlayers[gamePlay][playerAddress].addressOfAccount;
        money = historyGamePlayers[gamePlay][playerAddress].betNumbers[picknumber];
        countPlay = historyGamePlayers[gamePlay][playerAddress].countTickets;
    }

    function getPlayerJoin(uint index) public view returns(address p1, uint length) {
        p1 = playersIsPlaying[index];
        length = playersIsPlaying.length;
    }

    function getWinner(uint game, uint index) public view returns (address p1, uint money) {
        p1 = historyWinners[game][index].playerAddress;
        money = historyWinners[game][index].money;
    }

    function notifyWinnersChange(uint withNumber) private {
        if (historyWinners[gamePlay].length == 0) {
           NotifyWinner(address(0), 0, withNumber);
        } else {
            for (uint i = 0 ; i < historyWinners[gamePlay].length; i ++) {
                NotifyWinner(historyWinners[gamePlay][i].playerAddress, historyWinners[gamePlay][i].money, withNumber);
            }
        }
       
    }
}