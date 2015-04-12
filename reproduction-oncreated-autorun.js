if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 5);

  Template.users.helpers({
    users: function () {
      console.log("this runned");
      return Meteor.users.find();
    }
  });

  Template.users.onCreated(function() {
    var self = this;
    this.autorun(function() {
      if (Session.get('counter')) {
        self.subscribe('users', Session.get('counter'));
      }
    });
  });

  Template.users.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 10);
    }
  });
}

if (Meteor.isServer) {
  // Add Fake users
  if(Meteor.users.find().count() === 0){
    _.each(_.range(100), function() {
      var username = faker.internet.userName();
      var userId = Accounts.createUser({
        username: username,
        profile: {
          name: faker.name.findName(),
          CNPJORCPF: faker.random.number(),
          pictureId: faker.image.avatar(),
          local: {country: faker.address.country()}
        },
        email: faker.internet.email(),
        password: 'password'
      });
    });
  }
  Meteor.publish('users', function(limit) {
    return Meteor.users.find({},
      { fields: {
          createdAt: 1,
          username:1,
          emails: 1,
          profile: 1,
          following: 1,
          followers: 1,
          roles: 1
        },
        limit: limit
      }
    );
  });
}

Router.route('/', function () {
  layoutTemplate: 'layout';
  this.render('users');
});


