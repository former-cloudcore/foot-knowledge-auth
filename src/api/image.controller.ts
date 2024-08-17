import { Get, Res, Param, JsonController } from 'routing-controllers';
import { Response } from 'express';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

@JsonController('/images')
export class ImageController {
  private readonly defaultImagePath = resolve(__dirname, '../../../public', 'default-profile-pic.png');

  @Get('/:imageName')
  getImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const imagePath = resolve(__dirname, '../../../public', imageName);
    const finalPath = existsSync(imagePath) ? imagePath : this.defaultImagePath;
    
    try {
        const image = readFileSync(finalPath);
        res.set('Content-Type', 'image/png');
        res.send(image);
      } catch {
        res.status(500).send('Error reading image');
      }
  }
}
