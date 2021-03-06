import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    // TODO
    const { email, name } = request.body;
    const createCustmomerService = container.resolve(CreateCustomerService);
    const customer = await createCustmomerService.execute({ email, name });
    return response.json(customer);
  }
}
