import app from 'flarum/app';
import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import MemberSettingsModal from 'Reflar/UserManagement/components/MemberSettingsModal'
import humanTime from 'flarum/helpers/humanTime';
import icon from 'flarum/helpers/icon';


function MemberItem(user) {
    const url = app.forum.attribute('baseUrl') + '/u/' + user.id();
    const online = user.isOnline();
    let activated = user.isActivated();
    
      return [
          m('li', {"data-id": user.id()}, [
              m('div', {className: 'MemberListItem-info'}, [
                  m('span', {className: 'MemberListItem-name'}, [
                      user.username(),
                  ]),
                  m('div', {className: 'MemberListItem-info' + (activated ? '1' : '0')}, [
                      activated
                          ? [m('span', {className: 'MemberCard-lastSeen' + (online ? ' online' : '')}, [
                                online 
                                    ? [icon('circle'), ' ', {className: 'MemberCard-online'}, app.translator.trans('reflar-usermanagement.admin.page.online_text')]
                                    : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]
                            ])]
                          : [m('span', {className: 'MemberCard-lastSeen'}, [
                                m('a', {
                                  className: 'Button Button--link',
                                  onclick: function onclick() {
                                     app.request({
                                          url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/activate',
                                          method: 'POST',
                                          data: {username: user.username()}
                                     }).then(function () {
                                          return window.location.reload();
                                        });
                                  }
                              }, [
                                  "Activate"
                              ])
                            ])]
                    ]),
                  m('span', {className: 'MemberListItem-comments'}, [
                      icon('comment-o'),
                      user.commentsCount()
                  ]),
                  m('span', {className: 'MemberListItem-discussions'}, [
                      icon('reorder'),
                      user.discussionsCount()
                  ]),
                  m('a', {
                      className: 'Button Button--link',
                      target: '_blank',
                      href: url
                  }, [
                      icon('eye')
                  ])
              ])
          ])
      ];
}

export default class MemberPage extends Page {
    init() {
        super.init();

        this.loading = true;
        this.moreResults = false;
        this.users = [];
        this.refresh();
    }

    view() {
        let loading;

        if (this.loading) {
            loading = LoadingIndicator.component();
        } else if (this.moreResults) {
            loading = Button.component({
                children: app.translator.trans('reflar-usermanagement.admin.page.load_more_button'),
                className: 'Button',
                onclick: this.loadMore.bind(this)
            });
        }

        return [
            m('div', {className: 'MemberListPage'}, [
                m('div', {className: 'MemberList-header'}, [
                    m('div', {className: 'container'}, [
                        m('p', {}, app.translator.trans('reflar-usermanagement.admin.page.about_text')),
                        Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('reflar-usermanagement.admin.page.settings'),
                            onclick: () => app.modal.show(new MemberSettingsModal())
                        })
                    ])
                ]),
                m('div', {className: 'MemberList-list'}, [
                    m('div', {className: 'container'}, [
                        m('div', {className: 'MemberListItems'}, [
                            m('label', {className: 'MemberListLabel'}, app.translator.trans('reflar-usermanagement.admin.page.list_title')),
                            m('ol', {
                                    className: 'MemberList'
                                },
                                [this.users.map(MemberItem)]
                            ),
                            m('div', {className: 'MemberList-loadMore'}, [loading])
                        ])
                    ])
                ])
            ])
        ];
    }

    refresh(clear = true) {
        if (clear) {
            this.loading = true;
            this.users = [];
        }

        return this.loadResults().then(
            results => {
                this.users = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }

    loadResults(offset) {
        const params = {};
        params.page = {
            offset: offset,
            limit: app.data.settings['ReFlar-amountPerPage']
        };
        params.sort = 'username';

        return app.store.find('users', params);
    }

    loadMore() {
        this.loading = true;

        this.loadResults(this.users.length)
            .then(this.parseResults.bind(this));
    }

    parseResults(results) {
        [].push.apply(this.users, results);

        this.loading = false;
        this.moreResults = !!results.payload.links.next;

        m.lazyRedraw();

        return results;
    }
}