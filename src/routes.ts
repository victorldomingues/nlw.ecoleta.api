
import express from "express";
import PointsController from './controllers/points.controller';
import ItemsController from "./controllers/items.controller";
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

const routes = express.Router();

const itemsController = new ItemsController();
const pointsController = new PointsController();

const upload = multer(multerConfig);

routes.get('/items', itemsController.index)
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            state: Joi.string().required().max(2),
            city: Joi.string().required(),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    pointsController.create

);

export default routes;
