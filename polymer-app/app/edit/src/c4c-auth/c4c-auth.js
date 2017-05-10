Polymer({
  is: "c4c-auth",
  properties: {
    auth: {
      type: Object,
      value: {
        user: null
      },
      notify: true
    }
  },
  attached: function() {
  },
  login: function() {
    location.href = "/auth/google";
  }

});
