import { Controller, Post, Body, Get, Param, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from "./dto/create-url.dto";
import { GetUrlDto } from "./dto/get-url.dto";

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    const { originalUrl } = createUrlDto;
    return this.urlService.createShortUrl(originalUrl);
  }

  @Get(':shortCode')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async redirectToOriginal(@Param() params: GetUrlDto) {
    const { shortCode } = params;
    const url = this.urlService.findOriginalUrl(shortCode);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return url;
  }
}
