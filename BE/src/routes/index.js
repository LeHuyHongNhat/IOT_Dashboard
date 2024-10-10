const data = require('./dataSensor')
const table = require('./table')
function route(app) {
    app.use('/data', data);
    app.use('/table', table);
    app.use('/', (req, res) => {
        res.send('Hello World!');
    })
}
module.exports = route;