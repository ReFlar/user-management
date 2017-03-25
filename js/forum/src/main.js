import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import Discussion from 'flarum/models/Discussion';
import addStrikeControls from 'Reflar/UserManagement/addStrikeControls';


app.initializers.add('Reflar-User-Management', function(app) {

    Discussion.prototype.canStrike = Model.attribute('canStrike');

    addStrikeControls();
});