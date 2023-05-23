// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Local Pakaged and Apps
const db = require('./lib/utils').init_db_config();
const data = require('./apps/data');

const app = express();

let intialPath = path.join(__dirname, "../docs");
console.log(intialPath);

app.use(bodyParser.json());
app.use(express.static(intialPath));
app.listen(3000, (req, res) => { console.log('listening on port 3000......') })

// Router
app.get('/', (req, res) => { res.sendFile(path.join(intialPath, "index.html")); })
app.post('/eval_data', (req, res) => {
    console.log(req.body);
    data.run_eval_script().then((data) => {
        res.send(data);
    })
})