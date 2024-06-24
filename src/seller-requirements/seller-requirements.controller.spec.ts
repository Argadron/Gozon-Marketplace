import { Test, TestingModule } from '@nestjs/testing';
import { SellerRequirementsController } from './seller-requirements.controller';
import { SellerRequirementsService } from './seller-requirements.service';

describe('SellerRequirementsController', () => {
  let controller: SellerRequirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerRequirementsController],
      providers: [SellerRequirementsService],
    }).compile();

    controller = module.get<SellerRequirementsController>(SellerRequirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
