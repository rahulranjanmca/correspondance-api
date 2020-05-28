import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Put } from '@nestjs/common';
import { Request } from 'express';
const statusMock = [['IA'], ['SD'], ['IA', 'SD']];
@Controller()
export class MockController {
  @Get('/catalog')
  getCatalog(@Query('role') role: string) {
    console.log('receive get catalog', role);
    const retList = [
      {
        name: 'multi instance and any one can approval and reject template',
        displayName: 'WBCBS - Surrogate Letter- More Information Needed',
        formId: 'B-2317901',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'This letter is sent to members who have inquired about being a surrogate. The purpose of this letter is to get more information about the arrangement.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:7ae35c41-7a9b-4b93-93e7-ce115d5881f1',
            contentType: 'application/pdf'
          },
          {
            id: 'gmctid:7ae35c41-7a9b-4b93-93e7-ce115d5881f2',
            contentType: 'application/pdf'
          },
          {
            id: 'gmctid:7ae35c41-7a9b-4b93-93e7-ce115d5881f3',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Surrogate',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'need create by role "build_role"',
        displayName: 'WBCBS - Surrogacy Letter- Benefits decision',
        formId: 'B-2317902',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          "This letter is sent to the surrogate describing Wellmark's decision to process benefits as they are outlined in the coverage manual.",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:295a2d13-4f20-45d3-aa7a-b42960d7cccd',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Surrogate',
        authorizations: {
          build: ['build_role'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'multi role in approval chain, "CSA" role can requestApproval',
        displayName: 'WBCBS Member Call Back Letter',
        formId: 'B-2318744',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'This letter is mailed by Customer Service to members when a CSA has tried to contact a member two times but were unsuccessful. The letter instructs the member to call us back. The CSA uses Compass to generate the letter.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:bd5ce1a3-2a2b-4c71-95ce-e8c973072371',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Operations',
        type: 'Call Back',
        authorizations: {
          build: ['*'],
          release: ['CSA', 'CSA-SUPERVISOR', 'LEGAL', 'MARCOM']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - Indemnity Agreement and Avoidance of Administration Affidavit with cover letter',
        displayName: 'WBCBS - Indemnity Agreement and Avoidance of Administration Affidavit with cover letter',
        formId: 'C-2601',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Requests an affidavit to change the payee or address for a refund of premium when a customer has passed away.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5a50fbd3-7e13-49a1-81d7-b67201fb9087',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['INDV U65 ACA', 'INDV U65 GM', 'INDV U65 GF', 'INDV MedSupp', 'Group MedSupp', 'Large Group', 'Other '],
        audience: ['Member'],
        businessArea: 'Customer Service & Operations',
        type: 'Indemnity Agreement',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - CS Housing - Change Notification',
        displayName: 'WBCBS - CS Housing - Change Notification',
        formId: 'B-2620250',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Customer Service letter for housing agency to request they use standard form for request',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:902643be-5039-4b1c-a095-fd2d7082e6ce',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Housing',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - CS Housing -Premium Request',
        displayName: 'WBCBS - CS Housing -Premium Request',
        formId: 'B-2620251',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Customer Service letter in response to a request premium information.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:3c1f9fdb-2437-4c61-925a-193c378c2019',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Housing',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - CS Housing - Power of Attorney',
        displayName: 'WBCBS - CS Housing - Power of Attorney',
        formId: 'B-2620252',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Customer Service letter for housing agency needing Power of Attorney or new signature.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:8db1b5a0-a785-4334-9af0-c08208abdbbe',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Housing',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - CS Housing - Non-Compliant Authorization Form',
        displayName: 'WBCBS - CS Housing - Non-Compliant Authorization Form',
        formId: 'B-2620253',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Customer service letter rqeuesting they use the standard form.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:98862462-048d-4505-9080-46ef9c034aff',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Housing',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'CS Medicaid Insurance Inquiry Letter',
        displayName: 'CS Medicaid Insurance Inquiry Letter',
        formId: 'B-2620255',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to verify member for health coverage as required by law',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:771c6b6d-cac9-4c45-b7a2-3f8f9d96eaa4',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'DHS',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'CS Medicaid Eligibility Cancellation',
        displayName: 'CS Medicaid Eligibility Cancellation',
        formId: 'B-2620256',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to verify member for health coverage as required by law',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5d0c14b7-86db-4290-94e9-9b774d9bd223',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'DHS',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS EFT Letter',
        displayName: 'WBCBS EFT Letter',
        formId: 'N-2620353',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to advise we have processed the new EFT',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ed2c708e-6c6c-4298-becb-cf57dcedf42e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Electronic Funds Transfer - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Call Back Letter with Out Answer',
        displayName: 'Call Back Letter with Out Answer',
        formId: 'B-2620655',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is to advise the member that 2 callback attempts have been made and to call Wellmark',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:8141509a-cc58-4177-855e-d83b5081351e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member', 'Provider', 'Producer', 'Group'],
        businessArea: 'Customer Service',
        type: 'Call Back',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: '',
        displayName: '',
        formId: 'B-2620903',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Letter is used when Wellmark cannot identify the member for Housing',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:aeb82093-8bd6-4da6-b48d-88b293d81537',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member '],
        businessArea: 'Customer Service',
        type: 'Housing',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Attorney Authorization Request',
        displayName: 'Attorney Authorization Request',
        formId: 'B-2620904',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to advised that a form is needed before we can provide claim history',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:c6713f0a-7972-4442-9f6e-175d6d2062e8',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Legal'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Attorney',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Attorney Claim Summary Response Letter',
        displayName: 'Attorney Claim Summary Response Letter',
        formId: 'B-2620905',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to attorney for claim history',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:01e5ad64-9fa3-4b09-af74-3aca61d8eb90',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Legal'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Attorney',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: '40CSCoverLetter',
        displayName: '40CSCoverLetter',
        formId: 'B-3004',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'CS Cover Letter',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:0c2d98f1-f6ab-4982-9f19-f78acc0c66b7',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member', 'Provider', 'Producer', 'Group'],
        businessArea: 'Customer Service',
        type: 'Cover Letter',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSSD Verification of Coverage Letter',
        displayName: 'WBCBSSD Verification of Coverage Letter',
        formId: 'B-3320',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Letter sent to members requesting verification of their coverage, covered members and effective dates.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:bccd5787-5ab4-4a23-87d3-a4bede410717',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Coverage Verification',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Blank Letter for Ad Hoc Correspondence',
        displayName: 'Blank Letter for Ad Hoc Correspondence',
        formId: 'B-4003',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Letterhead with salutation and closing',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:4fd71ad3-95ee-49f8-be0b-25c2a8b2d2ba',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member', 'Provider', 'Producer', 'Group'],
        businessArea: 'Customer Service',
        type: 'Free Form Letter',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA WHPI Cashed Check Letter Template',
        displayName: 'WBCBSIA WHPI Cashed Check Letter Template',
        formId: 'B-4004',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'If a customer pays a claim and they call in saying their reimbursement check is missing, not cashed, etc.  We send a copy of the cashed check to provide proof the check was cashed.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:4a17a481-7692-43b1-9315-1757854cbd48',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims', 'Billing/Finance'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Cashed Check Copy',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA WHPI Yearly Premium Received Letter Template',
        displayName: 'WBCBSIA WHPI Yearly Premium Received Letter Template',
        formId: 'B-4008',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'A report of all premium paid year to date.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5384d725-1142-41ba-8b55-7ccd49f925ad',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv MedSupp', 'Indv U65 ACA', 'Indv U65 GM', 'Indv U65 GF', 'Group MedSupp', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Yearly Premium Paid',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA WHPI ACA Plus 3 Dependent Letter Template',
        displayName: 'WBCBSIA WHPI ACA Plus 3 Dependent Letter Template',
        formId: 'B-4009',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used when more than 3 dependents are on an ACA plan under the age of 18',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:585bf653-9c8d-49f0-9dfc-b3dbb79396e9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv U65 ACA', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Breakdown',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Death Verification Letter for IFP',
        displayName: 'Death Verification Letter for IFP',
        formId: 'M-4618312',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'If someone calls in to report a death and the deceased is the only person on the policy, this letter is sent out to verify that they have in fact passed away.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:0afd5941-a5f0-49c0-ae56-47ad757bd1b2',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Death Verification',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA/WHPI Customer Service Letter - Verification of cancellation coverage',
        displayName: 'WBCBSIA/WHPI Customer Service Letter - Verification of cancellation coverage',
        formId: 'B-4671',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Letter - Verification of coverage- Customer Service - letters sent to members who have called into Customer Service',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a6699cbf-b2e1-4f91-9115-783ca742c024',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Cancelation Verification',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'CS Premium Breakdown 32',
        displayName: 'CS Premium Breakdown 32',
        formId: 'B-4682',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to tell member level rates to a member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:af87ed03-21a1-4668-8cd5-9cdfb7cc382c',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv U65 ACA', 'Indv U65 GM', 'Indv U65 GF', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Breakdown',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA - WHPI Premium Paid Verification Letter',
        displayName: 'WBCBSIA - WHPI Premium Paid Verification Letter',
        formId: 'B-4683',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Customer service will send this letter to a direct pay member when they have called in for verification of their premium payment',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:1c94c03a-527c-40f1-922c-9e85f57e36e2',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv U65 ACA', 'Indv U65 GM', 'Indv U65 GF', 'Indv MedSupp', 'Group MedSupp', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Receipt',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBSIA / WHPI Contract Level Rates',
        displayName: 'WBCBSIA / WHPI Contract Level Rates',
        formId: 'B-4684',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Customer service will send this letter to a direct pay member when they have called in about the contract level rates.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b0e6c6f7-de9d-4305-84da-d3ea07e8f0b0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv U65 GM', 'Indv U65 GF', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Breakdown',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Global Core PPO Letter',
        displayName: 'Global Core PPO Letter',
        formId: 'B-5651',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          "Customer Service will use this letter to respond to member's request for written confirmation of BlueCard coverage for a dependent who is currently covered under their policy.",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:17d06983-e0be-4315-93da-1a8af41706a7',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Global Core',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS MedicareBlue Supplement Fulfillment Cover Letter',
        displayName: 'WBCBS MedicareBlue Supplement Fulfillment Cover Letter',
        formId: 'B-7001',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: "Cover letter to include with Customer Service's fulfillment of the MedicareBlue Supplement kits",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:4bcba5de-bd5f-4a41-819a-ef7801e21919',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['INDV MEDSUPP', 'GROUP MEDSUPP', 'Other '],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Medicare Supplement Kit Cover Letter',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Cashed Check Letter Template',
        displayName: 'FBHP/WMAI - Cashed Check Letter Template',
        formId: 'FB-B-9019642',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Templates for CSA use\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:35f06362-491d-433a-82e3-2e8bbd67e6c8',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims', 'Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Cashed Check Copy - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Yearly Premium Received Letter Template',
        displayName: 'FBHP/WMAI - Yearly Premium Received Letter Template',
        formId: 'FB-B-9019644',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Templates for CSA use.\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5deae43c-2e77-426c-9880-385af4e91557',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Yearly Premium Paid - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Worldwide Blue Advantage and Blue Access Letter - BlueCard',
        displayName: 'Worldwide Blue Advantage and Blue Access Letter - BlueCard',
        formId: 'B-9601',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          "Used to be BlueCard Worldwide.  Traveling for emergency services, etc.  Sort of a Proof of Coverage letter for programs that require it.  For example, an exchange student.  Customer Service will use this letter to respond to member's request for written confirmation of BlueCard Worldwide coverage for a dependent who is currently covered under their policy.",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:06f17fa5-92dc-4cae-a67c-f486a7033da5',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Global Core',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Worldwide BlueChoice Letter - BlueCard',
        displayName: 'Worldwide BlueChoice Letter - BlueCard',
        formId: 'B-9602',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Customer Service will use this letter to respond to member request for written confirmation of BlueCard Worldwide coverage for a dependent who is currently covered under their policy.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b2694693-81f2-424c-b250-70583f072e50',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'Other'
        ],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Global Core',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Customer Service Letter - Letter - Verification of coverage',
        displayName: 'FBHP/WMAI - Customer Service Letter - Letter - Verification of coverage',
        formId: 'FB-B-9619646',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Letter - Verification of coverage- Customer Service - PAC Team letters- letters sent to members who have called into Customer Service.\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ea9f511e-e04f-421b-b5ee-e3aef9b9b900',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Coverage Verification - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Premium Breakdown Letter',
        displayName: 'FBHP/WMAI - Premium Breakdown Letter',
        formId: 'FB-B-9619649',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Customer service will send this letter to a direct pay member when they have called in for verification and breakdown of their monthly premium amount.\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b9f480f7-89e2-4e17-99d9-d65d84e1d31f',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Breakdown -  Member Level - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Worldwide Blue Advantage and Blue Access Letter - BlueCard',
        displayName: 'FBHP/WMAI - Worldwide Blue Advantage and Blue Access Letter - BlueCard',
        formId: 'FB-B-9619651',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'Exhibit of rates at the member level. Customer service will send this letter to a direct pay member when they have called in for verification and breakdown of their monthly premium amount',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:98704733-6dbc-4591-90de-5ca818de88dd',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Global Core',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP/WMAI - Iowa IFP Verificatiion of Cancellation Letter',
        displayName: 'FBHP/WMAI - Iowa IFP Verificatiion of Cancellation Letter',
        formId: 'FB-M-9619652',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'This letter will be sent to Iowa IFP members who cancel their coverage over the phone.\nIFP = Individual and Family Plans, also known as Individual Under 65.\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:0755f8e6-340f-4220-a725-7c0999dba7ef',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Cancelation Verification - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Death Verification of Cancelation IFP Letter\nFBHP/WMAI - Iowa Death Verification of Cancellation Letter',
        displayName: 'Death Verification of Cancelation IFP Letter\nFBHP/WMAI - Iowa Death Verification of Cancellation Letter',
        formId: 'FB-M-9619653',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          "This letter will be sent when an Iowa IFP member's coverage is canceled because they passed away.\nIFP = Individual and Family Plans, also known as Individual Under 65.\nThere are several customer service letters that need unique form numbers for Farm Bureau Health Plan. These all fit under co-branded materials for FB and Wellmark Administrators Inc. They are also based on existing letters used for Wellmark, Inc.\nThese letters will be added to the co-branded FBHP and WMAI letterhead, yet to be approved/finalized. I will send you final versions of all letters once we add the NEW form numbers to the official letterhead.",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:04e5b0a8-67fd-46a9-803b-e084aaf62185',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Death Verification - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FBHP - Indeminty Request for Affidavit',
        displayName: 'FBHP - Indeminty Request for Affidavit',
        formId: 'FB-C-9619807',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Requests an affidavit to change the payee or address for a refund of premium when a customer has passed away.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:de477c17-1e9a-4828-8e34-f91e76f1783c',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Indemnity Agreement - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS/WHPI - Premium Breakdown Letter',
        displayName: 'WBCBS/WHPI - Premium Breakdown Letter',
        formId: 'B-9620266',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'This letter is sent when an on-exchange member calls in requesting a breakdown of their premium. This premium will not include any potential APTC they have.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:798d230d-5a67-4237-a8a1-e7cad85435bc',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['Indv U65 ACA', 'Other'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Premium Breakdown',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS FBHP EFT Letter',
        displayName: 'WBCBS FBHP EFT Letter',
        formId: 'N-9620354',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'FBHP letter is sent as a confirmation to the member when they have provided their bank information over the phone.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:099f842a-d37a-4f08-bd9f-50f053e73e6b',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Billing/Finance'],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Electronic Funds Transfer',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Farm Bureau Fullfillment Letter( only farm bureau version)',
        displayName: 'Farm Bureau Fullfillment Letter( only farm bureau version)',
        formId: 'FB-B-9620820',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to mail forms to member or agents',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:7f01aafe-87d2-4444-8113-97e733e90d05',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Cover Letter - FBHP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Call Back - With Out Answer FBHP',
        displayName: 'Call Back - With Out Answer FBHP',
        formId: 'B-9620881',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter us used to respond to a member who we have attempted 2 call backs',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a1156a93-a024-4454-8253-57dfb3a3cdfe',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Call Back',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Call Back - With Answer FBHP',
        displayName: 'Call Back - With Answer FBHP',
        formId: 'B-9620882',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to member with the answer when we cannot reach them over the phone',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ba2633c1-c80b-4967-9c1d-e1d929c9ba3d',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: [
          'Benefits',
          'Claims',
          'Membership',
          'Pharmacy',
          'Billing / Finance',
          'Legal',
          'COB /Other Insur',
          'Hlth & Care Mgmt/Authorizations'
        ],
        segment: ['FBHBP'],
        audience: ['Member'],
        businessArea: 'Customer Service',
        type: 'Call Back',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        displayName: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        formId: 'C-2019381',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b07da258-1d8a-49ce-8e46-aea22947a8f0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry response - Adjustment Timely Filing',
        displayName: 'BlueCard Provider Inquiry response - Adjustment Timely Filing',
        formId: 'C-2019382',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b13e25c7-5f47-4e44-beec-5b58ec032e5c',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Clean Claim Denial',
        displayName: 'BlueCard Provider Inquiry Response - Clean Claim Denial',
        formId: 'C-2019383',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ab2b0bae-26d8-4d6a-b25d-53aafd6e6a83',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Home Plan Denied',
        displayName: 'BlueCard Provider Inquiry Response - Home Plan Denied',
        formId: 'C-2019384',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:09dd7e10-8ade-4f66-8f20-c6c20224a20f',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Home Plan Prime',
        displayName: 'BlueCard Provider Inquiry Response - Home Plan Prime',
        formId: 'C-2019385',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ce71b2c1-b716-4f66-9473-98cf8b374197',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Invalid Reciept Date',
        displayName: 'BlueCard Provider Inquiry Response - Invalid Reciept Date',
        formId: 'C-2019386',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:be36e8f7-4a00-40e9-9b10-46843e7e0ed9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Stand on Processing',
        displayName: 'BlueCard Provider Inquiry Response - Stand on Processing',
        formId: 'C-2019387',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:9ef81a71-d50d-4ab8-ae17-75fe7bc58e2b',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - U313-U316 Denial',
        displayName: 'BlueCard Provider Inquiry Response - U313-U316 Denial',
        formId: 'C-2019388',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:8855f38b-2003-46b8-a810-a4d69438be0e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - U313-U316 Deinal Incorrect',
        displayName: 'BlueCard Provider Inquiry Response - U313-U316 Deinal Incorrect',
        formId: 'C-2019389',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:f0069eea-269c-4e4d-9244-76ee4c003de8',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Unsolicited cash',
        displayName: 'BlueCard Provider Inquiry Response - Unsolicited cash',
        formId: 'C-2019390',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'BlueCard inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:52334638-0b29-4185-b399-299af45abc5d',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        displayName: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        formId: 'B-2320906',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to Blue Card Provider inquires about Balance Bill',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a6e616d6-1c01-4ffc-9065-e500c48226b7',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        displayName: 'BlueCard Provider Inquiry Response - Additional Info Previously Requested',
        formId: 'B-2320907',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to Blue Card Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:f1a156ca-d39d-456d-a1a5-aaa99ad31fd6',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Blue Card Medical Records Second Request Letter',
        displayName: 'Blue Card Medical Records Second Request Letter',
        formId: 'C-53181',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: '',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ca23405a-f0e8-4daa-bf62-eb3452228911',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Blue Card Medical Records',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - Adjustment Timely Filing',
        displayName: 'Provider Inquiry Response  - Adjustment Timely Filing',
        formId: 'C-2019404',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:32d2066b-69e7-4980-9702-b8d3007a6f66',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: '',
        displayName: '',
        formId: 'C-2019405',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to Provider inquires about claim processing',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ebbef51e-9fd1-4e0c-8cf7-aec6757c4ff0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: '',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - Clean Claim Denial',
        displayName: 'Provider Inquiry Response  - Clean Claim Denial',
        formId: 'C-2019406',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:0cb55718-cb1d-4814-917a-f21ede83cef0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - Corrected Claim With No Changes',
        displayName: 'Provider Inquiry Response  - Corrected Claim With No Changes',
        formId: 'C-2019407',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5cb45105-d08f-4688-835e-63fdd28e6fd0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - Cotiviti Audit',
        displayName: 'Provider Inquiry Response  - Cotiviti Audit',
        formId: 'C-2019408',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:fdbbedf2-57eb-4d8f-a3e0-e3b7709b5cc0',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - EAPG For PTOT And Speech Therapy',
        displayName: 'Provider Inquiry Response  - EAPG For PTOT And Speech Therapy',
        formId: 'C-2019409',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:300904cf-cbb6-4090-a20a-2e4ea2143336',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - EAPG Payment Methodology Response',
        displayName: 'Provider Inquiry Response  - EAPG Payment Methodology Response',
        formId: 'C-2019410',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to Provider inquires about claim pricing',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:dca53d66-b47d-4b9f-9698-92649ca3b5db',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Health Care Innovation & Business Development',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry Response  - Med Supp Does Not COB',
        displayName: 'Provider Inquiry Response  - Med Supp Does Not COB',
        formId: 'C-2019411',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:f355713f-41bd-40cd-9e7b-c0ef78ec69f5',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - MedSuppNeedCorrectedMRN',
        displayName: 'Provider Inquiry - MedSuppNeedCorrectedMRN',
        formId: 'C-2019412',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:98535334-5175-49a3-8010-228f69cf1240',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: '',
        displayName: '',
        formId: 'C-2019413',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description:
          'This one is confusing. C-2019413 is listed as obsolete by Forms Management and the attached project document.\nThere is a new Day Claim Timely Filing Letter, the number is C-2618772 (which doesnt fall in line with this numbering scheme).\nThere is also C-2019424 Timely Filing defense, which does fall falls in this list numerically, but is listed separately on Day 1 letters. Not sure how to proceed on this one.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:4fb0796e-549a-4fb9-8f02-9c5570f8c47d',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: '',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - NoClaimOnFile',
        displayName: 'Provider Inquiry - NoClaimOnFile',
        formId: 'C-2019414',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:04544e41-ab82-45c0-b1d2-5436af70cf18',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - NotACoveredBenefit',
        displayName: 'Provider Inquiry - NotACoveredBenefit',
        formId: 'C-2019415',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:42b57041-d341-4622-812d-a430aa5b0d30',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - NPIDoesNotMatch',
        displayName: 'Provider Inquiry - NPIDoesNotMatch',
        formId: 'C-2019416',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5b7afcd1-b3e8-4e8d-a805-d33922bb14a8',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - PriorAuthorizationDiagnosticImagingResponse',
        displayName: 'Provider Inquiry - PriorAuthorizationDiagnosticImagingResponse',
        formId: 'C-2019418',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:c1abde4a-61bd-4f6a-8c7f-a97aa163a833',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - PurgedClaim',
        displayName: 'Provider Inquiry - PurgedClaim',
        formId: 'C-2019419',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:112627a7-3746-428d-bcf5-2a7d7b4e368e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - UnchangedProcessing',
        displayName: 'Provider Inquiry - UnchangedProcessing',
        formId: 'C-2019420',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:35a25039-426e-42ec-a0e9-688ec4fd34ce',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - UnableToDetermineRequest',
        displayName: 'Provider Inquiry - UnableToDetermineRequest',
        formId: 'C-2019421',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:495425c8-acb0-4be7-9d67-120477e6578f',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Provider Inquiry - TEFRAOBRA',
        displayName: 'Provider Inquiry - TEFRAOBRA',
        formId: 'C-2019422',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:098164c2-dfe0-44e6-ab0d-932827dd323a',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: '',
        displayName: '',
        formId: 'B-2320908',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to respond to Provider inquires',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:3e9fe6a2-f4e0-4f7f-a1f1-97713b3dacf9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Inquiry Response',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - Manual AR Letter U304',
        displayName: 'WBCBS - Manual AR Letter U304',
        formId: 'C-2618786',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider letter mailed when the provider owes Wellmark as a result of an adjusted claim.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b3281d3b-7793-4121-aabf-c777cdb88d75',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Manual AR U304',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'WBCBS - Manual AR Letter',
        displayName: 'WBCBS - Manual AR Letter',
        formId: 'C-2618787',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Accounts Receivable letter to recoup funds from a Provider.',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:256965e9-7ef9-4521-b589-58b9c916c0fc',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Manual AR',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'Blue Card Medical Records Request Letter',
        displayName: 'Blue Card Medical Records Request Letter',
        formId: 'C-53177',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'This letter is used to request medical records',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a22fda58-ca71-4c91-b8e5-ea4951a6dc5a',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: [
          'SGACA',
          'SGGM',
          'SGGF',
          'Large Group',
          'Group Med Supp',
          'Indv MedSupp',
          'Indv U65 ACA',
          'Indv U65 GM',
          'Indv U65 GF',
          'Indv Medicare Adv',
          'FBHBP',
          'Other'
        ],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Blue Card Medical Records',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - ABA Therapy - Request for Basic Option Access Exception Letter',
        displayName: 'FEP - ABA Therapy - Request for Basic Option Access Exception Letter',
        formId: 'N-8620016',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Access exception request for ABA therapy on a Basic Option member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:1b6be2f7-1775-4693-80f3-239134fcd93b',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Benefits/Claims'],
        segment: ['FEP'],
        audience: ['Member (FEP)'],
        businessArea: 'Operations',
        type: 'ABA Therapy Basic Option Access Exception - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Active Duty Verification Letter',
        displayName: 'FEP - Active Duty Verification Letter',
        formId: 'N-8620017',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Request for the member to verify active duty dates',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a086afeb-6a66-4ea4-bef0-53110cab9560',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Coordination of Benefits/Other Insurance/Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Active Duty Verification - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Certification of Prior Health Coverage Letter',
        displayName: 'FEP - Certification of Prior Health Coverage Letter',
        formId: 'N-8620018',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Coverage verification letter',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:ad58371d-f28f-4d73-9b4d-f317f2527ff6',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Credible Coverage - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Oral Appliance - Request for Basic Option Access Exception Letter',
        displayName: 'FEP - Oral Appliance - Request for Basic Option Access Exception Letter',
        formId: 'N-8620019',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Access exception request for an oral applicance on a Basic Option member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:283bb0c7-a93b-4ce6-85a9-e379d5f4cbe9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Oral Appliance Access Exception - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Housing Premium Reply Letter',
        displayName: 'FEP Housing Premium Reply Letter',
        formId: 'B-8620020',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Request for premium information',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:c245e3f2-49af-44df-bb58-aeb66d8898f5',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FEP'],
        audience: ['Member (FEP)'],
        businessArea: 'Operations',
        type: 'Housing Premium Reply - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Manual AR for Member Paid Claim Letter',
        displayName: 'FEP - Manual AR for Member Paid Claim Letter',
        formId: 'N-8620021',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Recouping money from the member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:47dae95a-c988-47fe-9284-c9fa3077817b',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Pay Member Claim Manual AR - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Request for Medicare Info Letter',
        displayName: 'FEP - Request for Medicare Info Letter',
        formId: 'N-8620022',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Requesting a copy of the members Medicare card',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:6262ce5e-a135-4fd0-8636-ad1cf3474753',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims/Coordination of Benefits/Other Insurance'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Medicare Card Request - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Member Request for ID Card Letter',
        displayName: 'FEP Member Request for ID Card Letter',
        formId: 'B-8620023',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Member requesting an ID card with dependents names',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5e4c3d26-0fa0-41a6-b99e-f6671bdd17f4',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FEP'],
        audience: ['Member (FEP)'],
        businessArea: 'Operations',
        type: 'ID Card Request With Dependents Name - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - No pre-service appeal letter',
        displayName: 'FEP - No pre-service appeal letter',
        formId: 'N-8620024',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'A preservice review was denied and the provider is trying to appeal the denial',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:9999dad7-cd93-472c-87e6-4287cf9fc9fe',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'No Appeal Rights on a Pre-Service Review - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Oral Surgery Pre-Service Access Exception Letter',
        displayName: 'FEP - Oral Surgery Pre-Service Access Exception Letter',
        formId: 'N-8620025',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Pre-Service Access Exception request for oral surgery on a Basic Option member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:6ee9a710-ea39-4888-bf5c-37e524325619',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims/Benefits'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Oral Surgery Access Exception - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Oral Surgery Post-Service Access Exception Letter',
        displayName: 'FEP - Oral Surgery Post-Service Access Exception Letter',
        formId: 'N-8620026',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Post-Service Access Exception request for oral surgery on a Basic Option member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:d934d017-387d-460f-8988-88ef0ad5701c',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims/Benefits'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Oral Surgery Access Exception - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Policy Change - Required Contact Letter',
        displayName: 'FEP - Policy Change - Required Contact Letter',
        formId: 'N-8620027',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Policy has changed or termed. Confirmation of change is required from the member',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:eb341658-1d79-46d3-9ffe-01ccbbe75a0e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership/Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Retro Policy Change - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Required Contact Letter - Reverse Claims Payment',
        displayName: 'FEP - Required Contact Letter - Reverse Claims Payment',
        formId: 'C-8620028',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Policy has changed or termed. Confirmation of change is required from the member or claims will be recouped',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:e9e84125-980e-49ff-a267-60ed59ea53b9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership Claims'],
        segment: ['FEP'],
        audience: ['Member (FEP)'],
        businessArea: 'Operations',
        type: 'Retro Policy Change - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Inconsistent Address Letter',
        displayName: 'FEP - Inconsistent Address Letter',
        formId: 'N-8620029',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Mail has been returned with a new address label. Need confirmation of new address',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:1e6ff283-d817-47b3-84c8-b5192dd84de6',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Return Mail - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Request for Dependent Documentation Letter',
        displayName: 'FEP - Request for Dependent Documentation Letter',
        formId: 'N-8620030',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: "Parent who's not on the policy is requesting to have EOBs and payments mailed to them on children",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:5a73e18b-9965-4a6e-8bc5-e49f63cae0d4',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership/Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Spousal Liability - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Request for Dependent Documentation - Follow-up Letter',
        displayName: 'FEP - Request for Dependent Documentation - Follow-up Letter',
        formId: 'N-8620031',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: "Parent who's not on the policy is requesting to have EOBs and payments mailed to them on children, second request",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:b247063d-f6d9-478c-ae67-39cbf83de6dd',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership/Claims'],
        segment: ['FEP'],
        audience: ['Member (IFP, Group)'],
        businessArea: 'Operations',
        type: 'Spousal Liability - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Clean Claim Rejection Letter - Provider',
        displayName: 'FEP Clean Claim Rejection Letter - Provider',
        formId: 'B-8620032',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Claims that denied with a clean claim denial',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:e563781c-e708-432d-b017-ebea0ad6e50d',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Claim Denied with a Clean Claim Denial - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Claim Not Received Letter - Provider',
        displayName: 'FEP Claim Not Received Letter - Provider',
        formId: 'B-8620033',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider is inquirying about a claim we have not received',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a06aade8-c000-4de8-b481-4cb37fd64a33',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Claim Not Received  - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Claim Processing Letter - Provider',
        displayName: 'FEP Claim Processing Letter - Provider',
        formId: 'B-8620034',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider is asking for claim status',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:c7c95940-c144-4a27-9ed1-0f09d29d830c',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Claim Is Being Processed - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP CLaim Status Inquiry Letter - Provider',
        displayName: 'FEP CLaim Status Inquiry Letter - Provider',
        formId: 'B-8620035',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Duplicate inquiry',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:66696731-990f-4a17-a300-209c33f88c23',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'FEP Dupicate Inquiry  - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Claim MIssing Information - Provider Letter',
        displayName: 'FEP Claim MIssing Information - Provider Letter',
        formId: 'B-8620036',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Claim has denied for missing information',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:06678983-07cc-4e17-ba6e-75f2a4f27793',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Claim Is Missing Information - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Claim - No New Info - Provider Letter',
        displayName: 'FEP Claim - No New Info - Provider Letter',
        formId: 'B-8620037',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider submitted a corrected claim but there were no changes to the original claim',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:09711012-134d-4cf2-9be8-810f1ca89b04',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'No New Inforation on Corrected Claim - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP COB No Overpay Letter - Provider',
        displayName: 'FEP COB No Overpay Letter - Provider',
        formId: 'B-8620039',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Provider thinks we overpaid as the 2ndary insurance',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:4bd054bf-4f35-41b6-a065-d893a77b7388',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Coordination of Benefits/Other Insurance'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'COB Claim is Not Overpaid - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Provider Inquiry Response Letter',
        displayName: 'FEP Provider Inquiry Response Letter',
        formId: 'B-8620040',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Free format letter',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:a2fc55f5-6ff8-4fa0-b1d0-de8cb7f08d34',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Provider Free Format - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP EAPG Response Letter',
        displayName: 'FEP EAPG Response Letter',
        formId: 'B-8620041',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Explains EAPG processing',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:1e0f7920-8fb3-423d-9d20-cf5fd29977bf',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'EAPG Response - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP Wrong NPI Letter - Provider',
        displayName: 'FEP Wrong NPI Letter - Provider',
        formId: 'B-8620042',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: "NPI's on the claim do not crosswalk",
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:845f739f-852d-41c1-93fc-3cd6680a137e',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Wrong NPI - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Provider Member Inquiry Follow-up Letter',
        displayName: 'FEP - Provider Member Inquiry Follow-up Letter',
        formId: 'N-8620043',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: '3 attempts have been made to reach the member/provider',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:cd2e0d1d-8681-48b0-9183-24e55e7e27b9',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims/Benefits/Membership/COB'],
        segment: ['FEP'],
        audience: ['Provider'],
        businessArea: 'Operations',
        type: 'Medical Records Request - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'FEP - Member Response for Requested Information Letter',
        displayName: 'FEP - Member Response for Requested Information Letter',
        formId: 'B-8620044',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Cover letter for when members request information',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:59146b0a-46e8-4f03-b630-3a0ca0d1ac48',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Membership/Claims'],
        segment: ['FEP'],
        audience: ['Member'],
        businessArea: 'Operations',
        type: 'Medical Records Request - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      },
      {
        name: 'General MR Request Letter Claims - FEP',
        displayName: 'General MR Request Letter Claims - FEP',
        formId: 'C-9332',
        created: '2020-01-01T00:00:00+0000',
        lastUpdated: '2020-01-01T00:00:00+0000',
        description: 'Request of medical records',
        sourceSystemType: 'GMC',
        configuration: {
          template: 'WFD_DETAILS_NEEDED',
          job: 'JOB_DETAILS_NEEDED',
          templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
        },
        instances: [
          {
            id: 'gmctid:9cf4a1d6-d114-42ed-b526-3ef2e2868511',
            contentType: 'application/pdf'
          }
        ],
        templateDescriptionAvailable: true,
        subject: ['Claims'],
        segment: ['FEP'],
        audience: [''],
        businessArea: 'Claims',
        type: 'Medical Records Request - FEP',
        authorizations: {
          build: ['*'],
          release: ['*']
        },
        data: [],
        owners: [
          {
            name: 'Operations - Correspondence Owners',
            userId: 'operationsCorrespondence@wellmark.com'
          }
        ],
        mailroom: {
          returnEnvelope: false
        }
      }
    ] as Record<string, any>[];

    // add missing properties
    for (const ret of retList) {
      ret.DocumentType = ret.formId.startsWith('B-') ? 'letter' : 'form';
      ret.state = statusMock[Math.floor(Math.random() * 3)];
    }

    return retList;
  }

  @Get('/catalog/template/:id/description')
  getDescriptionById(@Param('id') id: string) {
    console.log('receive get description', id);
    return {
      id: 1,
      name: 'Attorney - Authorization Request (B-3320)',
      subject: ['Legal'],
      audience: ['Attorney'],
      marketSegment: ['U65GF', 'U65GM'],
      canUploadDocument: true,
      canShowLetterName: true,
      autoAttachedForms: [],
      jsonFormData: {
        name: 'B3320',
        label: 'B3320',
        data: {
          firstName: 'Homer',
          lastName: 'Simpson',
          addressLine1: '742 Evergreen Terrace',
          addressLine2: '',
          city: 'Springfield',
          state: 'IA',
          zip: 50312,
          member1: {
            isChecked: false,
            extendFields: ['Marge Simpson', '2020-03-02']
          },
          member2: {
            isChecked: false,
            extendFields: ['Lisa Simpson', '2020-03-02']
          },
          member3: {
            name: '',
            extendFields: ['Bart Simpson', '2020-03-02']
          }
        },
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'First Name'
            },
            lastName: { type: 'string' },
            addressLine1: { type: 'string' },
            addressLine2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string', enum: ['IA', 'SD'] },
            zip: { type: 'integer' },
            member1: {
              type: 'boolean',
              isCustom: true,
              extendFields: [
                {
                  name: 'Member Name',
                  type: 'input'
                },
                {
                  name: 'Effective Date',
                  type: 'date'
                }
              ]
            },
            member2: {
              type: 'boolean',
              isCustom: true,
              extendFields: [
                {
                  name: 'Member Name',
                  type: 'input'
                },
                {
                  name: 'Effective Date',
                  type: 'date'
                }
              ]
            },
            member3: {
              type: 'boolean',
              isCustom: true,
              extendFields: [
                {
                  name: 'Member Name',
                  type: 'input'
                },
                {
                  name: 'Effective Date',
                  type: 'date'
                }
              ]
            }
          }
        },
        uischema: {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/firstName',
              width: 50
            },
            {
              type: 'Control',
              scope: '#/properties/lastName',
              width: 50
            },
            {
              type: 'Control',
              scope: '#/properties/addressLine1',
              width: 50
            },
            {
              type: 'Control',
              scope: '#/properties/addressLine2',
              width: 50
            },
            { type: 'Control', scope: '#/properties/city', width: 50 },
            { type: 'Control', scope: '#/properties/state', width: 25 },
            { type: 'Control', scope: '#/properties/zip', width: 25 },
            {
              type: 'Label',
              text: 'Select dependents who need verification:',
              width: 100
            },
            {
              type: 'Control',
              scope: '#/properties/member1',
              width: 100
            },
            {
              type: 'Control',
              scope: '#/properties/member2',
              width: 100
            },
            {
              type: 'Control',
              scope: '#/properties/member3',
              width: 100
            }
          ]
        }
      }
    };
  }

  @HttpCode(200)
  @Post('/content/build')
  build(@Body() body: string) {
    console.log('receive build', JSON.stringify(body, null, '  '));
    return {
      sourceTemplate: {
        id: 'gmctid:610d58ad-aa25-409e-9135-12a7f48b95b3',
        version: 1,
        displayName: 'Test Doc',
        templateName: 'Manual Test 1',
        sourceSystemType: 'GMC',
        description: "A simple doc typically used to simply test the 'build txnl doc' op",
        metadata: {
          dispositions: ['test']
        }
      },
      inputData: {},
      item: {
        contentType: 'application/pdf',
        contentEncodingType: 'base64',
        content:
          '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TpI4IGfyqD/sHnFg1DmsnKxq/6YMrfL0puuMIQdjvkmOMdhBezobn4cvb091xdAV0ymZVA4Yf4m4jfyv32Sln9YmNzxaL11npYPSHrbGcTVNrZWtPrjpeM7ad1TP8tXr3GX+5nWlO/3nZoUvFE98kKv/X+c9/w/uZDF/CmVuZHN0cmVhbQplbmRvYmoKMTMgMCBvYmoKPDwKL1R5cGUvU3RydWN0RWxlbQovUy9Eb2N1bWVudAovUCAxMiAwIFIKPj4KZW5kb2JqCjE0IDAgb2JqCjw8Ci9CYXJjb2RlL0FydAovQ2hhcnQvQXJ0Ci9FbGVtZW50QXJlYS9EaXYKL0Zsb3dBcmVhL0FydAovRmxvd09iamVjdC9TcGFuCi9Gb3JtQXJlYS9BcnQKL0dseXBoQXJlYS9BcnQKL0ltYWdlL0ZpZ3VyZQovSW1wb3J0ZWRTZWN0aW9uL05vblN0cnVjdAovUGF0aE9iamVjdC9TcGFuCi9UZXh0T25DdXJ2ZS9BcnQKPj4KZW5kb2JqCjEyIDAgb2JqCjw8Ci9UeXBlL1N0cnVjdFRyZWVSb290Ci9LIDEzIDAgUgovUm9sZU1hcCAxNCAwIFIKPj4KZW5kb2JqCjE1IDAgb2JqCjw8Ci9UeXBlL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCi9MYW5nIChlbikKL1BhZ2VMYXlvdXQvT25lQ29sdW1uCi9WaWV3ZXJQcmVmZXJlbmNlcyA8PAovRGlzcGxheURvY1RpdGxlIHRydWUKPj4KL1N0cnVjdFRyZWVSb290IDEyIDAgUgovTWFya0luZm8gPDwKL01hcmtlZCB0cnVlCj4+Cj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFszIDAgUl0KPj4KZW5kb2JqCnhyZWYKMCAxNgowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDI5OTIgMDAwMDAgbg0KMDAwMDAwODc1MCAwMDAwMCBuDQowMDAwMDAyNjM2IDAwMDAwIG4NCjAwMDAwMDMwNDAgMDAwMDAgbg0KMDAwMDAwNDE3NCAwMDAwMCBuDQowMDAwMDAwMDE2IDAwMDAwIG4NCjAwMDAwMDI3OTMgMDAwMDAgbg0KMDAwMDAwMzI4NyAwMDAwMCBuDQowMDAwMDAzNDY0IDAwMDAwIG4NCjAwMDAwMDQ1NTIgMDAwMDAgbg0KMDAwMDAwNDcyOSAwMDAwMCBuDQowMDAwMDA4NTAwIDAwMDAwIG4NCjAwMDAwMDgyNDEgMDAwMDAgbg0KMDAwMDAwODMwMiAwMDAwMCBuDQowMDAwMDA4NTY5IDAwMDAwIG4NCnRyYWlsZXIKPDwKL1NpemUgMTYKL1Jvb3QgMTUgMCBSCi9JbmZvIDcgMCBSCi9JRCBbPGFhOWIzNmNlMDg4OWU4NDNiYTliMDJiNzdkNGVmNmY5PiA8YWE5YjM2Y2UwODg5ZTg0M2JhOWIwMmI3N2Q0ZWY2Zjk+XQo+PgpzdGFydHhyZWYKODgwNgolJUVPRgo=',
        id: ''
      },
      url:
        'https://digitalcommunication-dev.int.wellmark.com/connect/Download.axd?db=spool&id=c0b98bfd99654d4a9d6f8acc00298b51.PDF&size=9281&ext=.PDF',
      id: '6be2a9f9-27d7-4f5b-9761-471a07e06d38'
    };
  }

  @HttpCode(200)
  @Post('/queue/documentApproval/:name')
  documentApproval(@Param('name') name: string, @Body() body: Object) {
    console.log(`receive documentApproval with role ${name}, body ${body}`);
    return;
  }

  @HttpCode(200)
  @Get('/web-inquiry/:id')
  getWebInquiry(@Param('id') id: string, @Query('includeParentInquiries') includeParentInquiries: string, @Req() req: Request) {
    console.log(
      `receive web-inquiry get ${id}, includeParentInquiries ${includeParentInquiries}, authorization ${req.header('authorization')}`
    );
    return [
      {
        correspondenceNumber: 'string',
        xrefCorrespondenceNumber: 'string',
        modifiedDate: 'string',
        submissionDate: '2020-01-04T08:02:00+0000',
        contactName: 'string',
        typeOfInquiry: 'string',
        certificateNumber: 'string',
        wellmarkID: 'string',
        memberFirstName: 'memberFirstName',
        memberLastName: 'memberLastName',
        patientAccountNumber: 'string',
        memberPlanCode: 'string',
        groupNumber: 'string',
        groupName: 'string',
        billingUnit: 'string',
        patientRelation: 'string',
        patientDOB: 'string',
        patientFirstName: 'string',
        patientLastName: 'string',
        patientGender: 'string',
        taskEmail: 'string',
        iCN: 'string',
        sCCF: 'string',
        dateOfService: 'string',
        question:
          'Aenean ac ligula lacus. Proin sit amet viverra orci. Praesent scelerisque convallis pretium. Maecenas placerat venenatis dolor, et commodo augue euismod in. Cras molestie, felis quis tristique lobortis, turpis purus dapibus dolor.',
        response: 'string',
        status: 'string',
        submitterContactName: 'string',
        submitterPhone: 'string',
        submitterNPI: 'string',
        submitterProviderName: 'string',
        renderingProviderName: 'string',
        submitterProviderId: 'string',
        submitterProviderState: 'string',
        submitterProviderTaxId: 'string',
        submitterProviderZip: 'string',
        ownerFirstName: 'string',
        repeatReply: 'string',
        caseID: 'string',
        xrefCaseID: 'string',
        documents: {},
        statusDetails: {
          statusDetail: [
            {
              actionType: 'string',
              actionTakenOn: 'string',
              activityData: 'string',
              CSA: 'string'
            }
          ]
        },
        facetsIndicator: 'string',
        inquiryTypeCode: 'string',
        unreadIndicator: true
      },
      {
        correspondenceNumber: 'string',
        xrefCorrespondenceNumber: 'string',
        modifiedDate: 'string',
        submissionDate: '2020-01-05T07:45:00+0000',
        contactName: 'string',
        typeOfInquiry: 'string',
        certificateNumber: 'string',
        wellmarkID: 'string',
        memberFirstName: 'memberFirstName',
        memberLastName: 'memberLastName',
        patientAccountNumber: 'string',
        memberPlanCode: 'string',
        groupNumber: 'string',
        groupName: 'string',
        billingUnit: 'string',
        patientRelation: 'string',
        patientDOB: 'string',
        patientFirstName: 'string',
        patientLastName: 'string',
        patientGender: 'string',
        taskEmail: 'string',
        iCN: 'string',
        sCCF: 'string',
        dateOfService: 'string',
        question:
          'Donec eget ante varius, euismod diam quis, gravida felis. Integer fringilla libero in mauris ullamcorper accumsan. Suspendisse et quam consequat mi suscipit dignissim ut eu nulla. Sed hendrerit velit at mi aliquet, vitae dapibus enim scelerisque. Ut cursus vel leo nec sollicitudin. Vivamus congue ac mi sit amet sodales. Phasellus sollicitudin, enim ac dictum fringilla, lectus eros semper risus, malesuada congue diam velit sit amet est. Proin quis urna suscipit, iaculis libero non, dapibus sapien. Duis nec arcu pellentesque ligula blandit finibus. Pellentesque velit nunc, vulputate et urna nec, ullamcorper efficitur justo. Sed vitae nunc ut velit sodales.',
        response: 'string',
        status: 'string',
        submitterContactName: 'string',
        submitterPhone: 'string',
        submitterNPI: 'string',
        submitterProviderName: 'string',
        renderingProviderName: 'string',
        submitterProviderId: 'string',
        submitterProviderState: 'string',
        submitterProviderTaxId: 'string',
        submitterProviderZip: 'string',
        ownerFirstName: 'string',
        repeatReply: 'string',
        caseID: 'string',
        xrefCaseID: 'string',
        documents: {},
        statusDetails: {
          statusDetail: [
            {
              actionType: 'string',
              actionTakenOn: 'string',
              activityData: 'string',
              CSA: 'string'
            }
          ]
        },
        facetsIndicator: 'string',
        inquiryTypeCode: 'string',
        unreadIndicator: true
      }
    ];
  }

  @HttpCode(201)
  @Put('/web-inquiry/:id')
  patchWebInquiry(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    console.log(`receive web-inquiry patch authorization ${req.header('authorization')} ${id}, body`, body);
  }
}
