import { IsUrl } from 'class-validator';

export class CreateSiteDto {
  @IsUrl()
  url: string;
}
