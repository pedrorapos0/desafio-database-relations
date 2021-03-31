import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO

    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const productsID = products.map(product => product.id);
    const listProducts = await this.ormRepository.find({ id: In(productsID) });
    return listProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const productsID = products.map(product => product.id);
    const listProduct = await this.ormRepository.find({ id: In(productsID) });
    const updatedQntProducts = listProduct.map(product => {
      const productsInformed = products.find(
        productInformed => productInformed.id === product.id,
      );
      if (productsInformed) {
        product.quantity -= productsInformed.quantity;
      }
      return product;
    });

    await this.ormRepository.save(updatedQntProducts);
    return updatedQntProducts;
  }
}

export default ProductsRepository;
