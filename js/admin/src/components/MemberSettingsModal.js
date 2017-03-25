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
          state: this.setting('ReFlar-emailRegEnabled')(),
          children: app.translator.trans('Reflar-registration.admin.modal.switch_label'),
          onchange: this.setting('ReFlar-emailRegEnabled')
        })}
      </div>,
      <div className="Form-group">
        <label>
          {app.translator.trans('Reflar-registration.admin.modal.page_label')}
        </label>
        <input className="FormControl" type="number" bidi={this.setting('ReFlar-amountPerPage')} />
      </div>
    ];
  }
}