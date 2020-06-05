
import { Request, Response } from "express";
import conn from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {

        const { city, state, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await conn('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .where('city', 'like', `%${String(city)}%`)
            .where('state', 'like', `%${String(state)}%`)
            .whereIn('point_items.item_id', parsedItems)
            .distinct()
            .select('points.*')
            ;
        return res.json(points);
    }

    async  show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await conn('points').select('*').where('id', id).first();
        const items = await conn('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id).select('items.title');
        if (!point) {
            return res.status(400).json({ message: 'O ponto não existe' });
        }
        return res.json({ point, items });
    }
    async  create(req: Request, res: Response) {
        /// Desestruturação
        const {
            // image
            name
            , email
            , whatsapp
            , latitude
            , longitude
            , city
            , state
            , items
        } = req.body;

        const trx = await conn.transaction();

        // short syntaxe
        const point = {
            image: 'image-fake'
            , name
            , email
            , whatsapp
            , latitude
            , longitude
            , city
            , state
        };

        const insertedIds = await trx('points').insert(point).returning('id');

        const point_id = insertedIds[0];

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        });
        await trx('point_items').insert(pointItems);

        await trx.commit();

        return res.json({ id: point_id, ...point });
    }
}

export default PointsController;