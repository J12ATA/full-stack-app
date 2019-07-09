"use strict";

const request = require("supertest");
const app = require("../../server");

const Product = require("../../models/Product");

describe("PRODUCT", () => {
  const collection = {
    expectedProps: ["_id", "name", "description", "price", "rating", "reviews"],
    newDoc: {
      name: "iPhone X",
      description: "Fast, OLED Display, FaceID",
      price: "$999"
    },
    updateDoc: {
      name: "Airpods",
      description: "W2 Chip, wireless charging case!",
      price: "$199"
    }
  };
  const { expectedProps, newDoc, updateDoc } = collection;
  let testId, badId;

  beforeAll(() =>
    Product.deleteMany({}, () => {})
  );

  afterAll(() =>
    Product.deleteMany({}, () => {})
  );

  describe("POST /api/products/add_product", () => {
    it("should accept and add a valid new product", done => {
      return request(app)
        .post("/api/products/add_product")
        .send(newDoc)
        .then(res => {
          testId = res.body.productId;
          badId = `${testId.slice(0, -1)}1`;
          expect(res.status).toBe(201);
          expect(res.body.message).toBe("Success!");
          return request(app).get("/api/products/get_all_products");
        })
        .then(res => {
          const addedDoc = res.body.find(doc => doc._id === testId);
          expect(res.status).toBe(200);
          expect(addedDoc).toMatchObject(newDoc);
          expectedProps.forEach(key => expect(Object.keys(addedDoc).includes(key)).toBe(true));
          done();
        });
    });

    it("Should reject adding a product with missing required fields", done => {
      const badDoc = { ...newDoc };
      const propToDelete = Object.keys(newDoc).slice(-1)[0];
      delete badDoc[propToDelete];
      return request(app).post("/api/products/add_product").send(badDoc).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Bad Request")).toBe(true);
        done();
      });
    });
  });

  describe("GET /api/products/get_all_products", () => {
    it("should return JSON array", done => {
      return request(app).get("/api/products/get_all_products").expect(200).then(res => {
        expect(res.body).toBeInstanceOf(Array);
        done();
      });
    });

    it("should return objects with expected props", done => {
      return request(app).get("/api/products/get_all_products").expect(200).then(res => {
          const testKeys = Object.keys(res.body[0]);
          expectedProps.forEach(key => expect(testKeys.includes(key)).toBe(true));
          done();
        });
    });

    it("shouldn't return objects with excess props", done => {
      return request(app).get("/api/products/get_all_products").expect(200).then(res => {
        const excessProps = Object.keys(res.body[0]).filter(key => !expectedProps.includes(key));
        expect(excessProps.length).toBe(0);
        done();
      });
    });
  });

  describe("GET /api/products/:_id", () => {
    it("should return a product object", done => {
      return request(app).get(`/api/products/${testId}`).expect(200).then(res => {
        const foundDoc = res.body;
        expectedProps.forEach(key => expect(Object.keys(foundDoc)).toContain(key));
        done();
      });
    });

    it("should return a product object with requested :_id", done => {
      return request(app).get(`/api/products/${testId}`).expect(200).then(res => {
        const foundDoc = res.body;
        expect(foundDoc).toMatchObject(newDoc);
        done();
      });
    });

    it("should 400 when requesting a bad :_id", done => {
      return request(app).get(`/api/products/${badId}`).expect(400).then(res => {
        expect(res.error.text).toBe(`Bad Request: No product found with _id ${badId}`);
        done();
      });
    });
  });

  describe("PUT /api/products/:_id", () => {
    it("allows updates to props other than _id", done => {
      return request(app).put(`/api/products/${testId}`).send(updateDoc).then(res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success!");
        done();
      });
    });

    it("rejects updates to _id prop", done => {
      return request(app).put(`/api/products/${testId}`).send({ _id: "LOL" }).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Update failed")).toBe(true);
        done();
      });
    });

    it("should 400 when updating a bad :_id", done => {
      return request(app).put(`/api/products/${badId}`).send(updateDoc).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text.startsWith("Update failed")).toBe(true);
        done();
      });
    });
  });

  describe("DELETE /api/products/:_id", () => {
    it("deletes when given a valid _id", done => {
      return request(app).delete(`/api/products/${testId}`).then(res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success!");
        expect(res.body.deleted).toBe(testId);
        done();
      });
    });

    it("responds w/ error if given invalid _id", done => {
      return request(app).delete(`/api/products/${badId}`).then(res => {
        expect(res.status).toBe(400);
        expect(res.error.text).toBe(`No product found with _id: ${badId}`);
        done();
      });
    });
  });
});
