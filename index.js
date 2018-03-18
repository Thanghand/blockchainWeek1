web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"picknumber","type":"uint256"}],"name":"pickNumber","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"game","type":"uint256"},{"name":"index","type":"uint256"}],"name":"getWinner","outputs":[{"name":"p1","type":"address"},{"name":"money","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"playersIsPlaying","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getPlayerJoin","outputs":[{"name":"p1","type":"address"},{"name":"length","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"historyGamePlayers","outputs":[{"name":"addressOfAccount","type":"address"},{"name":"countTickets","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"playerAddress","type":"address"},{"name":"picknumber","type":"uint256"}],"name":"getPlayer","outputs":[{"name":"p1","type":"address"},{"name":"countPlay","type":"uint256"},{"name":"money","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"callpickNumber","type":"uint256"},{"name":"minimum","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winnerAddress","type":"address"},{"indexed":false,"name":"moneyWinner","type":"uint256"},{"indexed":false,"name":"atPickedNumber","type":"uint256"}],"name":"NotifyWinner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"picknumber","type":"uint256"},{"indexed":false,"name":"joining","type":"uint256"},{"indexed":false,"name":"totalMoney","type":"uint256"},{"indexed":false,"name":"winnerMoney","type":"uint256"},{"indexed":false,"name":"odds","type":"uint256"}],"name":"NotifyResultPickNumber","type":"event"}]')

LotteryContract = web3.eth.contract(abi);
contractInstance = LotteryContract.at('0xace937991395b2051613368206066eb2e752a333');
players = {
    "Thang": web3.eth.accounts[0],
    "Thang1": web3.eth.accounts[1], 
    "Thang2": web3.eth.accounts[2],
    "Thang3": web3.eth.accounts[3],
    "Thang4": web3.eth.accounts[4],
    "Thang5": web3.eth.accounts[5],
    "Thang6": web3.eth.accounts[6],
    "Thang7": web3.eth.accounts[7],
    "Thang8": web3.eth.accounts[8],
    "Thang9": web3.eth.accounts[9],
    "Thang10": web3.eth.accounts[10],
}

function getKeyByValue(targetObject, value){
    for( var prop in targetObject ) {
        if( targetObject.hasOwnProperty( prop ) ) {
             if( targetObject[ prop ] === value )
                 return prop;
        }
    }
}

function callPickNumber(){
    username = $("#username").val();
    amount = $("#amount").val();
    pickNumber = $("#pickNumber").val();
    playerAddress = players[username];
    console.log('PickNumber: ' + pickNumber);
    console.log('Amount: ' + amount);
    console.log('playerAddress: ' + playerAddress);
    contractInstance.pickNumber(pickNumber, {from: playerAddress, gas:  2000000, value: amount});
}
var messageResult = "End Game The Winner are : ";
var eventWatchWinners = contractInstance.NotifyWinner(function(error, result) {
    if (!error){
        console.log(result);
        var pickedNumber = result.args.atPickedNumber.toNumber();
        var username =  getKeyByValue(players, result.args.winnerAddress);  // returns 'key1'
        var withMoney = result.args.moneyWinner.toNumber();

        var newMessage = "[ " + username + " -- picked Number: " + pickedNumber + " -- with Money: " + withMoney + "] ";
        messageResult += newMessage;
        $("#result").html(messageResult);
    }
});

var eventWatchResultPickNumbers = contractInstance.NotifyResultPickNumber(function (error, result){
    if (!error){
        console.log(result);
        b = result;
        var pickedNumber = result.args.picknumber.toNumber();
        var joining = result.args.joining.toNumber();
        var totalMoney = result.args.totalMoney.toNumber();
        var winnerMoney = result.args.winnerMoney.toNumber();
        var odds = result.args.odds.toNumber();

        $("#joining-" + pickedNumber).html(joining);
        $("#totalmoney-" + pickedNumber).html(totalMoney);
        $("#winnermoney-" + pickedNumber).html(winnerMoney);
        $("#odds-" + pickedNumber).html(odds+ "%");
    }
});

