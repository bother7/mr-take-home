const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    companyStore.list((err, companies) => {
        if (err) throw err;
        res.json(companies.filter((company) => {
          return company.company_type === "brand"}))
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    let brandArray = companyStore.list((err, brands) => {
      if (err) throw err
      let result = brands.find((brand) => {
        return (brand.name === searchQuery && brand.company_type === "brand")})
      if (result) {
        res.json(result)
      } else {
        res.sendStatus(404)
      }
    })
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, brand) => {
        if (err) throw err;
        res.json(brand);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const newBrand = { name: req.body.name, 
    email: req.body.email,
    phone_number: req.body.phone_number,
    city: req.body.city,
    state: req.body.state,
    company_type: req.body.company_type};
    companyStore.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
    });
});

router.delete('/:id', function (req, res) {
  companyStore.remove(req.params.id, (err) => {
      if (err) throw err;
      res.send("Delete Successful")
  });
});



module.exports = router;