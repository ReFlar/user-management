import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class ModStrikeModal extends Modal {
  init() {
    super.init();
    this.user = m.prop(this.props.user);
        app.request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/strike/'+this.user.data.id,
    }).then(
          response => {
            this.codes = response.data.attributes;
            this.flatcodes = [];
            for(var k in this.codes) {
              this.flatcodes[k] = [];
              this.flatcodes[k]['index'] = k;
              this.flatcodes[k]['actor'] = this.codes[k]['actor'];
              this.flatcodes[k]['content'] = this.codes[k]['content'];
              this.flatcodes[k]['time'] = this.codes[k]['time'];
            }
            m.redraw();
            this.loading = false;
            this.handleErrors(response);
    });
  }

  className() {
    return 'ModStrikeModal Modal--small';
  }

  title() {
    return app.translator.trans('reflar-usermanagement.forum.user_controls.modal.title', {user: this.user});
  }

  content() {
    return (
      <div className="Modal-body">
        
      </div>
    );
  }
}