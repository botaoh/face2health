const { default: knex } = require('knex');
const { run_python_script_sync } = require('../lib/utils');
const path = require('path');

const db_config = require('../lib/utils').init_db_config();
const db = knex(db_config);

module.exports = {

    run_eval_script: () => {
        // return run_python_script_sync(path.join(__dirname, "../../app/test.py"))
        return run_python_script_sync("./app/eval.py")
    }
};