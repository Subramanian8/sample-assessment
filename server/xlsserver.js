var config = require('./config.json');
var http = require("http");
var XLSX = require('xlsx')
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

// getitems api service to access the datas(product items) in xls file.
app.get('/api/getitems', function (req, res) {
    var workbook = XLSX.readFile('itemlist.xls');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    // console.log('xlData-',xlData);
    res.send({ status: 'success', result: xlData });
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