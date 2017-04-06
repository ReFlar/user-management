import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import humanTime from 'flarum/helpers/humanTime';
import FieldSet from 'flarum/components/FieldSet';

export default class AdminStrikeModal extends Modal {
  init() {
    super.init();
    
    this.user = this.props.user;
    
    
    app.request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/strike/'+this.user.data.id,
    }).then(
          response => {
            this.strikes = response.data;
            this.flatstrikes = [];
            for(i = 0; i < this.user.data.attributes.strikes; i++) {
              this.flatstrikes[i] = [];
              this.flatstrikes[i]['index'] = i+1;
              this.flatstrikes[i]['id'] = this.strikes[i].attributes['id'];
              this.flatstrikes[i]['actor'] = this.strikes[i].attributes['actor'];
              this.flatstrikes[i]['post'] = this.strikes[i].attributes['post'];
              this.flatstrikes[i]['time'] = new Date(this.strikes[i].attributes['time']);
            }
            m.redraw();
            this.loading = false;
    });
  }

  className() {
    return 'ModStrikeModal Modal';
  }

  title() {
    return app.translator.trans('reflar-usermanagement.forum.user_controls.modal.title', {user: this.user.username});
  }

  content() {
    return (
      m('div', {className: 'Modal-body'}, [
          m('div', {className: 'Form Form--centered'}, [
             FieldSet.component({
               className: 'ModStrikeModal--fieldset',
                children: [
                  (this.flatstrikes !== undefined ? 
                  m('table', {className: "NotificationGrid"}, [m('thead', [m('tr', [m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.number')]),m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.content')]),m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.actor')]),m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.time')]),m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.remove')])])]),m('tbody',[
                    this.flatstrikes.map((strike) => {
                      return [
                        m('tr', [m('td',[strike['index']]),m('td',[m('a', {target: "_blank", href: app.forum.attribute('baseUrl') + '/d/' + strike['post']},[app.translator.trans('reflar-usermanagement.forum.modal.view.link')])]),m('td',[m('a', {target: "_blank", href: app.forum.attribute('baseUrl') + '/u/' + strike['actor']},[strike['actor']])]),m('td',[humanTime(strike['time'])]),m('td',[m('a', {className: "icon fa fa-fw fa-times", onclick: ()=>{this.deleteStrike(strike['id'])}})])])
                      ]})])])
                       : m('tr', [m('td',[app.translator.trans('reflar-usermanagement.forum.modal.view.no_strikes')])])),
                  ]})
                  ]
              )]
          )
       )}
  
    deleteStrike(id) {

        if (this.loading) return;
      
        this.loading = true;

        app.request({
            method: 'Delete',
            url: app.forum.attribute('apiUrl') + '/strike/'+id
        }).then(app.modal.close(),
            this.loaded.bind(this)
        );
    }
}