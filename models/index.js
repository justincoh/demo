var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/npmTracker');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

var Schema = mongoose.Schema;

var firstSchema = new Schema({
    //figure out your schema(s)
});

var first = mongoose.model('First', firstSchema);

module.exports = {
    "thinkAboutThese": first
};