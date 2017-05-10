Polymer({
  is: 'c4c-org-dialog',
  behaviors: [Polymer.C4CLogging, Polymer.C4CEditDialog],
  properties: {
    logLevel: {
      type: Number,
      value: 4,
    }
  }
});
