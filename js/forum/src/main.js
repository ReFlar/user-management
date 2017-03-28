import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import Model from 'flarum/Model';
import UserControls from 'flarum/utils/UserControls';
import Discussion from 'flarum/models/Discussion';
import User from 'flarum/models/User';
import addStrikeControls from 'Reflar/UserManagement/addStrikeControls';


app.initializers.add('Reflar-User-Management', function(app) {

    Discussion.prototype.canStrike = Model.attribute('canStrike');
    User.prototype.canViewStrike = Model.attribute('canViewStrike');

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
  });
  
    addStrikeControls();
});