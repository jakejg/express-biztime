const express = require('express');
const router = new express.Router();
const db = require('../db');
const { getAll } = require('../dbQueries')



 router.get('/', async (req, res, next) => {
    try{
        const comp_codeRes = await db.query(`SELECT i.abrev, i.industry, c.code FROM industries AS i 
        left JOIN industries_companies ON i.abrev = industries_companies.abrev
        JOIN companies AS c ON industries_companies.comp_code = c.code`)
 
        const industriesArray = [];
        for (let row of comp_codeRes.rows){
            const industry = industriesArray.find(val => val.abrev === row.abrev)
            if (industry) {
                industry.code.push(row.code)
            }
            else {
                row.code = [row.code]
                industriesArray.push(row)
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