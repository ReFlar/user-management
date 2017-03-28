'use strict';

System.register('Reflar/UserManagement/addStrikeControls', ['flarum/extend', 'flarum/app', 'flarum/utils/PostControls', 'flarum/components/Button', 'flarum/components/CommentPost', 'flarum/components/DiscussionPage', 'Reflar/UserManagement/components/StrikeModal'], function (_export, _context) {
    "use strict";

    var extend, app, PostControls, Button, CommentPost, DiscussionPage, StrikeModal;

    _export('default', function () {

        extend(PostControls, 'moderationControls', function (items, post) {
            var discussion = post.discussion();
            var id = post.data.attributes.id;

            if (!discussion.canStrike()) return;

            items.add('serveStrike', [m(Button, {
                icon: 'times',
                className: 'refar-usermanagement-strikeButon',
                onclick: function onclick() {
                    app.modal.show(new StrikeModal({ id: id }));
                }
            }, app.translator.trans('reflar-usermanagement.forum.post_controls.strike_button'))]);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsPostControls) {
            PostControls = _flarumUtilsPostControls.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_ReflarUserManagementComponentsStrikeModal) {
            StrikeModal = _ReflarUserManagementComponentsStrikeModal.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/UserManagement/components/ModStrikesModal', ['flarum/components/Modal', 'flarum/components/Button'], function (_export, _context) {
  "use strict";

  var Modal, Button, ModStrikeModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }],
    execute: function () {
      ModStrikeModal = function (_Modal) {
        babelHelpers.inherits(ModStrikeModal, _Modal);

        function ModStrikeModal() {
          babelHelpers.classCallCheck(this, ModStrikeModal);
          return babelHelpers.possibleConstructorReturn(this, (ModStrikeModal.__proto__ || Object.getPrototypeOf(ModStrikeModal)).apply(this, arguments));
        }

        babelHelpers.createClass(ModStrikeModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(ModStrikeModal.prototype.__proto__ || Object.getPrototypeOf(ModStrikeModal.prototype), 'init', this).call(this);
            this.user = m.prop(this.props.user);
          }
        }, {
          key: 'className',
          value: function className() {
            return 'ModStrikeModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('reflar-usermanagement.forum.user_controls.modal.title', { user: this.user });
          }
        }, {
          key: 'content',
          value: function content() {
            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'Form' },
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    'label',
                    null,
                    app.translator.trans('antoinefr-money.forum.modal.current'),
                    ' ',
                    app.forum.data.attributes['antoinefr-money.moneyname'].replace('{money}', this.props.user.data.attributes['antoinefr-money.money'])
                  ),
                  m('input', { required: true, className: 'FormControl', type: 'number', step: 'any', value: this.money(), oninput: m.withAttr('value', this.money) })
                ),
                m(
                  'div',
                  { className: 'Form-group' },
                  m(
                    Button,
                    { className: 'Button Button--primary', loading: this.loading, type: 'submit' },
                    app.translator.trans('antoinefr-money.forum.modal.submit_button')
                  )
                )
              )
            );
          }
        }, {
          key: 'load',
          value: function load() {

            this.loading = true;
            m.redraw();

            console.log(app.store.find('strikes', 1));
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this2 = this;

            e.preventDefault();

            this.loading = true;

            this.props.user.save({ 'money': this.money() }).then(function () {
              return _this2.hide();
            }, this.loaded.bind(this));
          }
        }]);
        return ModStrikeModal;
      }(Modal);

      _export('default', ModStrikeModal);
    }
  };
});;
'use strict';

System.register('Reflar/UserManagement/components/StrikeModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/models/Discussion'], function (_export, _context) {
    "use strict";

    var Modal, Button, Discussion, StrikeModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }],
        execute: function () {
            StrikeModal = function (_Modal) {
                babelHelpers.inherits(StrikeModal, _Modal);

                function StrikeModal() {
                    babelHelpers.classCallCheck(this, StrikeModal);
                    return babelHelpers.possibleConstructorReturn(this, (StrikeModal.__proto__ || Object.getPrototypeOf(StrikeModal)).apply(this, arguments));
                }

                babelHelpers.createClass(StrikeModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(StrikeModal.prototype.__proto__ || Object.getPrototypeOf(StrikeModal.prototype), 'init', this).call(this);

                        this.post = this.props.id;

                        this.reason = m.prop('');
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'StrikeModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('reflar-usermanagement.forum.modal.post.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {

                        return [m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('reflar-usermanagement.forum.modal.post.strike_reason')), m('input', {
                            name: 'strike_reason',
                            placeholder: app.translator.trans('reflar-usermanagement.forum.modal.post.reason_placeholder'),
                            oninput: m.withAttr('value', this.reason)
                        })]), m('div', { className: 'Form-group' }, [m(Button, {
                            className: 'Button Button--primary',
                            type: 'submit',
                            loading: this.loading,
                            disabled: !this.reason()
                        }, app.translator.trans('reflar-usermanagement.forum.modal.post.submit_button'))])])])];
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        e.preventDefault();

                        this.loading = true;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/strike',
                            data: {
                                "post_id": this.post,
                                "reason": this.reason()
                            }
                        }).then(window.location.reload(), this.loaded.bind(this));
                    }
                }]);
                return StrikeModal;
            }(Modal);

            _export('default', StrikeModal);
        }
    };
});;
'use strict';

System.register('Reflar/UserManagement/main', ['flarum/extend', 'flarum/components/Button', 'flarum/Model', 'flarum/utils/UserControls', 'flarum/models/Discussion', 'flarum/models/User', 'Reflar/UserManagement/addStrikeControls'], function (_export, _context) {
  "use strict";

  var extend, Button, Model, UserControls, Discussion, User, addStrikeControls;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsUserControls) {
      UserControls = _flarumUtilsUserControls.default;
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion.default;
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser.default;
    }, function (_ReflarUserManagementAddStrikeControls) {
      addStrikeControls = _ReflarUserManagementAddStrikeControls.default;
    }],
    execute: function () {

      app.initializers.add('Reflar-User-Management', function (app) {

        Discussion.prototype.canStrike = Model.attribute('canStrike');
        User.prototype.canViewStrike = Model.attribute('canViewStrike');

        extend(UserControls, 'moderationControls', function (items, user) {
          if (user.canViewStrike()) {
            items.add('strikes', Button.component({
              children: app.translator.trans('reflar-usermanagement.forum.user_controls.strike_button'),
              icon: 'times',
              onclick: function onclick() {
                console.log(app.store.find('strike', '1') // app.modal.show(new ModStrikeModal({user}));
                );
              }

            }));
          }
        });

        addStrikeControls();
      });
    }
  };
});