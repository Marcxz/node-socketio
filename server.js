var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const dbUrl = "mongodb+srv://mongos:XJP347nKm96OCoTo@cluster0.y3cctkz.mongodb.net/?retryWrites=true&w=majority";

let Message = mongoose.model('Message', {
    name: String,
    message: String,
})

messages = []
app.get('/messages', (req, res) => {
    
    Message.find({}, (err, messages) => {
        res.json(messages);
    })
})

app.post('/messages', async (req, res) => {
    try {
        let message = new Message(req.body);
        let err = await message.save();
        
        if(err) res.sendStatus(500);
        
        messages.push(req.body);
        io.emit('message', req.body);
    } catch (err) {
        return console.error(err);
    } finally {
        // logger 
        console.log('Add logger here');
    }
})  

io.on('connection', (socket) => {
    console.log('an user connected');
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})

http.listen(3000, () => {
    console.log('Server is running on port 3000');
});