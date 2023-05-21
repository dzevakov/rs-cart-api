import { Injectable } from '@nestjs/common';
import { InjectClient } from 'nest-postgres';
import { Client } from 'pg';

import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(@InjectClient() private readonly pg: Client) {}

  async findByUserId(userId: string): Promise<Cart> {
    try {
      const carts = await this.pg.query(`select * from carts where user_id='${userId}'`);
  
      if (carts.rows.length > 0) {
        const items = await this.pg.query(`select * from cart_items where cart_id='${carts.rows[0].id}'`);
        return {
          id: carts.rows[0].id,
          items: [...items.rows]
        };
      }

      return undefined
    } catch (error) {
      console.log("findByUserId error", error);
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    const carts = await this.pg.query(`insert into carts (user_id) values ('${userId}')`)
    console.log("createByUserId carts", carts);
    
    return {
      id: carts.rows[0].id,
      items: []
    };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    
    console.log("findByUserId carts", userCart);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items: newItems }: Cart): Promise<Cart> {
    console.log("newItems", newItems);
    const { id, items } = await this.findOrCreateByUserId(userId);
    console.log("updateByUserId", id, items);

    await Promise.all(newItems.map(async (newItem) => {
      const existedItem = !!items.find(item => item['product_id'] === newItem['product_id']);
      console.log("existedItem", existedItem);
      if (existedItem) {
        await this.pg.query(`update cart_items set count='${newItem.count}' where cart_id='${id}' and product_id='${newItem["product_id"]}'`)
      } else {
        await this.pg.query(`insert into cart_items (cart_id, product_id, count) values ('${id}', '${newItem["product_id"]}', '${newItem.count}')`)
      }
    }))

    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.pg.query(`delete from carts where user_id='${userId}'`)
  }
}
