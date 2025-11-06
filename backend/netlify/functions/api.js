const app = require('../server');

exports.handler = async (event, context) => {
    return await app(event, context);
};