
import { Request, Response } from "express";
import conn from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {

        const { city, state, items } = req.query;

        const query = conn('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .distinct()
            .select('points.*');

        if (city != null && city != '')
            query.where('city', 'like', `%${String(city)}%`);

        if (state != null && state != '')
            query.where('state', 'like', `%${String(state)}%`);

        const itemsStr = String(items);
        const itemsPos = ((items as any[])[0] as string);
        if (items != null && itemsStr != '[]' && itemsPos != undefined) {

            const itemsStr = itemsPos.replace('[', '').replace(']', '');
            const parsedItems = itemsStr.split(',').map(item => Number(item.trim()));
            query.whereIn('point_items.item_id', parsedItems);

        } else {
            query.whereIn('point_items.item_id', []);
        }
        const points = await query
        const serializedPoints = points.map(point => {
            return {
                ...point,
                imageUrl: `http://192.168.0.111:3333/uploads/${point.image}`
            }
        });
        return res.json(serializedPoints);
    }

    async  show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await conn('points').select('*').where('id', id).first();
        const items = await conn('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id).select('items.title');
        if (!point) {
            return res.status(400).json({ message: 'O ponto não existe' });
        }
        const serializedPoint = {
            ...point,
            imageUrl: `http://192.168.0.111:3333/uploads/${point.image}`
        }
        return res.json({ point: serializedPoint, items });
    }
    async  create(req: Request, res: Response) {
        /// Desestruturação
        const {
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
            image: req.file.filename
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
        const parsedItems = items.split(',').map((x: string) => Number(x));
        const pointItems = parsedItems.map((item_id: number) => {
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