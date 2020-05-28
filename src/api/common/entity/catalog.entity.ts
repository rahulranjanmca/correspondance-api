/**
 * class CatalogConfigurationEntity
 */

export class CatalogConfigurationEntity {
  template!: string;
  job!: string;
  templateDescription!: string;
}

export class CatalogInstanceEntity {
  id!: string;
  contentType!: string;
}

export class AuthorizationOwnerEntity {
  name!: string;
  userId!: string;
}

export class CatalogAuthorizationEntity {
  build!: string[];
  release!: string[];
}

export class CatalogMailroomEntity {
  returnEnvelope!: boolean;
}

export class CatalogEntity {
  name!: string;
  displayName!: string;
  formId!: string;
  created!: string;
  lastUpdated!: string;
  description!: string;
  sourceSystemType!: string;
  configuration!: CatalogConfigurationEntity;
  instances!: CatalogInstanceEntity[];
  templateDescriptionAvailable!: boolean;
  authorizations!: CatalogAuthorizationEntity;
  segment!: string[];
  audience!: string[];
  state!: string[];
  subject!: string[];
  businessArea!: string[];
  type!: string;
  subtype!: string;
  owners!: AuthorizationOwnerEntity[];
  mailroom!: CatalogMailroomEntity;
  metadata!: object;
  DocumentType!: string;
}
