import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from 'nest-postgres';

const { HOST, PORT, DATABASE, PASSWORD } = process.env;
const PG_CONNECTION = `postgresql://postgres:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule.forRoot({
      connectionString: PG_CONNECTION
    }),
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
