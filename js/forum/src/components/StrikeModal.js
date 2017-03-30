import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Discussion from 'flarum/models/Discussion';

export default class StrikeModal extends Modal {
    init() {
        super.init();

        this.post = this.props.id;
      
        this.reason = m.prop('');
      
        this.time = new Date();

    }

    className() {
        return 'StrikeModal Modal--small';
    }

    title() {
        return app.translator.trans('reflar-usermanagement.forum.modal.post.title');
    }

    content() {

        return [
            m('div', {className: 'Modal-body'}, [
                m('div', {className: 'Form Form--centered'}, [
                    m('div', {className: 'Form-group'}, [
                        m('label', {},  app.translator.trans('reflar-usermanagement.forum.modal.post.strike_reason')),
                        m('input', {
                            name: 'strike_reason',
                            placeholder: app.translator.trans('reflar-usermanagement.forum.modal.post.reason_placeholder'),
                            oninput: m.withAttr('value', this.reason)
                        })
                    ]),
                    m('div', {className: 'Form-group'}, [
                        m(Button, {
                            className: 'Button Button--primary',
                            type: 'submit',
                            loading: this.loading,
                            disabled: !this.reason()
                        }, app.translator.trans('reflar-usermanagement.forum.modal.post.submit_button'))
                    ])
                ])
            ])
        ];
    }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/strike',
            data: {
            "post_id": this.post,
            "reason": this.reason()
            }
        }).then(window.location.reload(),
            this.loaded.bind(this)
        );
    }
}