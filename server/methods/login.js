import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {});

Meteor.methods({
  'user.generateNewLoginAttempt': function(user_address) {
    let exists = Meteor.users.findOne({username: user_address});
    let nonce = Random.secret(16);

    if (exists) {
      // user already exists, update nonce
      Meteor.users.update(exists._id, {$set: {nonce: nonce}});
    } else {
      // create new user
      let userId = Accounts.createUser({
        username: user_address,
        address: user_address,
        nonce: nonce
      });
    }

    return nonce;
  },
  'user.login': function(user_address, signed_nonce) {
    let user = Meteor.users.findOne({username: user_address});

    if (user) {
      // hash the nonce retrieved from database
      let sh3_nonce = web3.utils.sha3(user.nonce);

      // https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#recover
      let v = '0x' + signed_nonce.slice(130,134);
      let r = signed_nonce.slice(0,66);
      let s = '0x' + signed_nonce.slice(66,130);

      // recover public key from hashed nonce
      let public_key = web3.eth.accounts.recover({
        messageHash: sh3_nonce,
        v: v,
        r: r,
        s: s
      });

      // make sure we have both addresses in the same format
      public_key    = web3.utils.toChecksumAddress(public_key);
      user.username = web3.utils.toChecksumAddress(user.username);

      // check if users public key matches the address
      // of the private key that was used to hash the nonce
      if (public_key === user.username) {
        // success, now login user
        let stampedLoginToken = Accounts._generateStampedLoginToken();
        Accounts._insertLoginToken(user._id, stampedLoginToken);
        console.log('Success! Returning login token!');
        return stampedLoginToken;
      } else {
        throw new Meteor.Error('Login attempt not valid');
      }
    } else {
      // user with address not found
      throw new Meteor.Error('Login attempt not valid');
    }
  }
});
