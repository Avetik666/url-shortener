import { IsString, Length } from 'class-validator';

export class GetUrlDto {
  @IsString()
  @Length(8, 8, { message: 'Short code must be exactly 8 characters' })
  shortCode: string;
}
