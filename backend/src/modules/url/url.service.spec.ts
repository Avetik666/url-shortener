import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UrlService', () => {
  let service: UrlService;
  let repository: jest.Mocked<Repository<Url>>;

  const mockUrlRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    process.env.MAX_RETRY_ATTEMPTS = '3';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: getRepositoryToken(Url), useValue: mockUrlRepository },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(
      getRepositoryToken(Url),
    ) as jest.Mocked<Repository<Url>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should return an existing URL if the original URL already exists', async () => {
      const existingUrl = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc12345',
      } as Url;

      repository.findOne.mockResolvedValue(existingUrl);

      const result = await service.createShortUrl('https://example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { originalUrl: 'https://example.com' },
      });
      expect(result).toEqual(existingUrl);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new short URL', async () => {
      const newUrl = {
        id: 2,
        originalUrl: 'https://new.com',
        shortCode: 'xyz78910',
      } as Url;

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(newUrl);
      repository.save.mockResolvedValue(newUrl);

      const result = await service.createShortUrl('https://new.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { originalUrl: 'https://new.com' },
      });
      expect(repository.create).toHaveBeenCalledWith({
        originalUrl: 'https://new.com',
        shortCode: expect.any(String),
      });
      expect(repository.save).toHaveBeenCalledWith(newUrl);
      expect(result).toEqual(newUrl);
    });

    it('should retry generating a unique shortCode if a duplicate exists', async () => {
      const originalUrl = 'https://retry.com';
      const shortCode = 'uniq6789';
      const newUrl = { id: 3, originalUrl, shortCode: shortCode } as Url;

      repository.findOne.mockResolvedValueOnce(null);
      repository.create.mockReturnValue({
        originalUrl,
        shortCode: shortCode,
      } as Url);

      // Simulate unique constraint violation on first attempt
      repository.save
        .mockRejectedValueOnce({ code: '23505' }) // Duplicate error
        .mockResolvedValueOnce(newUrl); // Success on second attempt

      const result = await service.createShortUrl(originalUrl);

      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(repository.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(newUrl);
    });

    it('should throw an error if max retry attempts are exceeded', async () => {
      const originalUrl = 'https://exceed-retry.com';
      const shortCode = 'retry123';

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue({ originalUrl, shortCode } as Url);

      // Simulate unique constraint violation for all retries
      repository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createShortUrl(originalUrl)).rejects.toThrow(
        'Unexpected Error occurred. Please try again.',
      );

      expect(repository.create).toHaveBeenCalledTimes(3);
      expect(repository.save).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOriginalUrl', () => {
    it('should return the original URL for a valid short code', async () => {
      const shortCode = 'abc12345';
      const url = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode,
      } as Url;

      repository.findOne.mockResolvedValue(url);

      const result = await service.findOriginalUrl(shortCode);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { shortCode } });
      expect(result).toEqual(url);
    });

    it('should return null if no URL is found for the given short code', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOriginalUrl('nonexistent');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { shortCode: 'nonexistent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('generateShortCode', () => {
    it('should generate an 8-character alphanumeric short code', () => {
      const shortCode = (service as any).generateShortCode(8);

      expect(shortCode).toHaveLength(8);
    });
  });
});
