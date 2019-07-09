"use strict";

const request = require("supertest");
const app = require("../../server");

const User = require("../../models/User");
const Product = require("../../models/Product");
const mongoose = require("mongoose");


describe("REVIEW", () => {
  const usrId = new mongoose.mongo.ObjectId().toHexString();
  const prodId = new mongoose.mongo.ObjectId().toHexString();
  const collection = {
    expectedProps: [
      "_id",
      "product",
      "author",
      "authorId",
      "rating",
      "description",
      "date",
      "approved"
    ],
    userDoc: {
      _id: usrId,
      name: "Bob Ross",
      email: "bob@bobross.com",
      password: "Bobby5678",
      password2: "Bobby5678"
    },
    productDoc: {
      _id: prodId,
      name: "Airpods",
      description: "Now with wireless charging!",
      price: "$159"
    },
    newDoc: {
      product: "Airpods",
      author: "Bob Ross",
      authorId: usrId,
      rating: "4",
      description: "W2 chip rocks"
    },
    updateDoc: {
      rating: "5",
      description: "I love the new case!",
      approved: "true"
    }
  };
  
  const { expectedProps, newDoc, userDoc, updateDoc, productDoc } = collection;

  let testId, badId;
  
  beforeAll(() => {
    User.deleteMany({}, () => {});
    Product.deleteMany({}, () => {});
    const user = new User(userDoc);
    const product = new Product(productDoc);
    user.save();
    product.save();
  });
  
  afterAll(() => {
    User.deleteMany({}, () => {});
    Product.deleteMany({}, () => {});
  });

  describe("POST /api/reviews/add_review", () => {
    it("should accept and add a valid new review", done => {
      return request(app).post("/api/reviews/add_review").send(newDoc).then(res => {
        testId = res.body.reviewId;
        badId = `${testId.slice(0, -1)}1`;
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Success!");
        return request(app).get("/api/reviews/get_all_reviews");
      })
      .then(res => {
        const addedDoc = res.body.find(doc => doc._id === testId);
        expect(res.status).toBe(200);
        expect(addedDoc).toMatchObject(newDoc);
        expectedProps.forEach(key => expect(Object.keys(addedDoc).includes(key)).toBe(true));
        done();
      });
    });

    it("Should reject adding a review with missing required fields", done => {
      const badDoc = { ...newDoc };
      const propToDelete = Object.keys(newDoc).slice(-1)[0];
      delete badDoc[propToDelete];
      return request(app).post("/api/reviews/add_review").send(badDoc).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Bad Request")).toBe(true);
        done();
      });
    });
  });

  describe("GET /api/reviews/get_all_reviews", () => {
    it("should return JSON array", done => {
      return request(app).get("/api/reviews/get_all_reviews").expect(200).then(res => {
        const foundDocs = res.body;
        expect(foundDocs).toBeInstanceOf(Array)
        done();
      });
    });

    it("should return objects with expected props", done => {
      return request(app).get("/api/reviews/get_all_reviews").expect(200).then(res => {
        const testKeys = Object.keys(res.body[0]);
        expectedProps.forEach(key => expect(testKeys.includes(key)).toBe(true));
        done();
      });
    });

    it("shouldn't return objects with excess props", done => {
      return request(app).get("/api/reviews/get_all_reviews").expect(200).then(res => {
        const excessProps = Object.keys(res.body[0]).filter(key => !expectedProps.includes(key));
        expect(excessProps.length).toBe(0);
        done();
      });
    });
  });

  describe("GET /api/reviews/:_id", () => {
    it("should return a review object", done => {
      return request(app).get(`/api/reviews/${testId}`).expect(200).then(res => {
        const foundDoc = res.body;
        expectedProps.forEach(key => expect(Object.keys(foundDoc)).toContain(key));
        done();
      });
    });

    it("should return a review object with requested :_id", done => {
      return request(app).get(`/api/reviews/${testId}`).expect(200).then(res => {
        const foundDoc = res.body;
        expect(foundDoc).toMatchObject(newDoc);
        done();
      });
    });

    it("should 400 when requesting a bad :_id", done => {
      return request(app).get(`/api/reviews/${badId}`).expect(400).then(res => {
        expect(res.error.text).toBe(`Bad Request: No review found with _id ${badId}`)
        done();
      });
    });
  });

  describe("PUT /api/reviews/:_id", () => {
    it("allows updates to props other than _id", done => {
      return request(app).put(`/api/reviews/${testId}`).send(updateDoc).then(res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success!");
        done();
      });
    });

    it("rejects updates to _id prop", done => {
      return request(app).put(`/api/reviews/${testId}`).send({ _id: "LOL" }).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Update failed")).toBe(true);
        done();
      });
    });

    it("should 400 when updating a bad :_id", done => {
      return request(app).put(`/api/reviews/${badId}`).send(updateDoc).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Update failed")).toBe(true);
        done();
      });
    });
  });

  describe("DELETE /api/reviews/:_id", () => {
    it("deletes when given a valid _id", done => {
      return request(app).delete(`/api/reviews/${testId}`).then(res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success!");
        expect(res.body.deleted).toBe(testId);
        done();
      });
    });

    it("responds w/ error if given invalid _id", done => {
      return request(app).delete(`/api/reviews/${badId}`).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text).toBe(`No review found with _id: ${badId}`);
        done();
      });
    });
  });
});
