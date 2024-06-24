import { Test, TestingModule } from '@nestjs/testing';
import { SellerRequirementsService } from './seller-requirements.service';

describe('SellerRequirementsService', () => {
  let service: SellerRequirementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerRequirementsService],
    }).compile();

    service = module.get<SellerRequirementsService>(SellerRequirementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
