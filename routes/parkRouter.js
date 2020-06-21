const express = require('express');
const bodyParser = require('body-parser');
const Park = require('../models/park');
const authenticate = require('../authenticate');
const cors = require('./cors');

const parkRouter = express.Router();

parkRouter.use(bodyParser.json());

parkRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Park.find()
      .then((parks) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(parks);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Park.create(req.body)
        .then((parks) => {
          console.log('Park Created ', park);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(parks);
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /parks');
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Park.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = parkRouter;
