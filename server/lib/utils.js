const path = require('path');
const cp = require('child_process')
const fs = require('fs');
const config = require('../lib/config').config;

function _run_script_sync(script, input) {
    console.log(`Running script: ${script} ${input}`);
    return new Promise((resolve, reject) => {
        let child = cp.spawnSync(script, input);
        let data = "";
        if (child.stdout) {
            data += child.stdout;
        }
        if (child.stderr) {
            data += child.stderr;
        }
        console.log(data)
    });
}


module.exports = {
    init_db_config: (db_path = "") => {
        db_path = db_path || path.join(__dirname, "../../db.json");
        db = JSON.parse(fs.readFileSync(db_path, "utf8"));
        return db;
    },

    run_script_sync: _run_script_sync,

    run_python_script_sync: (script_path, args) => {
        return _run_script_sync("python", [script_path, args])
    }
}