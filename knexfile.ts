import path from 'path';
module.exports = {
    client: 'pg',
    connection: 'postgres://postgres:[PASSWORD]@localhost:5432/ecoleta',
    migrations: {
        tableName: 'migrations',
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    }
};