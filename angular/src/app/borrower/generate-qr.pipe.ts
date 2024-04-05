import { Pipe, PipeTransform } from '@angular/core';
import QRCode from 'qrcode';

@Pipe({ name: 'generateQr', standalone: true })
export class GenerateQrPipe implements PipeTransform {
  transform(isbn: string): Promise<string> {
    return QRCode.toDataURL(isbn, { margin: 2 });
  }
}
