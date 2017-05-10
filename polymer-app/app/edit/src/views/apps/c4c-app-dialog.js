Polymer({
  is: 'c4c-app-dialog',
  behaviors: [Polymer.C4CLogging, Polymer.C4CEditDialog],
  properties: {
    logLevel: {
      type: Number,
      value: 3,
    },
    groups: {
      type: Array
    }
  }
});
