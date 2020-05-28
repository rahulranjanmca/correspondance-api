/*
 * A single status detail regarding a Web Inquiry.
 */

import { ApiProperty } from '@nestjs/swagger';

import { ContactStatusDetailDto } from './web-inquiry.contact.status.detail.dto';

export class WebInquiryDetailDto {
  @ApiProperty()
  correspondenceNumber!: string;
  @ApiProperty()
  xrefCorrespondenceNumber!: string;
  @ApiProperty()
  modifiedDate!: string;
  @ApiProperty()
  submissionDate!: string;
  @ApiProperty()
  contactName!: string;
  @ApiProperty()
  typeOfInquiry!: string;
  @ApiProperty()
  certificateNumber!: string;
  @ApiProperty()
  wellmarkId!: string;
  @ApiProperty()
  memberFirstName!: string;
  @ApiProperty()
  memberLastName!: string;
  @ApiProperty()
  patientAccountNumber!: string;
  @ApiProperty()
  memberPlanCode!: string;
  @ApiProperty()
  groupNumber!: string;
  @ApiProperty()
  groupName!: string;
  @ApiProperty()
  billingUnit!: string;
  @ApiProperty()
  patientRelation!: string;
  @ApiProperty()
  patientDob!: string;
  @ApiProperty()
  patientFirstName!: string;
  @ApiProperty()
  patientLastName!: string;
  @ApiProperty()
  patientGender!: string;
  @ApiProperty()
  taskEmail!: string;
  @ApiProperty()
  icn!: string;
  @ApiProperty()
  sccf!: string;
  @ApiProperty()
  dateOfService!: string;
  @ApiProperty()
  question!: string;
  @ApiProperty()
  response!: string;
  @ApiProperty()
  status!: string;
  @ApiProperty()
  submitterContactName!: string;
  @ApiProperty()
  submitterPhone!: string;
  @ApiProperty()
  submitterNpi!: string;
  @ApiProperty()
  submitterProviderName!: string;
  @ApiProperty()
  renderingProviderName!: string;
  @ApiProperty()
  submitterProviderId!: string;
  @ApiProperty()
  submitterProviderState!: string;
  @ApiProperty()
  submitterProviderTaxId!: string;
  @ApiProperty()
  submitterProviderZip!: string;
  @ApiProperty()
  ownerFirstName!: string;
  @ApiProperty()
  repeatReply!: string;
  @ApiProperty()
  caseId!: string;
  @ApiProperty()
  xrefCaseID!: string;
  @ApiProperty({ type: Object })
  documents!: Record<string, any>;
  @ApiProperty({ type: [ContactStatusDetailDto] })
  statusDetails!: ContactStatusDetailDto[];
  @ApiProperty()
  facetsIndicator!: string;
  @ApiProperty()
  inquiryTypeCode!: string;
  @ApiProperty()
  unreadIndicator!: boolean;
}
