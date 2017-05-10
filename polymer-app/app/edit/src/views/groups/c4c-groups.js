Polymer({
  is: 'c4c-groups',
  behaviors: [Polymer.C4CLogging, Polymer.C4CListView],
  properties: {
    logLevel: {
      type: Number,
      value: 3
    },
  },

  attached: function() {
    this.__fab = this.$.fab;
    this.__rmItemDialog = this.$.rmItemDialog;
    this.__editDialog = this.$.editItemDialog;
  },
});
