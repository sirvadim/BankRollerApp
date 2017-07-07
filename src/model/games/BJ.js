/**
 * Created by DAO.casino
 * BlackJack
 * v 1.0.2
 */

var LogicJS = function(params){
	var self = this

	var BLACKJACK = 21

	var DEAL      = 0
	var HIT       = 1
	var STAND     = 2
	var SPLIT     = 3
	var DOUBLE    = 4
	var INSURANCE = 5

	var _money       = 0
	var _balance     = 0
	var _myPoints    = 0
	var _splitPoints = 0
	var _housePoints = 0
	var _idGame      = 0

	var _arMyCards       = []
	var _arMySplitCards  = []
	var _arHouseCards    = []
	var _arMyPoints      = []
	var _arMySplitPoints = []
	var _arHousePoints   = []

	var _bStand          = false
	var _bStandNecessary = false

	var _prnt
	var _callback

	if(params){
		if(params.prnt){
			_prnt = params.prnt
		}
		if(params.callback){
			_callback = params.callback
		}
		_balance = params.balance || 0
	}

	var _objSpeedGame = {result:false,
						idGame:-1,
						curGame:{},
						betGame:0,
						betSplitGame:0,
						money:_money}
	var _objResult = {main:'', split:'', betMain:0, betSplit:0, profit:0}

	self.bjDeal = function(_s, _bet){
		_idGame ++
		_objResult = {main:'', split:'', betMain:0, betSplit:0, profit:-_bet}
		_objSpeedGame.result = false
		_objSpeedGame.curGame = {}
		_objSpeedGame.betGame = _bet
		_objSpeedGame.betSplitGame = 0
		_money -= _bet
		_objSpeedGame.money = _money
		_arMyCards = []
		_arMySplitCards = []
		_arHouseCards = []
		_arMyPoints = []
		_arMySplitPoints = []
		_arHousePoints = []
		_bStand = false
		_bStandNecessary = false

		var seedarr = ABI.rawEncode([ 'bytes32' ], [ _s ])
		dealCard(true, true, seedarr[15])
		dealCard(false, true, seedarr[16])
		dealCard(true, true, seedarr[17])
		refreshGame(_s)
	}

	self.bjHit = function(_s, isMain){
		dealCard(true, isMain, _s)
		refreshGame(_s)
	}

	self.bjStand = function(_s, isMain){
		var seedarr = ABI.rawEncode([ 'bytes32' ], [ _s ])
		stand(isMain, seedarr)
		refreshGame(_s)
	}

	self.bjSplit = function(_s){
		var seedarr = ABI.rawEncode([ 'bytes32' ], [ _s ])
		_arMySplitCards = [_arMyCards[1]]
		_arMyCards = [_arMyCards[0]]
		_arMySplitPoints = [_arMyPoints[0]]
		_arMyPoints = [_arMyPoints[0]]
		_myPoints = getMyPoints()
		_splitPoints = getMySplitPoints()
		dealCard(true, true, seedarr[15])
		dealCard(true, false, seedarr[16])
		_objSpeedGame.betSplitGame = _objSpeedGame.betGame
		_money -= _objSpeedGame.betSplitGame
		_objSpeedGame.money = _money
		_objResult.profit -= _objSpeedGame.betSplitGame
		refreshGame(_s)
	}

	self.bjDouble = function(_s, isMain){
		var seedarr = ABI.rawEncode([ 'bytes32' ], [ _s ])
		dealCard(true, isMain, _s)
		stand(isMain, seedarr)
		if(isMain){
			_money -= _objSpeedGame.betGame
			_objResult.profit -= _objSpeedGame.betGame
			_objSpeedGame.betGame *= 2
		} else {
			_money -= _objSpeedGame.betSplitGame
			_objResult.profit -= _objSpeedGame.betSplitGame
			_objSpeedGame.betSplitGame *= 2
		}
		_objSpeedGame.money = _money
		refreshGame(_s)
	}

	self.bjInsurance = function(_s){

	}

	self.getGame = function(){
		return _objSpeedGame
	}

	self.getResult = function(){
		return _objResult
	}

	self.getBalance = function(){
		var balance = _balance + _money
		return balance
	}

	self.getValCards = function(cardIndex){
		var cardType = Math.floor(cardIndex / 4)
		var cardSymbol = String(cardType)
		var s = cardIndex % 4 + 1
		var suit = ''
		switch (cardType) {
		case 0:
			cardSymbol = 'K'
			break
		case 1:
			cardSymbol = 'A'
			break
		case 11:
			cardSymbol = 'J'
			break
		case 12:
			cardSymbol = 'Q'
			break
		}

		var spriteName = cardSymbol
		return spriteName
	}

	function refreshGame(_s){
		checkResult(true, _s)
		if(_arMySplitCards.length > 0){
			checkResult(false, _s)
		}

		_objSpeedGame.money = _money
		_objSpeedGame.curGame = {'arMyCards':_arMyCards,
				'arMySplitCards':_arMySplitCards,
				'arHouseCards':_arHouseCards}

		if(typeof _callback === 'function'){
			_callback(_objSpeedGame)
		}

		if(_objSpeedGame.result){
			// console.log('Game Over', _objResult.profit, _money)
		}
	}

	function stand(isMain, s){
		if (!isMain) {
			return
		}

		_bStand = true

		if(_myPoints > BLACKJACK &&
		(_arMySplitCards.length == 0 ||
		_splitPoints > BLACKJACK)){
			dealCard(false, true, s[15])
		} else {
			var val = 15
			while (_housePoints < 17 && val < 64) {
				dealCard(false, true, s[val])
				val += 1
			}
		}
	}

	function dealCard(player, isMain, seed){
		var newCard = createCard(seed)

		var cardType = Math.floor(newCard / 4)
		var point = cardType

		switch (cardType) {
		case 0:
		case 11:
		case 12:
			point = 10
			break
		case 1:
			point = 11
			break
		}

		if(player){
			if (isMain) {
				_arMyPoints.push(point)
				_myPoints = getMyPoints()
				_arMyCards.push(newCard)
				// console.log("dealClient: Main", newCard, getNameCard(newCard));
				if(_myPoints >= BLACKJACK){
					var seedarr = ABI.rawEncode([ 'bytes32' ], [ seed ])
					stand(isMain, seedarr)
				}
			} else {
				_arMySplitPoints.push(point)
				_splitPoints = getMySplitPoints()
				_arMySplitCards.push(newCard)
				// console.log("dealClient: Split", newCard, getNameCard(newCard));
			}
		} else {
			_arHousePoints.push(point)
			_housePoints = getHousePoints()
			_arHouseCards.push(newCard)
			// console.log("dealClient: House", newCard, getNameCard(newCard));
		}
	}

	function checkResult(isMain, _s){
		var points = _splitPoints
		var bet = _objSpeedGame.betSplitGame
		var betWin = 0
		var countCard = _arMySplitCards.length
		var state = ''

		if(isMain){
			countCard = _arMyCards.length
			points = _myPoints
			bet = _objSpeedGame.betGame

			if(_objSpeedGame.result){
				return false
			}
		}

		if(points == BLACKJACK && _housePoints == BLACKJACK && state==''){
			state = 'push'
			betWin = bet
			if(isMain){
				_objSpeedGame.result = true
			}
		}
		if (_housePoints == BLACKJACK && points != BLACKJACK && state=='') {
			state = 'lose'
			if(isMain){
				_objSpeedGame.result = true
			}
		}

		if (points == BLACKJACK && state=='' && countCard == 2) {
			state = 'blackjack'
			bet = bet * 2.5
			betWin = bet
			if(isMain){
				_objSpeedGame.result = true
			}
		}
		if (points > BLACKJACK && state=='') {
			state = 'bust'
			if(isMain){
				_objSpeedGame.result = true
			}
		}
		if (points == _housePoints && state=='') {
			state = 'push'
			betWin = bet
		}
		if (points < _housePoints && _housePoints <= BLACKJACK && state=='') {
			state = 'lose'
		}
		if (state=='') {
			state = 'win'
			bet = bet * 2
			betWin = bet
		}

		if(!_objSpeedGame.result){
			if(_bStand){
				_objSpeedGame.result = true
			} else if(points == BLACKJACK && isMain){
				if(_bStandNecessary){
					_objSpeedGame.result = true
				} else {
					_bStandNecessary = true
					self.bjStand(_s, isMain)
					return false
				}
			}
		}

		if(_objSpeedGame.result){
			_money += betWin
			_objSpeedGame.money = _money
			_objResult.profit += betWin
			if(isMain){
				_objResult.main = state
				_objResult.betMain = betWin
				// console.log('result: Main', state, '_money = '+betWin)
			} else {
				_objResult.split = state
				_objResult.betSplit = betWin
				// console.log('result: Split', state, '_money = '+betWin)
			}
		}
	}

	function createCard(cardNumber){
		var hash = ABI.soliditySHA3(['bytes32'],[ cardNumber ]).toString('hex')
		hash = hash.substr(hash.length-2, hash.length) // uint8
		var rand = bigInt(hash,16).divmod(52).remainder.value
		return rand
	}

	function getMyPoints(){
		var myPoints = 0
		var countAce = 0
		for (var i = 0; i < _arMyPoints.length; i++) {
			var curPoint = _arMyPoints[i]
			myPoints += curPoint
			if(curPoint == 11){
				countAce ++
			}
		}
		while(myPoints > 21 && countAce > 0){
			countAce --
			myPoints -= 10
		}

		return myPoints
	}

	function getMySplitPoints(){
		var mySplitPoints = 0
		var countAce = 0
		for (var i = 0; i < _arMySplitPoints.length; i++) {
			var curPoint = _arMySplitPoints[i]
			mySplitPoints += curPoint
			if(curPoint == 11){
				countAce ++
			}
		}

		while(mySplitPoints > 21 && countAce > 0){
			countAce --
			mySplitPoints -= 10
		}

		return mySplitPoints
	}

	function getHousePoints(){
		var housePoints = 0
		var countAce = 0
		for (var i = 0; i < _arHousePoints.length; i++) {
			var curPoint = _arHousePoints[i]
			housePoints += curPoint
			if(curPoint == 11){
				countAce ++
			}
		}

		while(housePoints > 21 && countAce > 0){
			countAce --
			housePoints -= 10
		}

		return housePoints
	}

	function getNameCard(cardIndex){
		var cardType = Math.floor(cardIndex / 4)
		var cardSymbol = String(cardType)
		var s = cardIndex % 4 + 1
		var suit = ''
		switch (cardType) {
		case 0:
			cardSymbol = 'K'
			break
		case 1:
			cardSymbol = 'A'
			break
		case 11:
			cardSymbol = 'J'
			break
		case 12:
			cardSymbol = 'Q'
			break
		}
		switch (s) {
		case 1:
			suit = 'Hearts'
			break
		case 2:
			suit = 'Diamonds'
			break
		case 3:
			suit = 'Spades'
			break
		case 4:
			suit = 'Clubs'
			break
		}

		var spriteName = suit + '_' + cardSymbol
		return spriteName
	}

	return self
}



import ABI        from 'ethereumjs-abi'
import bigInt     from 'big-integer'
import Eth        from '../Eth/Eth'
import Rtc        from '../rtc'
import * as Utils from '../utils'

import Channel from '../../Channel'

const contractAddress = '0x89fe5E63487b2d45959502bEB1dac4d5A150663e'

let Games = []
export default new class BJgame {
	constructor() {

		Eth.Wallet.getPwDerivedKey( PwDerivedKey => {
			this.PwDerivedKey = PwDerivedKey
		})

		this.Games = Games

		if (process.env.NODE_ENV !== 'server') {
			setTimeout(()=>{
				this.startMesh()
			}, 3000)
		}
	}

	startMesh(){
		let user_id = Eth.Wallet.get().openkey || false

		this.RTC = new Rtc(user_id)

		this.RTC.subscribe(contractAddress, data => {
			if (!data || !data.action || !data.game_code || data.game_code!='BJ') { return }
			console.log(data)

			if (data.action=='get_random') {
				this.sendRandom(data)
				return
			}

			if (data.action=='close_game_channel') {
				this.endGame(data)
				return
			}


			if (!data.game_id) { return }
			let game_id = data.user_id+'/'+data.game_id
			if (data.action=='call_game_function') {
				this.callGameFunction(game_id, data.name, data.args)
			}
		})
	}

	endGame(params){
		if (!this.endGamesMsgs) { this.endGamesMsgs = {} }
		if (this.endGamesMsgs[params.seed]) { return }
		this.endGamesMsgs[params.seed] = true

		Channel.close(params.address, params.account, params.deposit, res=>{
			params.action = 'game_channel_closed'
			params.result = true
			this.RTC.sendMsg(params)
		})
	}

	callGameFunction(game_id, function_name, function_args){
		// console.log(game_id, function_name, function_args)
		if (!Games[game_id]) {
			Games[game_id] = new LogicJS()
		}

		if (!Games[game_id][function_name]) {
			return
		}

		function_args = this.prepareArgs(function_args)

		if (function_args) {
			Games[game_id][function_name].apply(null, function_args)
		} else {
			Games[game_id][function_name]()
		}

	}

	prepareArgs(args){
		if (!args || !args.length) {
			return false
		}

		let new_args = []
		args.forEach( arg => {
			if (arg && (''+arg).indexOf('confirm')!=-1) {
				let seed = arg.split('confirm(')[1].split(')')[0]
				arg = this.confirm(seed)
			}
			new_args.push(arg)
		})
		return new_args
	}

	sendRandom(data){
		if (!data.seed) {
			return
		};
		this.RTC.sendMsg({
			action:    'send_random',
			game_code: 'daochannel_v1',
			address:   contractAddress,
			seed:      data.seed,
			random:    this.confirm(data.seed),
		})
	}

	confirm(seed=false){
		if (!seed) {
			return
		}
		let VRS = Eth.Wallet.lib.signing.signMsgHash(
			Eth.Wallet.getKs(),
			this.PwDerivedKey,
			seed,
			Eth.Wallet.get().openkey
		)

		let signature = Eth.Wallet.lib.signing.concatSig(VRS)

		let v = Utils.hexToNum(signature.slice(130, 132)) // 27 or 28
		let r = signature.slice(0, 66)
		let s = '0x' + signature.slice(66, 130)

		return s
	}
}