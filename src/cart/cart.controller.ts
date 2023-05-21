import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus, Query } from '@nestjs/common';

import { OrderService } from '../order';
import { AppRequest } from '../shared';

import { CartService } from './services';

@Controller('profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get()
  async findUserCart(@Query('userId') userId: string) {
    const cart = await this.cartService.findOrCreateByUserId(userId);
    console.log("findUserCart cart", cart);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const { userId } = body;
    
    const cart = await this.cartService.updateByUserId(userId, body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest, @Body() body) {
    const { userId } = body;
    
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const { userId } = body;
    
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const order = this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId,
      cartId,
      items,
    });
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
