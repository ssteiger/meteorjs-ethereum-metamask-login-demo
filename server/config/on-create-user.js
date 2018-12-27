// https://docs.meteor.com/api/accounts-multi.html#AccountsServer-onCreateUser

Accounts.onCreateUser(function(options, user) {
  user.address = options.address;
  user.nonce   = options.nonce;
  return user;
});
