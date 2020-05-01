const ExpressError = require('./expressError')
const db = require('./db');

async function getAll(table, column1, column2){
    const results = await db.query(`SELECT * FROM ${table}`);
    return results.rows.map(company => {
        return {
            [column1]: company[column1],
            [column2]: company[column2]
        }  
    });
}

async function getOne(table, code, column){
    const results = await db.query(`SELECT * FROM ${table} WHERE ${column}=$1`, [code]);
    if (results.rows.length === 0) {
        throw new ExpressError("Not found", 404)
    }
    return results.rows[0]
}

async function create(table, code, name, description){
    const results = await db.query(`INSERT INTO ${table}
         (code, name, description)
         VALUES ($1, $2, $3)
        RETURNING code, name, description`,
        [code, name, description]);
    return results.rows[0]
}

async function update(table, code, name, description){
    const results = await db.query(`UPDATE ${table} SET
    name=$2, description=$3 WHERE code=$1
    RETURNING code, name, description`,
    [code, name, description]);

    if (results.rows.length === 0) {
        throw new ExpressError("Not found", 404);
    }
    return results.rows[0]
}

async function delete_(table, code, column){
    const results = await db.query(`DELETE FROM ${table} WHERE
        ${column}=$1 RETURNING *`,
        [code]);

    if (results.rows.length === 0) {
        throw new ExpressError("Not found", 404);
    }
}



module.exports = {
    getAll, getOne, create, update, delete_
}