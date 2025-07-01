'use strict';

module.exports = {
    success: (context, data) => {
        context.body = data;
        const method = context.method === "PUT" ? 201 : 200;
        context.status = data ? method : 204;
    },
    badRequest: (context, errors) => {
        context.body = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.status = 400;
    },
    notFound: (context) => {
        context.body = { messsage: 'Resource was not found' };
        context.status = 404;
    },
    unAuthorized: (context, error) => {
        context.body = { messsage: 'Unauthorized, ' + error };
        context.status = 401;
    },
};
