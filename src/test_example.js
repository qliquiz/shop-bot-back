// 1
module.exports.multiplyAsync = (a, b, callback) => {
    setTimeout(() => {
        callback(a * b);
    }, 1000)
}

// 2
module.exports.multiply = (x,y) => {
    return x * y;
}

// 3
const express = require('express');
const app = express();

app.get('/', function (request, response){
    response.send('Hello Test');
});

app.get('/error', function (request, response){
    response.status(404).send('NotFound');
});

app.get('/user', function (request, response){
    response.send({name:'Tom', age: 22});
});

module.exports.app = app;