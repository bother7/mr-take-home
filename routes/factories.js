const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    companyStore.list((err, companies) => {
        if (err) throw err;
        res.json(companies.filter((company) => {
          return company.company_type === "factory"}))
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    let factoryArray = companyStore.list((err, factories) => {
      if (err) throw err
      let result = factories.find((factory) => {
        return (factory.name === searchQuery && factory.company_type === "factory")})
      if (result) {
        res.json(result)
      } else {
        res.sendStatus(404)
      }
    })
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const newFactory = { name: req.body.name, 
    email: req.body.email,
    phone_number: req.body.phone_number,
    city: req.body.city,
    state: req.body.state,
    company_type: req.body.company_type};
    companyStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

router.delete('/:id', function (req, res) {
  companyStore.remove(req.params.id, (err) => {
      if (err) throw err;
      res.send("Delete Successful")
  });
});



module.exports = router;
