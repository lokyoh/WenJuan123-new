
var express = require('express')
var app = express();
var server = require('http').Server(app)
const io = require('nodejs-websocket')

app.use('/pages',express.static('pages'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/pages/" + "index.html");
})

app.get('/HDUwenjuan123', function (req, res) {
    res.sendFile(__dirname + "/pages/" + "HDUwenjuan123.html");

})

io.createServer(connection => {
    console.log('new connection...')
    connection.on('text', function (data) {
        console.log('message:' + data);
        var r = data.match(/.*?(?=:)/);
        if (r == 'request') {
            var str = data.match(/(?<=:).*/);
            if (str == 'HDUwenjuan123') {
                connection.sendText('question:;,"radio","q1","1.会了吗","2","YES","NO","A.会了","B.不会",;,"textarea","q2","1附加.说出你学会了的感想。",;,"checkbox","q3","2.你会以下那些语言","6","0","6","java","python","c","c++","c#","go","A.java","B.python","C.c","D.c++","E.c#","F.go",;');
            }
        } else if (r == 'result') {
            connection.sendText('done:');
        }
    })
    connection.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    connection.on("error", () => {
        console.log('close with error...')
    })
}).listen(3000)

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("web open on http://%s:%s", host, port)
})