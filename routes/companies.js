const express = require('express');
const router = new express.Router();
const db = require('../db');
const { getAll, getOne, create, update, delete_ } = require('../dbQueries')

router.get('/', async (req, res, next) => {
    try{
        companiesArray = await getAll("companies", "code", "name")
        return res.json({companies: companiesArray})
    }
    catch(e){
        return next(e);
    }
  });

router.get('/:code', async (req, res, next) => {
    try{
        const company = await getOne("companies", req.params.code, "code")
        const industryRes = await db.query(`SELECT c.code, i.industry FROM companies AS c 
        JOIN industries_companies ON c.code = industries_companies.comp_code 
        JOIN industries AS i ON industries_companies.abrev = i.abrev
        WHERE code=$1`, [req.params.code])

        const industries = industryRes.rows.map(row => row.industry);
        company.industries = industries;

        return res.json({company})
    }
    catch(e){
        return next(e);
    }
  });

  
router.post('/', async (req, res, next) => {
    try{
        const { code, name, description } = req.body
        const company = await create("companies", code, name, description)
        
        return res.status(201).json({company})
    }
    catch(e){
        return next(e);
    }
  });

    
router.put('/:code', async (req, res, next) => {
    try{
        const {name, description } = req.body
        const company = await update("companies", req.params.code, name, description)
        
        return res.json({company})
    }
    catch(e){
        return next(e);
    }
  });

router.delete('/:code', async (req, res, next) => {
    try{
        await delete_("companies", req.params.code, "code")
        
        return res.json({message: `Deleted ${req.params.code}`})
    }
    catch(e){
        return next(e);
    }
});



  module.exports = router