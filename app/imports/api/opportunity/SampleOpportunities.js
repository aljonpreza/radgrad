import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { makeSampleInterest } from '/imports/api/interest/SampleInterests';
import { moment } from 'meteor/momentjs:moment';


/** @module SampleOpportunities */

/**
 * Creates an OpportunityType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated OpportunityType.
 */
export function makeSampleOpportunityType() {
  const name = 'Sample Opportunity Type';
  const slug = `OpportunityType-${moment().format('YYYY-MM-DD-HH:mm:ss.SSSSS')}`;
  const description = 'Sample Opportunity Type Description';
  return OpportunityTypes.define({ name, slug, description });
}

/**
 * Creates an Opportunity with a unique slug and returns its docID.
 * @param sponsor The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity.
 * Also creates a new OpportunityType.
 * @returns { String } The docID for the newly generated Opportunity.
 */
export function makeSampleOpportunity(sponsor) {
  const name = 'Sample Opportunity';
  const slug = `Opportunity-${moment().format('YYYY-MM-DD-HH:mm:ss.SSSSS')}`;
  const description = 'Sample Opportunity Description';
  const opportunityType = makeSampleOpportunityType();
  const interests = [makeSampleInterest()];
  const startActive = moment('2015-01-12').toDate();
  const endActive = moment('2015-02-12').toDate();
  const ice = { i: 10, c: 0, e: 10 };
  return Opportunities.define({ name, slug, description, opportunityType, sponsor, interests, startActive,
    endActive, ice });
}

/**
 * Creates an OpportunityInstance with a unique slug and returns its docID.
 * @param student The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity.
 * @param sponsor The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity.
 * Implicitly creates an Opportunity and an OpportunityType.
 */
export function makeSampleOpportunityInstance(student, sponsor) {
  const semester = Semesters.define({ term: Semesters.SPRING, year: 2015 });
  const opportunity = makeSampleOpportunity(sponsor);
  const verified = false;
  return OpportunityInstances.define({ semester, opportunity, verified, student });
}
