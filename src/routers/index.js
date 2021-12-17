const express = require('express');
const router = express.Router();


router.get('/',(req, res) => {
    res.render('index.html', { title: 'TecMarket - Home útima versión' });
});

router.get('/nosotros',(req, res) => {
    res.render('nosotros.html', { title: 'TecMarket - Nosotros' });
});

router.get('/productos-listado',(req, res) => {
    res.render('productos-listado.html', { title: 'TecMarket - Productos' });
});

router.get('/producto-detalles',(req, res) => {
    res.render('producto-detalles.html', { title: 'TecMarket - Productos Detalles' });
});


router.get('/contactanos',(req, res) => {
    res.render('contactanos.html', { title: 'TecMarket - Contáctanos' });
});

module.exports=router;
