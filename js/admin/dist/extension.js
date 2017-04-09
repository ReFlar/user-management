'use strict';

System.register('Reflar/UserManagement/addMembersListPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'Reflar/UserManagement/components/MemberPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, MemberPage;

    _export('default', function () {
        app.routes.members = { path: '/members', component: MemberPage.component() };

        app.extensionSettings['reflar-user-management'] = function () {
            return m.route(app.route('members'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('members', AdminLinkButton.component({
                href: app.route('members'),
                icon: 'address-book-o',
                children: app.translator.trans('reflar-usermanagement.admin.nav.title'),
                description: app.translator.trans('reflar-usermanagement.admin.nav.desc')
            }));
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_ReflarUserManagementComponentsMemberPage) {
            MemberPage = _ReflarUserManagementComponentsMemberPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/UserManagement/components/AdminStrikeModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/helpers/humanTime', 'flarum/components/FieldSet'], function (_export, _context) {
  "use strict";

  var Modal, Button, humanTime, FieldSet, AdminStrikeModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumHelpersHumanTime) {
      humanTime = _flarumHelpersHumanTime.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }],
    execute: function () {
      AdminStrikeModal = function (_Modal) {
        babelHelpers.inherits(AdminStrikeModal, _Modal);

        function AdminStrikeModal() {
          babelHelpers.classCallCheck(this, AdminStrikeModal);
          return babelHelpers.possibleConstructorReturn(this, (AdminStrikeModal.__proto__ || Object.getPrototypeOf(AdminStrikeModal)).apply(this, arguments));
        }

        babelHelpers.createClass(AdminStrikeModal, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            babelHelpers.get(AdminStrikeModal.prototype.__proto__ || Object.getPrototypeOf(AdminStrikeModal.prototype), 'init', this).call(this);

            this.user = this.props.user;

            app.request({
              method: 'GET',
              url: app.forum.attribute('apiUrl') + '/strike/' + this.user.data.id
            }).then(function (response) {
              _this2.strikes = response.data;
              _this2.flatstrikes = [];
              for (i = 0; i < _this2.user.data.attributes.strikes; i++) {
                _this2.flatstrikes[i] = [];
                _this2.flatstrikes[i]['index'] = i + 1;
                _this2.flatstrikes[i]['id'] = _this2.strikes[i].attributes['id'];
                _this2.flatstrikes[i]['actor'] = _this2.strikes[i].attributes['actor'];
                _this2.flatstrikes[i]['reason'] = _this2.strikes[i].attributes['reason'];
                _this2.flatstrikes[i]['post'] = _this2.strikes[i].attributes['post'];
                _this2.flatstrikes[i]['time'] = new Date(_this2.strikes[i].attributes['time']);
              }
              if (_this2.user.data.attributes.strikes == 0) {
                _this2.strikes = undefined;
              }
              m.redraw();
              _this2.loading = false;
            });
          }
        }, {
          key: 'className',
          value: function className() {
            if (this.strikes !== undefined) {
              return 'ModStrikeModal Modal';
            } else {
              return 'Modal Modal--small';
            }
          }
        }, {
          key: 'title',
          value: function title() {
            var username = this.user.data.attributes.username;
            return app.translator.trans('reflar-usermanagement.admin.modal.view.title', { username: username });
          }
        }, {
          key: 'content',
          value: function content() {
            var _this3 = this;

            return m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [FieldSet.component({
              className: 'AdminStrikeModal--fieldset',
              children: [this.strikes !== undefined ? m('table', { className: "NotificationGrid" }, [m('thead', [m('tr', [m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.number')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.reason')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.content')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.actor')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.time')]), m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.remove')])])]), m('tbody', [this.flatstrikes.map(function (strike) {
                return [m('tr', [m('td', [strike['index']]), m('td', [strike['reason']]), m('td', [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/d/' + strike['post'] }, [app.translator.trans('reflar-usermanagement.admin.modal.view.link')])]), m('td', [m('a', { target: "_blank", href: app.forum.attribute('baseUrl') + '/u/' + strike['actor'] }, [strike['actor']])]), m('td', [humanTime(strike['time'])]), m('td', [m('a', { className: "icon fa fa-fw fa-times", onclick: function onclick() {
                    _this3.deleteStrike(strike['id']);
                  } })])])];
              })])]) : m('tr', [m('td', [app.translator.trans('reflar-usermanagement.admin.modal.view.no_strikes')])])] })])]);
          }
        }, {
          key: 'deleteStrike',
          value: function deleteStrike(id) {

            if (this.loading) return;

            this.loading = true;

            app.request({
              method: 'Delete',
              url: app.forum.attribute('apiUrl') + '/strike/' + id
            }).then(app.modal.close(), this.loaded.bind(this));
          }
        }]);
        return AdminStrikeModal;
      }(Modal);

      _export('default', AdminStrikeModal);
    }
  };
});;
'use strict';

System.register('Reflar/UserManagement/components/MemberPage', ['flarum/app', 'flarum/components/Page', 'flarum/components/Button', 'flarum/components/LoadingIndicator', 'Reflar/UserManagement/components/MemberSettingsModal', 'flarum/helpers/humanTime', 'flarum/helpers/icon', 'Reflar/UserManagement/components/AdminStrikeModal'], function (_export, _context) {
    "use strict";

    var app, Page, Button, LoadingIndicator, MemberSettingsModal, humanTime, icon, AdminStrikeModal, MemberPage;


    function MemberItem(user) {
        var url = app.forum.attribute('baseUrl') + '/u/' + user.id();
        var online = user.isOnline();
        var activated = user.isActivated();

        return [m('li', { "data-id": user.id() }, [m('div', { className: 'MemberListItem-info' }, [m('span', { className: 'MemberListItem-name' }, [user.username()]), m('div', { className: 'MemberListItem-info' + (activated ? '1' : '0') }, [activated ? [m('span', { className: 'MemberCard-lastSeen' + (online ? ' online' : '') }, [online ? [icon('circle'), ' ', { className: 'MemberCard-online' }, app.translator.trans('reflar-usermanagement.admin.page.online_text')] : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]])] : [m('span', { className: 'MemberCard-lastSeen' }, [m('a', {
            className: 'Button Button--link',
            onclick: function onclick() {
                app.request({
                    url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/attributes',
                    method: 'POST',
                    data: { username: user.username() }
                }).then(function () {
                    return window.location.reload();
                });
            }
        }, [app.translator.trans('reflar-usermanagement.admin.page.activate')])])]]), m('span', { className: 'MemberListItem-comments' }, [icon('comment-o'), user.commentsCount()]), m('span', { className: 'MemberListItem-discussions' }, [icon('reorder'), user.discussionsCount()]), Button.component({
            className: 'Button Button--link',
            icon: 'times',
            onclick: function onclick(e) {
                e.preventDefault();
                app.modal.show(new AdminStrikeModal({ user: user }));
            }
        }), m('a', {
            className: 'Button Button--link',
            target: '_blank',
            href: url
        }, [icon('eye')])])])];
    }

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_ReflarUserManagementComponentsMemberSettingsModal) {
            MemberSettingsModal = _ReflarUserManagementComponentsMemberSettingsModal.default;
        }, function (_flarumHelpersHumanTime) {
            humanTime = _flarumHelpersHumanTime.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_ReflarUserManagementComponentsAdminStrikeModal) {
            AdminStrikeModal = _ReflarUserManagementComponentsAdminStrikeModal.default;
        }],
        execute: function () {
            MemberPage = function (_Page) {
                babelHelpers.inherits(MemberPage, _Page);

                function MemberPage() {
                    babelHelpers.classCallCheck(this, MemberPage);
                    return babelHelpers.possibleConstructorReturn(this, (MemberPage.__proto__ || Object.getPrototypeOf(MemberPage)).apply(this, arguments));
                }

                babelHelpers.createClass(MemberPage, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(MemberPage.prototype.__proto__ || Object.getPrototypeOf(MemberPage.prototype), 'init', this).call(this);

                        this.loading = true;
                        this.moreResults = false;
                        this.users = [];
                        this.refresh();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var loading = void 0;

                        if (this.loading) {
                            loading = LoadingIndicator.component();
                        } else if (this.moreResults) {
                            loading = Button.component({
                                children: app.translator.trans('reflar-usermanagement.admin.page.load_more_button'),
                                className: 'Button',
                                onclick: this.loadMore.bind(this)
                            });
                        }

                        return [m('div', { className: 'MemberListPage' }, [m('div', { className: 'MemberList-header' }, [m('div', { className: 'container' }, [m('p', {}, app.translator.trans('reflar-usermanagement.admin.page.about_text')), Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('reflar-usermanagement.admin.page.settings'),
                            onclick: function onclick() {
                                return app.modal.show(new MemberSettingsModal());
                            }
                        })])]), m('div', { className: 'MemberList-list' }, [m('div', { className: 'container' }, [m('div', { className: 'MemberListItems' }, [m('label', { className: 'MemberListLabel' }, app.translator.trans('reflar-usermanagement.admin.page.list_title')), m('ol', {
                            className: 'MemberList'
                        }, [this.users.map(MemberItem)]), m('div', { className: 'MemberList-loadMore' }, [loading])])])])])];
                    }
                }, {
                    key: 'refresh',
                    value: function refresh() {
                        var _this2 = this;

                        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                        if (clear) {
                            this.loading = true;
                            this.users = [];
                        }

                        return this.loadResults().then(function (results) {
                            _this2.users = [];
                            _this2.parseResults(results);
                        }, function () {
                            _this2.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: 'loadResults',
                    value: function loadResults(offset) {
                        var params = {};
                        params.page = {
                            offset: offset,
                            limit: app.data.settings['ReFlar-amountPerPage']
                        };
                        params.sort = 'username';

                        return app.store.find('users', params);
                    }
                }, {
                    key: 'loadMore',
                    value: function loadMore() {
                        this.loading = true;

                        this.loadResults(this.users.length).then(this.parseResults.bind(this));
                    }
                }, {
                    key: 'parseResults',
                    value: function parseResults(results) {
                        [].push.apply(this.users, results);

                        this.loading = false;
                        this.moreResults = !!results.payload.links.next;

                        m.lazyRedraw();

                        return results;
                    }
                }]);
                return MemberPage;
            }(Page);

            _export('default', MemberPage);
        }
    };
});;
'use strict';

System.register('Reflar/UserManagement/components/MemberSettingsModal', ['flarum/app', 'flarum/extend', 'flarum/components/SettingsModal', 'flarum/components/Switch'], function (_export, _context) {
  "use strict";

  var app, extend, SettingsModal, Switch, MemberSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }, function (_flarumComponentsSwitch) {
      Switch = _flarumComponentsSwitch.default;
    }],
    execute: function () {
      MemberSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(MemberSettingsModal, _SettingsModal);

        function MemberSettingsModal() {
          babelHelpers.classCallCheck(this, MemberSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (MemberSettingsModal.__proto__ || Object.getPrototypeOf(MemberSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(MemberSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'SettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('reflar-usermanagement.admin.modal.settings_title');
          }
        }, {
          key: 'form',
          value: function form() {
            return [m(
              'div',
              { className: 'Form-group' },
              Switch.component({
                className: "SettingsModal-switch",
                state: this.setting('ReFlar-emailRegEnabled')(),
                children: app.translator.trans('reflar-usermanagement.admin.modal.email_switch'),
                onchange: this.setting('ReFlar-emailRegEnabled')
              }),
              Switch.component({
                className: "SettingsModal-switch",
                state: this.setting('ReFlar-genderRegEnabled')(),
                children: app.translator.trans('reflar-usermanagement.admin.modal.gender_label'),
                onchange: this.setting('ReFlar-genderRegEnabled')
              }),
              Switch.component({
                className: "SettingsModal-switch",
                state: this.setting('ReFlar-ageRegEnabled')(),
                children: app.translator.trans('reflar-usermanagement.admin.modal.age_label'),
                onchange: this.setting('ReFlar-ageRegEnabled')
              }),
              Switch.component({
                className: "SettingsModal-switch",
                state: this.setting('ReFlar-recaptcha')(),
                children: app.translator.trans('reflar-usermanagement.admin.modal.recaptcha'),
                onchange: this.setting('ReFlar-recaptcha')
              })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('reflar-usermanagement.admin.modal.amount_label')
              ),
              m('input', { className: 'FormControl', type: 'number', bidi: this.setting('ReFlar-amountPerPage') })
            )];
          }
        }]);
        return MemberSettingsModal;
      }(SettingsModal);

      _export('default', MemberSettingsModal);
    }
  };
});;
'use strict';

System.register('Reflar/UserManagement/main', ['flarum/extend', 'Reflar/UserManagement/addMembersListPane', 'flarum/components/PermissionGrid'], function (_export, _context) {
  "use strict";

  var extend, addMembersListPane, PermissionGrid;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_ReflarUserManagementAddMembersListPane) {
      addMembersListPane = _ReflarUserManagementAddMembersListPane.default;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }],
    execute: function () {

      app.initializers.add('Reflar-User-Management', function (app) {
        addMembersListPane();

        extend(PermissionGrid.prototype, 'moderateItems', function (items) {
          items.add('activate', {
            icon: 'address-card-o',
            label: app.translator.trans('reflar-usermanagement.admin.activate_perm_item'),
            permission: 'user.activate'
          });
          items.add('strike', {
            icon: 'times',
            label: app.translator.trans('reflar-usermanagement.admin.strike_perm_item'),
            permission: 'discussion.strike'
          });
          items.add('viewStrikes', {
            icon: 'eye',
            label: app.translator.trans('reflar-usermanagement.admin.viewstrike_perm_item'),
            permission: 'user.strike'
          });
        });
      });
    }
  };
});