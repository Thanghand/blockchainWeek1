Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

code = fs.readFileSync('LotteryContract.sol').toString();
solc = require('solc');
compiledCode = solc.compile(code);


LotteryContract = web3.eth.contract(JSON.parse(compiledCode.contracts[':LotteryContract'].interface))

byteCode = compiledCode.contracts[':LotteryContract'].bytecode;



deployedContract = LotteryContract.new(
    10, 100,
    {
        data: byteCode, 
        from: web3.eth.accounts[0],
        gas: 2000000
    });
contractInstance = LotteryContract.at(deployedContract.address);

contractInstance.startGamePlay();

contractInstance.pickNumber(2, {from: web3.eth.accounts[2], gas:  1000000, value: 123});

contractInstance.historyGamePlayers[1][web3.eth.accounts[1]].betNumbers[1];

contractInstance.playersIsPlaying.length;

contractInstance.getPlayer(web3.eth.accounts[1], 1);

