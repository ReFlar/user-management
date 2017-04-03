import app from 'flarum/app';
import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import extractText from 'flarum/utils/extractText';
import Model from 'flarum/Model';
import UserControls from 'flarum/utils/UserControls';
import Discussion from 'flarum/models/Discussion';
import LogInButtons from 'flarum/components/LogInButtons';
import User from 'flarum/models/User';
import SignUpModal from 'flarum/components/SignUpModal';
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
  SignUpModal.prototype.init = function() {
    this.username = m.prop(this.props.username || '');

    this.email = m.prop(this.props.email || '');

    this.password = m.prop(this.props.password || '');
    
    this.age = m.prop(this.props.age || '');
    
    this.gender = m.prop(this.props.gender || '');
    
  }
  
   SignUpModal.prototype.body = function() {
    return [
      this.props.token ? '' : <LogInButtons/>,

      <div className="Form Form--centered">
        <div className="Form-group">
          <input className="FormControl" name="username" type="text" placeholder={extractText(app.translator.trans('core.forum.sign_up.username_placeholder'))}
            value={this.username()}
            onchange={m.withAttr('value', this.username)}
            disabled={this.loading} />
        </div>
      {app.forum.data.attributes['ReFlar-emailRegEnabled'] != 1  ? 
        <div className="Form-group">
          <input className="FormControl" name="email" type="email" placeholder={extractText(app.translator.trans('core.forum.sign_up.email_placeholder'))}
            value={this.email()}
            onchange={m.withAttr('value', this.email)}
            disabled={this.loading || (this.props.token && this.props.email)} />
        </div>
        :  ''}
        {this.props.token ? '' : (
          <div className="Form-group">
            <input className="FormControl" name="password" type="password" placeholder={extractText(app.translator.trans('core.forum.sign_up.password_placeholder'))}
              value={this.password()}
              onchange={m.withAttr('value', this.password)}
              disabled={this.loading} />
          </div>
        )}
        {app.forum.data.attributes['ReFlar-genderRegEnabled'] != 1 ? '' : ( 
        <div className="Form-group">
          <select className="FormControl" onchange={m.withAttr('value', this.gender)}>
            <option value="" disabled selected>{app.translator.trans('reflar-usermanagement.forum.signup.gender')}</option>
            <option value="Male">{app.translator.trans('reflar-usermanagement.forum.signup.male')}</option>
            <option value="Female">{app.translator.trans('reflar-usermanagement.forum.signup.female')}</option>
            <option value="Other">{app.translator.trans('reflar-usermanagement.forum.signup.other')}</option>
          </select>
        </div>
        )}
        {app.forum.data.attributes['ReFlar-ageRegEnabled'] != 1 ? '' : (
        <div className="Form-group">
            <input className="FormControl" name="age" type="number" placeholder={extractText(app.translator.trans('reflar-usermanagement.forum.signup.age'))}
              value={this.age()}
              onchange={m.withAttr('value', this.age)}
              disabled={this.loading} />
          </div>
        )}
        <div className="Form-group">
          <Button
            className="Button Button--primary Button--block"
            type="submit"
            loading={this.loading}>
            {app.translator.trans('core.forum.sign_up.submit_button')}
          </Button>
        </div>
      </div>
    ];
  }
  
  SignUpModal.prototype.onsubmit = function(e) {
     e.preventDefault();

    this.loading = true;

    const data = this.submitData();

    app.request({
      url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/register',
      method: 'POST',
      data,
      errorHandler: this.onerror.bind(this)
    }).then(
      () => window.location.reload(),
      this.loaded.bind(this)
    );
  }
 extend(SignUpModal.prototype, 'submitData', function (data) {
    const newData = data;
    newData['age'] = this.age();
    newData['gender'] = this.gender();
    return newData;
  });

    addStrikeControls();
});