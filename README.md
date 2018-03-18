# CoderSchool Blockchain Week1!

#### * Finished all basic features 

#### * Optional features: 

- After finish with Y callPickNumbers , the contract will notify to GUI update UI and show message Result with Winner
- "Contract offers dynamic odds. Once a number is picked, the payout to the winners decreases and odds on others increase proportionally."
I think i didn't understand much of it ^^, but I add 2 fields for Play Number "Winner money" and	"Odds"


# How to run it ? :

## 1. Install node packages:

```
$: npm install solc

$: npm install web3@0.20.2

```

## 2. Deploy to Etherum

```
$: node 
(run winth command): 
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
(note: callPickNumber is "10" and minimum is "100")
contractInstance = LotteryContract.at(deployedContract.address);
```
## 3: Update index.js for web local:

* Update abi

* Update contract address 

## 4: Play on Web

* Open index.html

* In index.js, I have declare list players : 
```
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
```
(It is mapping to web3 accounts)

* There are 3 input: 
  1. Username (flow to list players)
  2. Money
  3. PickNumbers 
  




