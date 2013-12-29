
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , mongodb = require('mongodb')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Model

var ObjectId = mongodb.BSONPure.ObjectID;
var Schema = mongoose.Schema;

var Memo = new Schema({
  content : String,
  date : Date
});

Memo.pre('save', function(next) {
  this.date = new Date();
  next();
});

mongoose.model('memo', Memo);

var db = mongoose.createConnection('mongodb://localhost/memo_test');
var Memo = db.model('memo');

app.configure(function() {
  app.set('db', db);
});


// Routes
app.get('/', function(req, res) {
  console.log("default");
  res.redirect('/memo');
});


app.get('/memo', function(req, res) {
  console.log("index");
  //Memo.find({}, function(err, data) {
  Memo.find({}, null, {sort:{date:-1}}, function(err, data) {
    if(err) return next(err);
    res.render('index', { memos: data });
  });
});

app.get('/memo/list', function(req, res, next) {
  console.log("get memos");
  //Memo.find({}, function(err, data) {
  Memo.find({}, null, {sort:{date:-1}}, function(err, data) {
    if(err) return next(err);
    res.json(data);
  });
});

app.get('/memo/:id', function(req, res, next) {
  console.log("get memo : " + req.params.id);
  //Memo.findById({ _id : ObjectId(req.params.id)}, function(err, data) {
  Memo.findById(req.params.id, function(err, data) {
    if(err) return next(err);
    res.json(data);
  });
});

app.post('/memo', function(req, res, next) {
  console.log("post memo : " + req.body.content);
  var memo = new Memo();
  memo.content = req.body.content;
  memo.save(function(err) {
    if(err) return next(err);
    res.json({ message : '등록됐습니다!'});
  });
});

app.put('/memo/:id', function(req, res, next) {
  console.log("put memo : " + req.params.id);
  Memo.update(
    { _id : ObjectId(req.params.id) }
    , { content : req.body.content, date : new Date() }
    , { upsert : false, multi : false }
    , function(err) {
      if(err) return next(err);
      res.json({ message : '수정됐습니다!'});
  });
});

app.del('/memo/:id', function(req, res, next) {
  console.log("delete memo : " + req.params.id);
  Memo.findById({ _id : ObjectId(req.params.id)}, function(err, data) {
    if(err) return next(err);
    data.remove(function(err) {
      console.log("memo remove!");
      res.json({ message : '삭제됐습니다!'});
    });
  });
});


app.get('/slot', function(req, res, next) {
  console.log("slot memos");
  Memo.find({}, null, {sort:{content:1}}, function(err, data) {
    if(err) return next(err);
    res.render('slot', { memos: data });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
