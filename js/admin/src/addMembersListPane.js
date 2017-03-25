import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import MemberPage from 'Reflar/UserManagement/components/MemberPage';

export default function() {
    app.routes.members = {path: '/members', component: MemberPage.component()};
  
    app.extensionSettings['reflar-user-management'] = () => m.route(app.route('members'));
  
    extend(AdminNav.prototype, 'items', items => {
        items.add('members', AdminLinkButton.component({
            href: app.route('members'),
            icon: 'users',
            children: app.translator.trans('Reflar-registration.admin.nav.title'),
            description: app.translator.trans('Reflar-registration.admin.nav.desc')
        }));
    });
}