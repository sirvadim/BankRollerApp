module.exports = [{
	'constant': true,
	'inputs': [],
	'name': 'name',
	'outputs': [{
		'name': '',
		'type': 'string'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': false,
	'inputs': [{
		'name': '_spender',
		'type': 'address'
	}, {
		'name': '_value',
		'type': 'uint256'
	}],
	'name': 'approve',
	'outputs': [{
		'name': 'success',
		'type': 'bool'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [],
	'name': 'totalSupply',
	'outputs': [{
		'name': '',
		'type': 'uint256'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': false,
	'inputs': [{
		'name': '_from',
		'type': 'address'
	}, {
		'name': '_to',
		'type': 'address'
	}, {
		'name': '_value',
		'type': 'uint256'
	}],
	'name': 'transferFrom',
	'outputs': [{
		'name': 'success',
		'type': 'bool'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [],
	'name': 'decimals',
	'outputs': [{
		'name': '',
		'type': 'uint8'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [],
	'name': 'standard',
	'outputs': [{
		'name': '',
		'type': 'string'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [{
		'name': '',
		'type': 'address'
	}],
	'name': 'balanceOf',
	'outputs': [{
		'name': '',
		'type': 'uint256'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [],
	'name': 'symbol',
	'outputs': [{
		'name': '',
		'type': 'string'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': false,
	'inputs': [{
		'name': '_to',
		'type': 'address'
	}, {
		'name': '_value',
		'type': 'uint256'
	}],
	'name': 'transfer',
	'outputs': [],
	'payable': false,
	'type': 'function'
}, {
	'constant': false,
	'inputs': [{
		'name': '_spender',
		'type': 'address'
	}, {
		'name': '_value',
		'type': 'uint256'
	}, {
		'name': '_extraData',
		'type': 'bytes'
	}],
	'name': 'approveAndCall',
	'outputs': [{
		'name': 'success',
		'type': 'bool'
	}],
	'payable': false,
	'type': 'function'
}, {
	'constant': true,
	'inputs': [{
		'name': '',
		'type': 'address'
	}, {
		'name': '',
		'type': 'address'
	}],
	'name': 'allowance',
	'outputs': [{
		'name': '',
		'type': 'uint256'
	}],
	'payable': false,
	'type': 'function'
}, {
	'inputs': [],
	'payable': false,
	'type': 'constructor'
}, {
	'payable': false,
	'type': 'fallback'
}, {
	'anonymous': false,
	'inputs': [{
		'indexed': true,
		'name': 'from',
		'type': 'address'
	}, {
		'indexed': true,
		'name': 'to',
		'type': 'address'
	}, {
		'indexed': false,
		'name': 'value',
		'type': 'uint256'
	}],
	'name': 'Transfer',
	'type': 'event'
}]