const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError')
const db = require('../db');
const { getAll, getOne, create, update, delete_ } = require('../dbQueries')

router.get('/', async (req, res, next) => {
    try{
        invoiceArray = await getAll("invoices", "id", "comp_code")
        return res.json({invoices: invoiceArray})
    }
    catch(e){
        return next(e);
    }
  });

router.get('/:id', async (req, res, next) => {
    try{
        const invoice = await getOne("invoices", req.params.id, "id")
        return res.json({invoice})
    }
    catch(e){
        return next(e);
    }
  });

  
router.post('/', async (req, res, next) => {
    try{
        const { comp_code, amt } = req.body
        const results = await db.query(`INSERT INTO invoices
        (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [comp_code, amt]);

    return res.status(201).json(results.rows[0])
    }
    catch(e){
        return next(e);
    }
  });

    
router.put('/:id', async (req, res, next) => {
    try{
        const { amt } = req.body
        const results = await db.query(`UPDATE invoices SET amt=$2
        WHERE id=$1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [req.params.id, amt]);
        
        return res.json({invoice: results.rows[0]})
    }
    catch(e){
        return next(e);
    }
  });

router.delete('/:id', async (req, res, next) => {
    try{
        await delete_("invoices", req.params.id, "id")
        
        return res.json({message: `Deleted ${req.params.id}`})
    }
    catch(e){
        return next(e);
    }
});



  module.exports = router