"use strict";

// imports for request, api, ObjectId
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// other imports here -> ... <-

describe("API", () => {
  let testId;
  describe("USER", () => {
    describe("GET /api/users/get_all_users", () => {
      // properties expected on an obj in response
      const expectedProps = ["_id", "name", "email"];
      it("should return JSON array", () => {
        return request(app)
          .get("api/users/get_all_users")
          .expect(200)
          .then(res => {
            // returns an array
            testId = res.body[0];
            expect(res.body).toBeInstanceOf(Array);
          });
      });

      it("should return objs with expected props", () => {
        return request(app)
          .get("/api/users/get_all_users")
          .expect(200)
          .then(res => {
            // returns expected props
            const testKeys = Object.keys(res.body[0]);
            expectedProps.forEach(key =>
              expect(testKeys.includes(key)).toBe(true)
            );
          });
      });

      it("shouldn't return objs with excess props", () => {
        return request(app)
          .get("/api/users/get_all_users")
          .expect(200)
          .then(res => {
            // returns only expected props
            const excessProps = Object.keys(
              res.body[0].filter(key => !expectedProps.includes(key))
            );
            expect(excessProps.length).toBe(0);
          });
      });
    });

    describe("GET /api/users/:id", () => {
      // have an _id to test, a const/let testId = ObjID
      it("should return a user object", () => {
        return request(app)
          .get(`api/users/${testId}`)
          .expect(200)
          .then(res => {
            const requiredKeys = ["_id", "name", "email"];
            const { user } = res.body;
            const { _id, name, email } = user;
            // returns expected keys
            requiredKeys.forEach(key =>
              expect(Object.keys(user)).toContain(key)
            );
            // returns expected field types
            expect(ObjectId.isValid(_id)).toBe(true);
            expect(typeof name).toBe("string");
            expect(typeof email).toBe("string");
          });
      });

      it("should return a user obj w/ requested :id", () => {
        return request(app)
          .get(`/api/users/${testId}`)
          .expect(200)
          .then(res => {
            expect(res.body.user).toEqual({
              _id: ObjectId(_id),
              name: "Mo Mamba",
              email: "MoMamba@gmail.com"
            });
          });
      });

      it("should 400 when requesting a bad :id", () => {
        return Promise.all([
          request(app)
            .get(`/api/users/bad${badTestId1}`)
            .expect(400)
            .then(res => {
              expect(res.body.message).toBe(
                `error: no user found with id: ${badTestId1}`
              );
            }),
          request(app)
            .get(`/api/users/bad${badTestId2}`)
            .expect(400)
            .then(res => {
              expect(res.body.message).toBe(
                `error: no user found with id: ${badTestId2}`
              );
            })
        ]);
      });
    });
  });
});
