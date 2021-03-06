/*globals define,app,console*/

define( [
    'jquery', 'lodash', 'backbone',
    'text!src/views/crud/query.html',
    'src/utils/errorManager', 'src/utils/crud', 'src/utils/views', 'src/utils/query'
  ], function(
    $, _, Backbone,
    queryTemplate, ErrorManager, crud, views, query
  ) {

'use strict';

var QueryView = Backbone.View.extend({

  // empty copy of the model to 
  queryFields: undefined,

  initialize: function(options) {
    options = options || {};
    _.bindAll(this, 'query');

    this.queryFields = new this.collection.model().queryFields;

    if (options.template) { this.template = views.compileTemplate(options.template); }
  },

  // check that we have a valid function template
  _ensureTemplate: function() {
    var template = this.template;
    if (_.isFunction(template)) { return; }

    if (!template) { template = this.getDefaultTemplate(); }

    this.template = views.compileTemplate(template);
    this.delegateEvents();
  },

  // automatically generate a default template from the data in this.model.queryFields
  getDefaultTemplate: function() {
    // create a temp model just to get the queryFields
    var controlsTemplate = crud.generateFormTemplate(this.queryFields);
    var template = queryTemplate.replace('%controls%', controlsTemplate);
    return template;
  },

  render: function() {
    this._ensureTemplate();
    var model = query.queryToJson(this.collection.query);
    this.$el.html(this.template({ data: model }));
    return this;
  },

  errorManager: undefined,

  template: undefined,

  events: {
    'click #query-button'   : 'query'
  },

  query: function() {

    // TODO: find another way to get attrs
    var attrs = crud.getAttrsFromFields(this.queryFields, this.$el);

    var q = query.jsonToQuery(attrs);

    app.navigateWith({q: q}, {trigger: true});
  },

});

  return QueryView;
});