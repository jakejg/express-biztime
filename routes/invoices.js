const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError')
const db = require('../db');
const { getAll, getOne, delete_ } = require('../dbQueries')

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
        let results;
        const payRes = await db.query(`SELECT paid FROM invoices WHERE id=$1`,
        [req.params.id]);

        if (payRes.rows.length === 0) {
            throw new ExpressError("Not found", 404);
        }

        if (!payRes.rows[0].paid) {
            const date = new Date().toISOString().slice(0, 10)
            results = await db.query(`UPDATE invoices SET 
            amt=$2, paid=$3, paid_date=$4
            WHERE id=$1
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [req.params.id, amt, true, date]);
            
        }
        else {
            results = await db.query(`SELECT * FROM invoices WHERE id=$1`,
            [req.params.id]);
        }
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