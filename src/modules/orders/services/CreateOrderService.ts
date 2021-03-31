import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Consumer does not exist');
    }

    const productList = await this.productsRepository.findAllById(products);
    if (productList.length !== products.length || products.length === 0) {
      throw new AppError('Some product does not exist');
    }

    const availableProducts = productList.map(pl => {
      const productAvailable = products.find(product => product.id === pl.id);
      if (productAvailable) {
        if (productAvailable.quantity > pl.quantity) {
          throw new AppError(
            `Product ${productAvailable.id} quantity unavailable.`,
          );
        }
      }
      return {
        product_id: pl.id,
        price: pl.price,
        quantity: productAvailable?.quantity || 0,
      };
    });

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: availableProducts,
    });

    return order;
  }
}

export default CreateOrderService;
