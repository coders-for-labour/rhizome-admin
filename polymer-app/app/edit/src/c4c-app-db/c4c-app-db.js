Polymer({
  is: 'c4c-app-db',
  behaviors: [Polymer.C4CLogging],
  properties: {
    auth: {
      type: Object
    },
    db: {
      type: Object,
      value: function() {
        return {
          org: {
            status: 'uninitialised',
            data: []
          },
          group: {
            status: 'uninitialised',
            data: []
          },
          app: {
            status: 'uninitialised',
            data: []
          }
        }
      },
      notify: true
    }
  },
  observers: [
    '__auth(auth.user)',
  ],

  attached: function() {
  },

  __auth: function() {
    if (!this.auth.user){
      return;
    }
    this.__debug('app-db:auth');
    // if (this.get('db.org.status') === 'uninitialised') {
    //   this.set('db.org.status', 'initialise');
    // }

    // this.set('db.group.status', 'initialise');
    // this.set('db.app.status', 'initialise');
  },
});
