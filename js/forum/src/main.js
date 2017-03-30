import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import Model from 'flarum/Model';
import UserControls from 'flarum/utils/UserControls';
import Discussion from 'flarum/models/Discussion';
import User from 'flarum/models/User';
import addStrikeControls from 'Reflar/UserManagement/addStrikeControls';
import ModStrikeModal from 'Reflar/UserManagement/components/ModStrikeModal';


app.initializers.add('Reflar-User-Management', function(app) {

    Discussion.prototype.canStrike = Model.attribute('canStrike');
  
    User.prototype.canViewStrike = Model.attribute('canViewStrike');
    User.prototype.canActivate = Model.attribute('canActivate');
    User.prototype.strikes = Model.attribute('strikes');

    extend(UserControls, 'moderationControls', function(items, user) {
    if (user.canViewStrike()) {
      items.add('strikes', Button.component({
        children: app.translator.trans('reflar-usermanagement.forum.user_controls.strike_button'),
        icon: 'times',
        onclick: function() {
          app.modal.show(new ModStrikeModal({user}));
        }
        
      }));
    }
      if ({user}.user.data.attributes.isActivated == 0 && user.canActivate()) {
       items.add('approve', Button.component({
        children: app.translator.trans('reflar-usermanagement.forum.user_controls.activate_button'),
        icon: 'check',
        onclick: function() {
          app.request({
             url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/activate',
             method: 'POST',
             data: {username: {user}.user.data.attributes.username}
          }).then(function () {
             return window.location.reload();
          });
        }
        
      }));
      }
  });
  
    addStrikeControls();
});