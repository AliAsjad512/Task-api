const app = require('./app');
const { init } = require('./db');

const PORT = process.env.PORT || 5000;

init()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`task-api listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database', err);
        process.exit(1);
    });
