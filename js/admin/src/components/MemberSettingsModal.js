import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';

export default class MemberSettingsModal extends SettingsModal {
  className() {
    return 'SettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('reflar-usermanagement.admin.modal.settings_title');
  }

  form() {
    return [
      <div className="Form-group">
        {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-emailRegEnabled')(),
          children: app.translator.trans('reflar-usermanagement.admin.modal.email_switch'),
          onchange: this.setting('ReFlar-emailRegEnabled')
        })}
      {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-genderRegEnabled')(),
          children: app.translator.trans('reflar-usermanagement.admin.modal.gender_label'),
          onchange: this.setting('ReFlar-genderRegEnabled')
        })}
      {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-ageRegEnabled')(),
          children: app.translator.trans('reflar-usermanagement.admin.modal.age_label'),
          onchange: this.setting('ReFlar-ageRegEnabled')
        })} 
      {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-recaptcha')(),
          children: app.translator.trans('reflar-usermanagement.admin.modal.recaptcha'),
          onchange: this.setting('ReFlar-recaptcha')
        })} 
      </div>,
      <div className="Form-group">
        <label>
          {app.translator.trans('reflar-usermanagement.admin.modal.amount_label')}
        </label>
        <input className="FormControl" type="number" bidi={this.setting('ReFlar-amountPerPage')} />
      </div>
    ];
  }
}