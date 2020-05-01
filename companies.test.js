process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require('./app');
const db = require('./db')
let testCompany;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies 
    (code, name, description)
    VALUES ('test_code', 'test', 'nothing')
    RETURNING code, name, description`)
    testCompany = result.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end()
})

describe("GET /companies", () => {
    test("Get a list of company codes and names", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({companies: [{code: testCompany.code, name: testCompany.name}]})
    })
})


describe("GET /companies/:code", () => {
    test("Retrieve a single company", async () => {
        const res = await request(app).get(`/companies/test_code`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: testCompany});
    })
})

describe("POST /companies", () => {
    test("Create a new company", async () => {
        const newCompany = {code: "test_code2", name: "test2", description: "text_here"}
        const res = await request(app)
            .post(`/companies`)
            .send(newCompany);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company: newCompany});
    })
})

describe("PATCH /companies", () => {
    test("Update a companies", async () => {
        const company = {name: "new-name", description: "different"}
        const res = await request(app)
            .put(`/companies/test_code`)
            .send(company);
        company.code = testCompany.code;
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company})
    })
})

describe("DELETE /company", () => {
    test("Delete a company", async () => {
        const res = await request(app).delete(`/companies/test_code`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: `Deleted ${testCompany.code}`})
    })
})
