const express = require('express')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('webapp'));
app.use('/node_modules', express.static('node_modules'))
app.get('/', function (req, res) {
    res.render('index');
})

app.listen(3000, function () {
    console.log('UI5 app listening on port 3000!')
})