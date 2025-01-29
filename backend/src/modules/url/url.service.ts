import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';

const DUPLICATE_ENTRY_ERROR_CODE = '23505';

@Injectable()
export class UrlService {
  maxRetryAttempts = Number(process.env.MAX_RETRY_ATTEMPTS);

  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string): Promise<Url> {
    const existingUrl = await this.findExistingUrl(originalUrl);
    if (existingUrl) return existingUrl;

    return this.generateAndSaveShortUrl(originalUrl);
  }

  private async findExistingUrl(originalUrl: string): Promise<Url | null> {
    const existingUrl = await this.urlRepository.findOne({ where: { originalUrl } });
    if (existingUrl) {
      console.log(`Original URL already exists with shortCode: ${existingUrl.shortCode}`);
    }
    return existingUrl;
  }

  private async generateAndSaveShortUrl(originalUrl: string): Promise<Url> {
    let attempts = 0;

    while (attempts < this.maxRetryAttempts) {
      const shortCode = this.generateShortCode(8);
      const url = this.urlRepository.create({ originalUrl, shortCode });

      try {
        return await this.urlRepository.save(url);
      } catch (error) {
        if (this.isDuplicateEntryError(error)) {
          attempts++;
          console.warn(`Attempt ${attempts}/${this.maxRetryAttempts}: Short code "${shortCode}" already exists. Retrying...`);
          if (attempts >= this.maxRetryAttempts) {
            console.error(`Failed to generate a unique short code for url: ${originalUrl}`);
            throw new Error('Unexpected Error occurred. Please try again.');
          }
          continue;
        }
        throw error;
      }
    }
    throw new Error('Unexpected Error occurred. Please try again.');
  }

  async findOriginalUrl(shortCode: string): Promise<Url | null> {
    return this.urlRepository.findOne({ where: { shortCode } });
  }

  private generateShortCode(length: number): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private isDuplicateEntryError(error: any): boolean {
    return error.code === DUPLICATE_ENTRY_ERROR_CODE;
  }
}
