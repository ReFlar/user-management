import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';

export default class MemberSettingsModal extends SettingsModal {
  className() {
    return 'SettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('Reflar-registration.admin.modal.settings_title');
  }

  form() {
    return [
      <div className="Form-group">
        {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-emailRegEnabled')() || false,
          children: app.translator.trans('Reflar-registration.admin.modal.email_switch'),
          onchange: this.setting('ReFlar-emailRegEnabled')
        })}
      {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-genderRegEnabled')() || false,
          children: app.translator.trans('Reflar-registration.admin.modal.gender_label'),
          onchange: this.setting('ReFlar-genderRegEnabled')
        })}
      {Switch.component({
          className: "SettingsModal-switch",
          state: this.setting('ReFlar-ageRegEnabled')() || false,
          children: app.translator.trans('Reflar-registration.admin.modal.age_label'),
          onchange: this.setting('ReFlar-ageRegEnabled')
        })} 
      </div>
      <div className="Form-group">
        <label>
          {app.translator.trans('Reflar-registration.admin.modal.amount_label')}
        </label>
        <input className="FormControl" type="number" bidi={this.setting('ReFlar-amountPerPage')} />
      </div>
    ];
  }
}