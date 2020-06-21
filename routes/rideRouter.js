const express = require('express');
const bodyParser = require('body-parser');
const Ride = require('../models/ride');
const authenticate = require('../authenticate');
const cors = require('./cors');

const rideRouter = express.Router();

rideRouter.use(bodyParser.json());

rideRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Ride.find()
      .then((rides) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rides);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Ride.create(req.body)
        .then((ride) => {
          console.log('Ride Created ', ride);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(ride);
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
      res.end('PUT operation not supported on /rides');
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Ride.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = rideRouter;
