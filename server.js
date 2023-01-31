const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var db = require('mongodb/lib/db')
app.use(bodyParser.urlencoded({ extended: true }))
const MongoClient = require("mongodb").MongoClient
app.set('view engine', 'ejs');



MongoClient.connect('mongodb+srv://tmdcjf152:tmdcjf!523@cluster0.28uje.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
  if (에러) return console.log(에러)
  db = client.db('todoapp');

  app.listen(8080, function () {
    console.log('listening on 8080')
  });
});


app.get('/', function (요청, 응답) {
  응답.sendFile(__dirname + '/index.html')
})

app.get('/write', function (요청, 응답) {
  응답.sendFile(__dirname + '/write.html')
});

// 어떤사람이 /add 라는 경로로 post 요청을 하면 
// 데이터 2개 (날짜 시간)을 보내주는데 이 때 post라는 이름을 가진 콜렉션에 데이터 두개를 저장하기
// {제목 : '어쩌구', 날짜 : '어쩌구'}
app.post('/add', function (요청, 응답) {
  응답.send('전송완료')

  db.collection('counter').findOne({ name: '게시물갯수' }, (에러, 결과) => {
    console.log(결과.totalPost);
    let 총게시물갯수 = 결과.totalPost

    db.collection('post').insertOne({ _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date }, function () {
      console.log('저장완료')

      // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정);
      db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, (에러, 결과) => {
        if (에러) { return console.log(에러); }
      })
    });

  });
});

// /list로 GET요청으로 접속하면 실제 DB에 저장된 데이터들로 꾸며진 HTML을 보여줌
app.get('/list', (res, req) => {

  // 디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
  db.collection('post').find().toArray((에러, 결과) => {
    console.log(결과);
    req.render('list.ejs', { posts: 결과 });
  });




})

// 123123