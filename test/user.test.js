const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../src/model/user.model');

const connect = () => {
    mongoose.connect(process.env.MONGO_DB_URL_TEST, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
}

describe('Registering into the pawsapp', () => {
    beforeAll((done) => {
        console.log(process.env)
        connect();
        done()
    })

    beforeEach(async (done) => {
        await User.deleteOne({})
        const data = {
            username: "test",
            email: "test@test.com",
            phone: "08033619901"
        }
        await User.create(data);
        done()
    })

    afterAll(async (done) => {
        await User.remove({});
        mongoose.disconnect();
        done()
    })

    it('Accepting usersname, email and password as registration details', (done) => {
        request(app)
            .post('/users/')
            .send({ user: "test", emails: "test@test.com", passwords: 'test' })
            .then((res) => {
                console.log(res.body)
                expect(res.status).toBe(400);
                expect(res.body.message).toBe('Invalid Credentials');
                done();
            })
            .catch(err => done(err))
    })
})