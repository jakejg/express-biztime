const express = require('express');
const router = new express.Router();
const db = require('../db');
const { getAll } = require('../dbQueries')



 router.get('/', async (req, res, next) => {
    try{
        const industriesArray = await getAll("industries", "abrev", "industry")
        const comp_codeRes = await db.query(`SELECT i.abrev, i.industry, c.code FROM industries AS i 
        left JOIN industries_companies ON i.abrev = industries_companies.abrev
        left JOIN companies AS c ON industries_companies.comp_code = c.code`)
        for (let industry of industriesArray) {
            industry.comp_code = [];
            for (let row of comp_codeRes.rows){
                if (industry.abrev == row.abrev){
                    industry.comp_code.push(row.code);
                }
            }
        }
        return res.json({industries: industriesArray});
    }
    catch(e){
        return next(e);
    }
  });
 
 router.post('/', async (req, res, next) => {
    try{
        const { abrev, industry } = req.body;
        const results = await db.query(`INSERT INTO industries
        (abrev, industry)
        VALUES ($1, $2)
        RETURNING abrev, industry`,
        [abrev, industry]);

    return res.status(201).json(results.rows[0])
    }
    catch(e){
        return next(e);
    }
  });

  router.post('/associate', async (req, res, next) =>{
      try{
          const { comp_code, abrev } = req.body
          const results = await db.query(`INSERT INTO industries_companies
          (comp_code, abrev)
          VALUES ($1, $2)
          RETURNING comp_code, abrev`,
          [comp_code, abrev]);
  
      return res.json({new_association: results.rows[0]})
      }
      catch(e){
          return next(e);
      }
    });

  module.exports = router