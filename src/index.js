const express = require('express');
const app = express();
const path = require('path');

//configuraciones
app.set('port',8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

//middlewares

//routers
app.use(require('./routers/index'));

//archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//escuhando el servidor
app.listen(app.get('port'), () => {
    console.log('Server',app.get('port'));
});