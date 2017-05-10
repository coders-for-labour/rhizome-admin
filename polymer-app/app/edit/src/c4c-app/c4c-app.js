Polymer({
  is: 'c4c-app',
  behaviors: [
    Polymer.C4CLogging
  ],
  properties: {
    mode: {
      type: String,
      value: "authenticating"
    },
    authStatus: {
      type: String,
      value: "idle",
    },
    context: {
      type: Object,
      value: function() {
        return {
          auth: {},
          db: {},
          page: '',
          title: '',
          route: {},
          routeData: {},
          subroute: {},
          subrouteData: {}
        };
      }
    },
    auth: {
      type: Object,
      value: {
        user: null,
      },
      notify: true
    },
    db: {
      type: Object
    },
    page: {
      type: String,
      reflectToAttribute: true,
      observer: '__pageChanged'
    },
    subPageTitle: {
      type: String
    },
    mainTitle: {
      type: String,
      computed: '__computeMainTitle(page, subPageTitle)'
    },
    __hideMenuButton: {
      type: Boolean,
      computed: '__computeHideMenuButton(subroute.path)'
    },
    __hideBackButton: {
      type: Boolean,
      computed: '__computeHideBackButton(subroute.path)'
    }
  },

  observers: [
    '__routePageChanged(routeData.page)',
    '__authChanged(authStatus)'
  ],

  attached: function() {
    this.authStatus = "begin";
  },

  __toggleDrawer: function() {
    this.$.drawer.toggle();
  },

  __routePageChanged: function(page) {
    this.page = page || 'orgs';
  },

  __pageChanged: function(page) {
    // Load page import on demand. Show 404 page if fails
    var resolvedPageUrl = this.resolveUrl(`../views/${page}/c4c-${page}.html`);
    this.importHref(resolvedPageUrl, null, this.__showPage404, true);
  },

  __authChanged: function() {
    if ( this.authStatus !== "done") {
      return;
    }
    this.__debug(this.auth.user);
    if (this.auth.user) {
      this.mode = "application";
    } else {
      this.mode = "authenticate";
    }
  },
  __dataServiceError: function(ev) {
    this.__silly(ev);

    this.$.toast.text = ev.detail.error.message;
    this.$.toast.open();
  },

  __showPage404: function() {
    this.page = 'view404';
  },

  __backButton: function() {
    this.set('subroute.path', '');
  },

  __computeMainTitle: function(page) {
    if (this.subPageTitle) {
      return this.subPageTitle;
    }
    let titles = {
      'orgs': 'Organisations',
      'apps': 'Applications',
      'groups': 'Groups'
    };
    if (!page || !titles[page]) {
      return 'Admin';
    }
    return titles[page];
  },

  __computeHideMenuButton: function() {
    return this.subroute.path ? true : false
  },
  __computeHideBackButton: function() {
    return this.subroute.path ? false : true
  }
});
