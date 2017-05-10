/**
 * @polymerBehavior Polymer.C4CListView
 */
Polymer.C4CListView = {
  properties: {
    auth: {
      type: Object
    },
    title: {
      type: String,
      value: ''
    },
    route: {
      type: Object,
      notify: true
    },
    routeData: {
      type: Object,
      notify: true
    },
    subroute: {
      type: Object,
      notify: true
    },
    subrouteData: {
      type: Object,
      notify: true
    },
    doc: {
      type: Object,
      notify: true
    },
    db: {
      type: Object,
      notify: true
    },
    subPageTitle: {
      type: String,
      computed: '__computeSubPageTitle(__selectedItem)',
      notify: true
    },
    __loadMode: {
      type: String,
      value: 'loading'
    },
    __pageMode: {
      type: String,
      value: 'list'
    },
    __mode: {
      type: String,
      value: ''
    },
    __fab: {
      type: Object
    },
    __rmItemDialog: {
      type: Object
    },
    __editItemDialog: {
      type: Object
    },
    __dialogOpen: {
      type: Boolean,
      computed: '__computeDialogOpen(__mode)'
    },
    __dialogTitle: {
      type: String,
      computed: '__computeDialogTitle(title, __mode)'
    },
    __dialogSubmitTitle: {
      type: String,
      computed: '__computeDialogSubmitTitle(__mode)'
    },
    __selectedItem: {
      type: Object,
      value: {}
    },
    __editItem: {
      type: Object,
      value: {}
    }
  },
  observers: [
    '__authStatus(auth.user)',
    '__docStatus(doc.status)',
    '__itemCommitted(__editItem.*)',
    '__subroutePath(subroute.path,subrouteData.id)'
  ],

  attached: function () {
    this.__tryLoadData();
  },
  __authStatus: function () {
    this.__tryLoadData();
  },

  __tryLoadData: function () {
    this.__silly(this.doc);
    if (this.doc.status === 'done') {
      this.__loadMode = 'loaded';
      return;
    }

    // if (this.doc.status === 'uninitialised') {
    //   this.set('doc.status', 'initialise');
    // }
  },
  __docStatus: function () {
    if (this.doc.status !== 'done') {
      return;
    }
    this.__loadMode = 'loaded';

    this.__debug(this.__pageMode);
    if (this.__pageMode === 'detail') {
      this.__assert(this.subrouteData.id);
      this.__selectedItem = this.__itemFromId(this.subrouteData.id);
    }
  },

  __viewItem: function(ev) {
    this.__debug(ev.model.get('index'));
    this.__selectedItem = ev.model.get('item');
    // this.__debug(this.subroute);
    this.set('subroute.path',`/${this.__selectedItem.id}`);
    this.set('subrouteData.id', this.__selectedItem.id);
    this.__debug(this.subroute);
  },
  __addItem: function () {
    this.__editItem = {};
    this.set('__mode', 'add');
    this.__fab.disabled = true;
  },
  __rmItem: function (ev) {
    this.__selectedItem = ev.model.get('item');
    this.__rmItemDialog.open();
    this.__fab.disabled = true;
  },
  __updateItem: function (ev) {
    this.__editItem = ev.model.get('item');
    this.__fab.disabled = true;
    this.__mode = 'update';
  },

  __rmItemConfirmed: function () {
    if (this.__selectedItem === null) {
      this.__warn("tried to delete without selecting");
      return;
    }
    this.splice('doc.data', this.__indexFromId(this.__selectedItem.id), 1);
  },
  __dialogClosed: function () {
    this.$.fab.disabled = false;
    this.__mode = '';
  },
  __itemCommitted: function () {
    if (this.__mode === '') {
      return;
    }
    let clone = Object.assign({}, this.__editItem);
    this.__debug(clone);
    if (this.__mode === 'add') {
      this.push('doc.data', clone);
    } else {
      this.set(['doc.data', this.__indexFromId(this.__selectedItem.id)], clone);
    }
  },

  __subroutePath: function() {
    this.__debug('__subroutePath');
    this.__debug(this.get('subroute.path'));
    this.__debug(this.get('subrouteData.id'));
    if (!this.subroute.path) {
      this.__pageMode = 'list';
      this.__selectedItem = null;
      return;
    }

    this.__selectedItem = this.__itemFromId(this.get('subrouteData.id'));
    this.__debug(this.get('__selectedItem.name'));
    this.__pageMode = 'detail';
  },

  __itemFromId: function(id) {
    this.__debug('__itemFromId');
    if (this.__loadMode === 'loading') {
      this.__debug('__itemFromId:loading');
      return null;
    }
    return this.doc.data.find(i => i.id === id);
  },

  __indexFromId: function(id) {
    if (this.__loadMode === 'loading') {
      return null;
    }
    return this.doc.data.findIndex(i => i.id === id);
  },
  __computeSubPageTitle: function() {
    return this.__selectedItem ? this.__selectedItem.name : ''
  },
  __computeDialogTitle: function(title, __mode) {
    if (!__mode) {
      return;
    }

    let titles = {
      'add': `Add ${this.title}`,
      'update': `Update ${this.title}`
    };
    this.__silly(`title: ${__mode}: ${titles[__mode]}`);
    return titles[__mode];
  },
  __computeDialogSubmitTitle: function(__mode) {
    if (!__mode) {
      return;
    }
    let titles = {
      'add': 'Add',
      'update': 'Update'
    };
    this.__silly(`submit: ${__mode}: ${titles[__mode]}`);
    return titles[__mode];
  },
  __computeDialogOpen: function(__mode) {
    this.__silly(`open: ${__mode}`);
    return __mode === 'add' || __mode === 'update';
  },
}
