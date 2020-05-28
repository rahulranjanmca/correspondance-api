/**
 * class Attachment
 */

import { Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class Attachment {
  constructor() {
    this.id = uuid();
  }

  // The id of the attachment
  @Column()
  id!: string;

  // The file name of the attachment
  @Column()
  originalFilename!: string;

  // The mime type of the uploaded attachment
  @Column()
  contentType!: string;

  // URL to where the attachment is stored
  @Column()
  attachmentLocation!: string;
}
