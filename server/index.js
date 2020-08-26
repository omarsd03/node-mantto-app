const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(cors({origin: 'http://localhost:4200'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/mantto', require('./routes/users.routes'));
app.use('/mantto', require('./routes/actividades.routes'));
app.use('/mantto', require('./routes/push.routes'));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});