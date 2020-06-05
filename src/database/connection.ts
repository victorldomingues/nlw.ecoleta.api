import knex from "knex";
var connection = knex({
    client: 'pg',
    connection: 'postgres://postgres:[PASSWORD]@localhost:5432/ecoleta',
});
export default connection;