var config = require('./config.json');
var http = require("http");
var mysql = require('mysql');
var express = require('express');

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-FRAME-OPTIONS", "*");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
var server = http.createServer(app);

var db_config = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
};

// Auto restart if SQL server idle
function handleConnect() {
    con = mysql.createConnection(db_config);
    con.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleConnect, 4000);
        } else {
            console.log("database connected");
        }
    });

    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleConnect();
        } else {
            throw err;
        }
    });
}
handleConnect();

// getitems api service to access the datas(product items) in databse.
app.get('/api/getitems', function (req, res) {
    var query = "SELECT * FROM itemlist";
    con.query(query, function (err, result, fields) {
        if (err) {
            res.send({ status: 'error', error: err });
        } else {
            // console.log('query result-',result)
            res.send({ status: 'success', result: result });
        }
    });
})

server.listen(config.port);
server.on('error', onError);
server.on('listening', onListening);





/*HTTP server "error".*/
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var port = error.port;
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/*HTTP server "listening" event.*/
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + config.host + ' ' + bind);
}