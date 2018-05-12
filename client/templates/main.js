Template.main.events({
  'click #logOut': function(e) {
    console.log('logging out user');
    Meteor.logout();
  }
});
