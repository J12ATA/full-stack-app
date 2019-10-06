/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../../server');

const User = require('../../models/User');

describe('USER', () => {
  const collection = {
    expectedProps: ['_id', 'name', 'email', 'reviews'],
    newDoc: {
      name: 'Mo Mamba',
      email: 'momamba@gmail.com',
      password: 'Snek5678',
      password2: 'Snek5678',
    },
    updateDoc: {
      name: 'Mr. Meowingtons',
      email: 'mrmeow@mgmail.com',
      password: 'Snek56789',
      password2: 'Snek56789',
    },
  };

  const { expectedProps, newDoc, updateDoc } = collection;

  let testId; let badId;

  beforeAll(() => User.deleteMany({}, () => {}));

  afterAll(() => User.deleteMany({}, () => {}));

  describe('POST /api/users/add_user', () => {
    it('should accept and add a valid new user', (done) => request(app)
      .post('/api/users/add_user')
      .send(newDoc)
      .then((res) => {
        testId = res.body.userId;
        badId = `${testId.slice(0, -1)}1`;
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Success!');
        return request(app).get('/api/users/get_all_users');
      })
      .then((res) => {
        const addedDoc = res.body.find((doc) => doc._id === testId);
        delete newDoc.password, delete newDoc.password2;
        expect(res.status).toBe(200);
        expect(addedDoc).toMatchObject(newDoc);
        expectedProps.forEach((key) => expect(Object.keys(addedDoc).includes(key)).toBe(true));
        done();
      }));

    it('Should reject adding a user with missing required fields', (done) => {
      const badDoc = { ...newDoc };
      const propToDelete = Object.keys(newDoc).slice(-1)[0];
      delete badDoc[propToDelete];
      return request(app)
        .post('/api/users/add_user')
        .send(badDoc)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.error.text.startsWith('Bad Request')).toBe(true);
          done();
        });
    });
  });

  describe('GET /api/users/get_all_users', () => {
    it('should return JSON array', (done) => request(app)
      .get('/api/users/get_all_users')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        done();
      }));

    it('should return objects with expected props', (done) => request(app)
      .get('/api/users/get_all_users')
      .expect(200)
      .then((res) => {
        const testKeys = Object.keys(res.body[0]);
        expectedProps.forEach((key) => expect(testKeys.includes(key)).toBe(true));
        done();
      }));

    it('shouldn\'t return objects with excess props', (done) => request(app)
      .get('/api/users/get_all_users')
      .expect(200)
      .then((res) => {
        const excessProps = Object.keys(res.body[0]).filter(
          (key) => !expectedProps.includes(key),
        );
        expect(excessProps.length).toBe(0);
        done();
      }));
  });

  describe('GET /api/users/:_id', () => {
    it('should return a user object', (done) => request(app)
      .get(`/api/users/${testId}`)
      .expect(200)
      .then((res) => {
        const foundDoc = res.body;
        expectedProps.forEach((key) => expect(Object.keys(foundDoc)).toContain(key));
        done();
      }));

    it('should return a user object with requested :_id', (done) => request(app)
      .get(`/api/users/${testId}`)
      .expect(200)
      .then((res) => {
        const foundDoc = res.body;
        expect(foundDoc).toMatchObject(newDoc);
        done();
      }));

    it('should 400 when requesting a bad :_id', (done) => request(app)
      .get(`/api/users/${badId}`)
      .expect(400)
      .then((res) => {
        expect(res.error.text).toBe(
          `Bad Request: No user found with _id ${badId}`,
        );
        done();
      }));
  });

  describe('PUT /api/users/:_id', () => {
    it('allows updates to props other than _id', (done) => request(app)
      .put(`/api/users/${testId}`)
      .send(updateDoc)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        done();
      }));

    it('rejects updates to _id prop', (done) => request(app)
      .put(`/api/users/${testId}`)
      .send({ _id: 'LOL' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith('Update failed')).toBe(true);
        done();
      }));

    it('should 400 when updating a bad :_id', (done) => request(app)
      .put(`/api/users/${badId}`)
      .send(updateDoc)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith('Update failed')).toBe(true);
        done();
      }));
  });

  describe('DELETE /api/users/:_id', () => {
    it('deletes when given a valid _id', (done) => request(app)
      .delete(`/api/users/${testId}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        expect(res.body.deleted).toBe(testId);
        done();
      }));

    it('responds w/ error if given invalid _id', (done) => request(app)
      .delete(`/api/users/${badId}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text).toBe(`No user found with _id: ${badId}`);
        done();
      }));
  });
});
