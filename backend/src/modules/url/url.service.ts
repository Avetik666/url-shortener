import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string): Promise<Url> {
    const shortCode = Math.random().toString(36).substring(2, 8); // Basic random code
    const url = this.urlRepository.create({ originalUrl, shortCode });
    return this.urlRepository.save(url);
  }

  async findOriginalUrl(shortCode: string): Promise<Url | null> {
    return this.urlRepository.findOne({ where: { shortCode } });
  }
}
