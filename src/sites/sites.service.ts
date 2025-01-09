import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'nestjs-prisma';
import { Site } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SitesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const { url } = createSiteDto;
    const site = await this.prisma.site.findUnique({
      where: {
        url,
      },
    });

    if (site) {
      throw new BadRequestException('Site already exists');
    }

    const newSite = await this.prisma.site.create({
      data: {
        url,
      },
    });
    this.eventEmitter.emit('site.created', site);
    return newSite;
  }

  async findAll() {
    return `This action returns all sites`;
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.prisma.site.findUnique({
      where: {
        id,
      },
    });
    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const site = await this.prisma.site.findUnique({
      where: {
        id,
      },
    });
    if (!site) {
      throw new NotFoundException('Site not found');
    }

    const updatedSite = await this.prisma.site.update({
      where: {
        id,
      },
      data: {
        ...updateSiteDto,
      },
    });

    if (!updatedSite) {
      throw new InternalServerErrorException('Could not update the site url');
    }

    return updatedSite;
  }

  async remove(id: string) {
    const site = await this.prisma.site.delete({
      where: {
        id,
      },
    });

    return { message: 'Site deleted', site };
  }
}
