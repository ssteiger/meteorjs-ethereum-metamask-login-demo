Template.registerHelper('foundWeb3', function() {
  return typeof web3 !== 'undefined';
});

Template.registerHelper('getCurrentNetwork', function() {
  if (web3) {
    web3.version.getNetwork((err, netId) => {
      Session.set('currentNetwork', netId);
    });

    switch (Session.get('currentNetwork')) {
      case '1':
        return 'Main Network';
        break
      case '2':
        return 'Morden Test Network';
        break
      case '3':
        return 'Ropsten Test Network';
        break
      case '4':
        return 'Rinkeby Test Network';
        break
      case '42':
        return 'Kovan Test Network';
        break
      default:
        return 'Unknown Network';
    }
  }
});

/*
Template.registerHelper('getDefaultAccount', function() {
  if (web3) {
    return Session.set('account', web3.eth.defaultAccount);
  }
});
*/

Template.registerHelper('getBalance', function(address) {
  if (web3) {
    web3.eth.getBalance(address, function(error, wei) {
      if (!error) {
        let balance = web3.fromWei(wei.toString(), 'ether');
        return balance;
      } else {
        console.log(error);
      }
    });
  }
});
