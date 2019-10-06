/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../../server');

const Admin = require('../../models/Admin');

describe('ADMIN', () => {
  const collection = {
    expectedProps: ['_id', 'name', 'email'],
    newDoc: {
      name: 'Jose Figueroa',
      email: 'Jose@TheHedgehog.com',
      password: 'NightRanger25',
      password2: 'NightRanger25',
    },
    excessDoc: {
      name: 'J Figs',
      email: 'JFigs@TheHedgehog.com',
      password: 'NightRanger3000',
      password2: 'NightRanger3000',
    },
    updateDoc: {
      name: 'Jose Fig',
      email: 'JFig@TheHedgehog.com',
      password: 'RavenousNightRanger25',
      password2: 'RavenousNightRanger25',
    },
  };

  const {
    expectedProps, newDoc, excessDoc, updateDoc,
  } = collection;
  let testId; let badId;

  beforeAll(() => Admin.deleteMany({}, () => {}));

  afterAll(() => Admin.deleteMany({}, () => {}));

  describe('POST /api/admin/add_admin', () => {
    it('Should reject adding an admin with missing required fields', (done) => {
      const badDoc = { ...newDoc };
      const propToDelete = Object.keys(newDoc).slice(-1)[0];
      delete badDoc[propToDelete];
      return request(app)
        .post('/api/admin/add_admin')
        .send(badDoc)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.error.text.startsWith('Bad Request')).toBe(true);
          done();
        });
    });

    it('should accept and add a valid new admin', (done) => request(app)
      .post('/api/admin/add_admin')
      .send(newDoc)
      .then((res) => {
        testId = res.body.adminId;
        badId = `${testId.slice(0, -1)}1`;
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Success!');
        return request(app).get('/api/admin/get_all_admins');
      })
      .then((res) => {
        const addedDoc = res.body.find((doc) => doc._id === testId);
        delete newDoc.password, delete newDoc.password2;
        expect(res.status).toBe(200);
        expect(addedDoc).toMatchObject(newDoc);
        expectedProps.forEach((key) => expect(Object.keys(addedDoc).includes(key)).toBe(true));
        done();
      }));

    it('Should reject adding a second admin', (done) => request(app)
      .post('/api/admin/add_admin')
      .send(excessDoc)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text).toBe('Bad Request: An admin already exists');
        done();
      }));
  });

  describe('GET /api/admin/get_all_admins', () => {
    it('should return JSON array', (done) => request(app)
      .get('/api/admin/get_all_admins')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        done();
      }));

    it('should return objects with expected props', (done) => request(app)
      .get('/api/admin/get_all_admins')
      .expect(200)
      .then((res) => {
        const testKeys = Object.keys(res.body[0]);
        expectedProps.forEach((key) => expect(testKeys.includes(key)).toBe(true));
        done();
      }));

    it('shouldn\'t return objects with excess props', (done) => request(app)
      .get('/api/admin/get_all_admins')
      .expect(200)
      .then((res) => {
        const excessProps = Object.keys(res.body[0]).filter(
          (key) => !expectedProps.includes(key),
        );
        expect(excessProps.length).toBe(0);
        done();
      }));
  });

  describe('GET /api/admin/:_id', () => {
    it('should return an admin object', (done) => request(app)
      .get(`/api/admin/${testId}`)
      .expect(200)
      .then((res) => {
        const foundDoc = res.body;
        expectedProps.forEach((key) => expect(Object.keys(foundDoc)).toContain(key));
        done();
      }));

    it('should return an admin object with requested :_id', (done) => request(app)
      .get(`/api/admin/${testId}`)
      .expect(200)
      .then((res) => {
        const foundDoc = res.body;
        expect(foundDoc).toMatchObject(newDoc);
        done();
      }));

    it('should 400 when requesting a bad :_id', (done) => request(app)
      .get(`/api/admin/${badId}`)
      .expect(400)
      .then((res) => {
        expect(res.error.text).toBe(
          `Bad Request: No admin found with _id ${badId}`,
        );
        done();
      }));
  });

  describe('PUT /api/admin/:_id', () => {
    it('allows updates to props other than _id', (done) => request(app)
      .put(`/api/admin/${testId}`)
      .send(updateDoc)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        done();
      }));

    it('rejects updates to _id prop', (done) => request(app)
      .put(`/api/admin/${testId}`)
      .send({ _id: 'LOL' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith('Update failed')).toBe(true);
        done();
      }));

    it('should 400 when updating a bad :_id', (done) => request(app)
      .put(`/api/admin/${badId}`)
      .send(updateDoc)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith('Update failed')).toBe(true);
        done();
      }));
  });

  describe('DELETE /api/admin/:_id', () => {
    it('deletes when given a valid _id', (done) => request(app)
      .delete(`/api/admin/${testId}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Success!');
        expect(res.body.deleted).toBe(testId);
        done();
      }));

    it('responds w/ error if given invalid _id', (done) => request(app)
      .delete(`/api/admin/${badId}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.error.text).toBe(`No admin found with _id: ${badId}`);
        done();
      }));
  });
});
