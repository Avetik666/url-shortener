import { IsString, Length } from 'class-validator';

export class GetUrlDto {
  @IsString()
  @Length(6, 6, { message: 'Short code must be exactly 6 characters' })
  shortCode: string;
}
