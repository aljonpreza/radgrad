import { Template } from 'meteor/templating';

Template.Advisor_Home_Page.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Advisor_Home_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Advisor_Home_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Advisor_Home_Page.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
  this.$('.tabular.menu .item').tab({
    alwaysRefresh: true,
  });
});
