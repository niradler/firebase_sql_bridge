const functions = require('firebase-functions');
const Knex = require('knex');
/*
{
	"con":{
		    "host" : "",
              "user" : "root",
              "password" : "",
              "database" : ""
	},
	"query":"show tables;"
}
*/
exports.bridge = functions.https.onRequest((request, response) => {
    function initDb(con) {
        //console.log('initDb',con)
        return new Knex({
            client: 'mysql',
            connection: {
                host: con.host,
                user: con.user,
                password: con.password,
                database: con.database,
            }
        });
    }
const resFunc = (r) => {
    console.log('db res:',r)
    knex.destroy(); 
    response.json({
        result: r
    });
}
const errFunc = (r) => {
    console.log('db err:',r)
    knex.destroy(); 
    response.json({
        err: r
    });
}
    function exFunc(func) {
        console.log('exFunc',func)
        switch (func.name) {
            case 'getTables':
            console.log('getTables')
            knex.raw('show tables;').then(resFunc).catch(errFunc)
                break;
        
            default:
                break;
        }
    }

    function getAction() {
         console.log('getAction',request.body.action)
        switch (request.body.action) {
            case 'filter':

                break;
            case 'query':
                knex.raw(request.body.query).then(resFunc).catch(errFunc)
                break;
            case 'func':
            exFunc(request.body.func);
                break;
            default:
            console.log('action default!');
                knex.raw(request.body.query).then(resFunc).catch(errFunc)
                break;
        }
    }
    try {
        console.log('db func http:', request.body);
        console.log('.........................');
        var knex = initDb(request.body.con);
        getAction(request);
    } catch (e) {
        response.json({
            err: e
        });
    }

});
exports.test = functions.https.onRequest((request, response) => {
    response.json({
        test: 'complete!'
    });

});