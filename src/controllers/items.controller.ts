
import { Request, Response } from "express";
import conn from '../database/connection';

class ItemsController {
    async  index(req: Request, res: Response) {
        const items = await conn('items').select('*');
        const serializedItems = items.map(item => {
            return { id: item.id, title: item.title, image: item.image, imageUrl: `http://localhost:3333/uploads/${item.image}` }
        })
        return res.json(serializedItems);
    }

}

export default ItemsController;