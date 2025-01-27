import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl: string;
}
