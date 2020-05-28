import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

import { CsWebResponseDetailFields } from '../dto/web-responses.detail.fields';
import { WebResponsesAudience } from '../enum/web-responses.audience.enum';
import { WebResponsesState } from '../enum/web-responses.state.enum';
import { WebResponsesSubject } from '../enum/web-responses.subject.enum';
import { WebResponsesType } from '../enum/web-responses.type.enum';

export class WbiInstanceEntity {
  // The id of the instance.
  @Column()
  id!: string;

  // The content type.
  @Column()
  contentType!: string;
}

export class WbiOwnerEntity {
  @Column()
  @IsNotEmpty()
  name!: string;

  @Column()
  userId!: string;
}

export class WbiAuthorizationEntity {
  @Column()
  build!: string[];

  @Column()
  release!: string[];
}

@Entity({ name: 'WebBasedInteractionTemplate' })
export class WebBasedInteractionTemplateEntity {
  constructor(body: CsWebResponseDetailFields, userId: string) {
    if (!body) {
      return;
    }

    this.audience = body.audience;
    this.authorizations = body.authorizations;
    this.businessArea = body.businessArea;
    this.configuration = body.configuration;
    this.content = body.content;
    this.data = body.data;
    this.displayName = body.displayName;
    this.formId = body.formId;
    this.instances = body.instances;
    this.mailroom = body.mailroom;
    this.name = body.name;
    this.owners = body.owners;
    this.segment = body.segment;
    this.sourceSystemType = body.sourceSystemType;
    this.state = body.state;
    this.subject = body.subjects;
    this.subtype = body.subtype;
    this.templateDescriptionAvailable = body.templateDescriptionAvailable;
    this.type = body.type;

    const now = new Date();
    this.lastUpdated = now.toISOString();
    this.created = now.toISOString();
    this.lastUpdateUser = userId;
  }

  @ObjectIdColumn()
  _id!: ObjectID;

  // Update / Final
  @Column({ enum: WebResponsesType })
  @IsEnum(WebResponsesType)
  @IsNotEmpty()
  type!: WebResponsesType;

  // Name of the template
  @Column()
  @IsNotEmpty()
  name!: string;

  // content	String	The actual message
  // The “friendly” name of the template; this is the one shown in the UI
  @Column()
  displayName!: string;

  //  Array of Enum	An item is applicable to >= 1 subjects. This will be stored as an array in the database; during UI presentation, the user (when selecting one subject) would query to see if a given template is applicable to a given subject (e.g. “show templates related to Claims” would return a template with a “subjects” array which contains [“Claims”,”Benefits”].
  @Column({ enum: WebResponsesSubject })
  @IsArray()
  @IsNotEmpty()
  @IsEnum(WebResponsesSubject, { each: true })
  subject!: WebResponsesSubject[];

  // Enum Values:  Member/Provider
  @Column({ enum: WebResponsesAudience })
  @IsEnum(WebResponsesAudience)
  @IsNotEmpty()
  audience!: WebResponsesAudience;

  // An item can be applicable to IA, to SD, or IA and SD.Upon display of a question to answer, the system will know the state which is related to the current question and will narrow the list of available choices.
  // If the case is related to an Iowa policy, templates with state of[“IA”]and[“IA”, ”SD”]would be returned.
  @Column({ enum: WebResponsesState })
  @IsEnum(WebResponsesState, { each: true })
  @IsArray()
  @IsNotEmpty()
  state!: WebResponsesState[];

  // Time of the last time this template was updated
  @Column()
  lastUpdated!: string;

  // The time when this item was created.
  @Column()
  @IsNotEmpty()
  created!: string;

  // User identifier of the last person to update the template item
  @Column()
  @IsNotEmpty()
  lastUpdateUser!: string;

  @Column()
  formId!: string;

  // The actual content of the Web Response.
  @Column()
  @IsNotEmpty()
  content!: string;

  // An object that specifies the configuration for this web response.
  @Column(() => Object)
  configuration!: Record<string, any>;

  @Column()
  sourceSystemType!: string;

  @Column(() => WbiInstanceEntity)
  instances!: WbiInstanceEntity[];

  @Column()
  templateDescriptionAvailable!: boolean;

  @Column()
  segment!: string[];

  @Column()
  businessArea!: string[];

  @Column()
  subtype!: string[];

  @Column(() => WbiAuthorizationEntity)
  authorizations!: WbiAuthorizationEntity;

  @Column(() => Object)
  data!: Record<string, any>[];

  @Column(() => WbiOwnerEntity)
  owners!: WbiOwnerEntity[];

  @Column(() => Object)
  mailroom!: Record<string, any>;
}
