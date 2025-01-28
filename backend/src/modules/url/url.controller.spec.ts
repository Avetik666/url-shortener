import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetUrlDto } from './dto/get-url.dto';
import {
  NotFoundException,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    createShortUrl: jest.fn(),
    findOriginalUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [{ provide: UrlService, useValue: mockUrlService }],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should return a short URL for a valid input', async () => {
      const dto: CreateUrlDto = { originalUrl: 'https://example.com' };
      const shortUrl = { shortCode: 'abc123', originalUrl: dto.originalUrl };

      mockUrlService.createShortUrl.mockResolvedValue(shortUrl);

      const result = await controller.createShortUrl(dto);

      expect(service.createShortUrl).toHaveBeenCalledWith(dto.originalUrl);
      expect(result).toEqual(shortUrl);
    });

    it('should throw a validation error for an invalid URL', async () => {
      const dto = { originalUrl: 'invalid-url' };

      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) =>
          new BadRequestException(
            errors
              .map((error) =>
                error.constraints
                  ? Object.values(error.constraints).join(', ')
                  : 'Validation error',
              )
              .join(', '),
          ),
      });

      await expect(
        validationPipe.transform(dto, { type: 'body', metatype: CreateUrlDto }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        validationPipe.transform(dto, { type: 'body', metatype: CreateUrlDto }),
      ).rejects.toThrowError('Please provide a valid URL');
    });
  });

  describe('redirectToOriginal', () => {
    it('should return the original URL for a valid short code', async () => {
      const params: GetUrlDto = { shortCode: 'abc123' };
      const originalUrl = 'https://example.com';

      mockUrlService.findOriginalUrl.mockResolvedValue(originalUrl);

      const result = await controller.redirectToOriginal(params);

      expect(service.findOriginalUrl).toHaveBeenCalledWith(params.shortCode);
      expect(result).toEqual(originalUrl);
    });

    it('should throw NotFoundException for an invalid short code', async () => {
      const params: GetUrlDto = { shortCode: 'invalid' };

      mockUrlService.findOriginalUrl.mockResolvedValue(null);

      await expect(controller.redirectToOriginal(params)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOriginalUrl).toHaveBeenCalledWith(params.shortCode);
    });

    it('should throw a validation error for an invalid short code length', async () => {
      const params = { shortCode: '123' };

      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) =>
          new BadRequestException(
            errors
              .map((error) =>
                error.constraints
                  ? Object.values(error.constraints).join(', ')
                  : 'Validation error',
              )
              .join(', '),
          ),
      });

      await expect(
        validationPipe.transform(params, {
          type: 'param',
          metatype: GetUrlDto,
        }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        validationPipe.transform(params, {
          type: 'param',
          metatype: GetUrlDto,
        }),
      ).rejects.toThrowError('Short code must be exactly 8 characters');
    });
  });
});
