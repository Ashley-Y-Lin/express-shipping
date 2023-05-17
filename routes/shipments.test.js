"use strict";

// lean towards using fn to mock specific functions
// jest.mock("../shipItApi");
// when using jest.fn, you are forced to import the entire object. DONT
  // destructure it
  // when using jest.fn, you MUST do this before ANY import statement in the file

let shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

// when to mock?
  // when you can't control behavior of function (e.g. dice roll)
  // making requests that are slow or resource intensive (e.g. rate limited API requests)

const request = require("supertest");
const app = require("../app");

describe("POST /", function () {

  // this is a unit test! you're just testing the invocation of the shipProduct
  // function when you go to the corresponding endpoint

  test("valid", async function () {
    shipItApi.shipProduct
      .mockReturnValue(9030)

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 9030 });
  });

  // you wouldn't mock the below because the behavior is PREDICTABLE!!

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("returns error json if invalid inputs", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({ "productId":1, "name":1, "addr":1, "zip":1 });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual(
      {
        "error": {
          "message": [
            "instance.productId must be greater than or equal to 1000",
            "instance.name is not of a type(s) string",
            "instance.addr is not of a type(s) string",
            "instance.zip is not of a type(s) string"
          ],
          "status": 400
        }
      }
    )
  });

});
