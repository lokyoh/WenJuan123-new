var express = require('express')
var app = express()
var server = require('http').Server(app)
const io = require('nodejs-websocket')

app.use('/pages',express.static('pages'))

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/pages/" + "index.html")
})

app.get('/wenjuan/123', (req, res)=> {
    res.sendFile(__dirname + "/pages/" + "HDUwenjuan123.html")
})

app.get('/wenjuan/123-result', (req, res) => {
    res.sendFile(__dirname + "/pages/" + "HDUwenjuan123result.html")
})

// http://*.*/wenjuan?request=123
app.post('/wenjuan', (req, res) => {
    res.sendText('This is text');
})

app.all('/*', (req, res) => {
    res.sendFile(__dirname + "/pages/" + "404.html")
})

io.createServer(connection => {
    console.log('新的连接...');
    connection.on('text', function (data) {
        console.log('收到消息:' + data)
        var r = data.match(/.*?(?=:)/)
        if (r == 'request') {
            var str = data.match(/(?<=:).*/)
            if (str == 'HDUwenjuan123') {
                connection.sendText('question:;,"radio","q1","1.会了吗","2","YES","NO","A.会了","B.不会",;,"textarea","q2","1附加.说出你学会了的感想。",;,"checkbox","q3","2.你会以下那些语言","6","0","6","java","python","c","c++","c#","go","A.java","B.python","C.c","D.c++","E.c#","F.go",;')
                connection.sendText('link:;,"q2","q1","YES",;')
            }
        } else if (r == 'result') {
            connection.sendText('done:')
        }
    })
    connection.on("close", function (code, reason) {
        console.log("连接关闭...")
    })
    connection.on("error", () => {
        console.log('因错误关闭连接...')
    })
}).listen(3000)

var server = app.listen(8081, ()=> {
    var host = server.address().address
    var port = server.address().port
    console.log("服务器启动在http://%s:%s", host, port)
})