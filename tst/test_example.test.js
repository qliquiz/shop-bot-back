const source = require('../src/test_example');
const {app} = require('../src/test_example');
const assert = require('assert');
const supertest = require('supertest');


describe('Example Tests', () => {
    // Вручную
    it('Must async multiply two numbers', (done) => {
        const expectedResult = 12;
        source.multiplyAsync(4, 3, (result) => {
            if (result!==expectedResult) {
                throw new Error(`Expected ${expectedResult}, but got ${result}`);
            }
            done();
        });
    });


    // Assert
    it('Must multiply two numbers', () => {
        const expected = 15;
        const result = source.multiply(3, 5);
        assert.strictEqual(result, expected);
    });


    // SuperTest + Assert
    it('Must return Hello Test', (done) => {
        supertest(app)
            .get('/')
            .expect('Hello Test')
            .end(done);
    });

    it('Must return NotFound with status 404', (done) => {
        supertest(app)
            .get('/error')
            .expect(404)
            .expect('NotFound')
            .end(done);
    });

    it('Must return user with name Tom and age 22', (done) => {
        supertest(app)
            .get('/user')
            .expect((response) => {
                assert.deepStrictEqual(response.body, {name: 'Tom', age: 22});
            })
            .end(done);
    });
});