// https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md

Template.loginModal.events({
  'click #LoginButtonMM': function(e) {
    e.preventDefault();

    let user_address = web3.eth.defaultAccount;
    console.log('user_address: ' + user_address);

    Meteor.call('user.generateNewLoginAttempt', user_address, function(err, nonce) {
      // nonce = the nonce generated on server
      console.log('nonce: ' + nonce);
      // hash nonce
      let sh3_nonce = web3.sha3(nonce); // depending on web3 version use: web3.utils.sha3(nonce)
      console.log('sh3 hashed nonce: ' + sh3_nonce);

      // sign hashed nonce
      web3.eth.sign(user_address, sh3_nonce, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          // res = the signed nonce
          // login with signed nonce
          login(res);
        }
      });

    });

  }
});

function login(signed_nonce) {
  let user_address = web3.eth.defaultAccount;

  Meteor.call('user.login', user_address, signed_nonce, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      //Meteor.loginWithToken(stampedLoginToken.token);
      Meteor.loginWithToken(res.token);
      $('#loginModal').modal('hide');
    }
  });

}
