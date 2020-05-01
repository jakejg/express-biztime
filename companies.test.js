process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require('./app');
const db = require('./db')
let testCompany;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies 
    (code, name, description)
    VALUES ('test_code', 'test', 'nothing') `)
    testCompany = result.rows[0]
})

afterEach(() => {
    await db.query(`DELETE FROM companies`)
})

afterALL(async () => {
    await db.end()
})

describe("GET /companies", () => {
    test("Get a list of company codes and names", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([testCompany])
    })
})

// describe("POST /companies", () => {
//     test("Create a new company", async () => {
//         const newItem = {name: "kale", price: 1.50}
//         const res = await request(app)
//             .post('/items')
//             .send([newItem]);
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({"added": [newItem]});
//     })
// })

// describe("GET /items/:name", () => {
//     test("Retrieve a single item", async () => {
//         const res = await request(app).get('/items/bread');
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toEqual(item)
//     })
// })

// describe("PATCH /items", () => {
//     test("Update an item", async () => {
//         const updated = {name: "wheat bread", price: 2.50}
//         const res = await request(app).patch('/items/bread').send(updated);
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toEqual({updated})
//     })
// })

// describe("DELETE /items", () => {
//     test("Delete an item", async () => {
//         const res = await request(app).delete('/items/bread');
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toEqual({message:"Deleted"})
//     })
// })