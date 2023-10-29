import { Font } from "pdf-lib/cjs/types/fontkit";

export const generateAdditionalTerms = (additionalTerms: string[]) => {
  return `
      <html>
    <head>
      <title>Additional Terms</title>
      <style>
          main {
              padding: 24px;
          }
  
        .top {
          text-align: center;
          padding: 16px;
        }
  
        h1 {
          font-size: 1.5rem;
          margin: 20px;
        }

        .terms-list {
            margin: 20px;
        }

        li {
            margin: 20px 0;
        }

        ol > li::marker {
            font-weight: bold;
        }
      </style>
    </head>
    <body>
      <main>
        <div class="top">
          <h1>ADDITIONAL TERMS TO THE RESIDENTIAL TENANCY AGREEMENT
              (STANDARD FORM OF LEASE)</h1>
          <p style="font-style: italic;">Made and agreed to pursuant to section 15 of the Residential Tenancy Agreement (Standard Form of
              Lease) and section 241.1, 3(i) of the Residential Tenancies Act, 2006, (RTA) as amended.</p>
        </div>
        <ol class="terms-list">
        ${additionalTerms
          .map((term) => {
            return `<li>${term}</li>`;
          })
          .join("")}
        </ol>
      </main>
    </body>
  </html>`;
};

export const temp_clauses = [
  "The Landlord and Tenant acknowledge and agree that where this agreement is entered into prior to completion of construction of the residential complex and where possession of the Rented Premises is delayed for any reason, including but not limited to an over-holding tenant or delays with respect to construction, renovation, or preparation of the Rented Premises for occupation by the Tenant, such that the Landlord is unable to offer vacant possession of the Rented Premises to the Tenant on the commencement date of the Tenancy as identified in section 4 of the Standard Lease, then the Landlord shall offer vacant possession of the Rented Premises to the Tenant on the first date the Landlord is lawfully able to. Any delay in the Landlord offering possession of the Rented Premises to the Tenant shall not affect the validity of this Agreement and shall not change or extend the term of the tenancy, but except where circumstances otherwise provided for in the applicable Pre-Leasing Agreement apply, the Tenant’s rent will abate until the date that the Landlord offers the Tenant vacant possession of the Rented Premises. The Landlord shall not be subject to any other liability to the Tenant with respect to delayed possession of the Rented Premises except for the abatement of rent described in this Clause or except in circumstances provided for in the Pre-leasing agreement.",
  "Rent paid by any person other than the Tenant is deemed to have been paid on behalf of the Tenant. Rent payments shall be made only in a manner agreed to as set out in Section 5(d) of the Standard Lease. Acceptance of other forms of payment by the Landlord at any time is not a waiver of this provision or of Section 5(d) of the Standard Lease, and shall not be deemed to be such a waiver.",
  "If the Tenant becomes bankrupt, the Landlord shall rank as a preferred creditor pursuant to the Bankruptcy and Insolvency Act in respect of arrears of rent for a period of three months immediately preceding the bankruptcy. If the Tenant becomes bankrupt, the balance of the term of this Agreement shall be terminated and the Tenant shall become a month-to-month Tenant subject to all of the terms and conditions of this Agreement, and subject to the rights of the Trustee. On the day following the date that the Tenant becomes bankrupt the Tenant’s obligation to pay rent shall immediately commence for the balance of the month in which the Tenant becomes bankrupt and, thereafter, rent shall be payable in advance on the first day of each month as provided for in section 5 of the Standard Lease.",
];

// You can access each clause using clauses[index], e.g., clauses[0] for the first clause.

export const signClause = `These Additional Terms are signed together with the Standard Lease, and by signing below the
Landlord and Tenant agree to be bound by all of the terms, conditions, covenants, agreements, and
provisions in the Standard Lease, Additional Terms, and Rental Application and acknowledge
receiving a copy of the signed Standard Lease, Additional Terms, Rental Application, Schedule A (
any applicable Rules and Regulations), Consent to Disclosure, the Pre-leasing Agreement if
applicable and additional schedules attached hereto, on behalf of all Tenants and Guarantor(s) if any.`;
