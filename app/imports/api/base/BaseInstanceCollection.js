import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';

/** @module BaseInstance */

/**
 * BaseInstanceCollection is an abstract superclass for use by entities that have a slug.
 * It provides an API where the user can provide either a slug or docID (or document-specifying object).
 * Note it does not define a constructor; subclasses should invoke super(type, schema) to get the
 * BaseCollection constructor.
 * @extends module:Base~BaseCollection
 */
class BaseInstanceCollection extends BaseCollection {

  /**
   * Returns the docID associated with instance, or throws an error if it cannot be found.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * @param { String } instance Either a valid docID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  getID(instance) {
    return (this._collection.findOne({ _id: instance })) ? instance : this.findIdBySlug(instance);
  }

  /**
   * Returns the docIDs associated with instances, or throws an error if any cannot be found.
   * If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.
   * @param { String[] } instances An array of valid docIDs, slugs, or a combination.
   * @returns { String[] } The docIDs associated with instances.
   * @throws { Meteor.Error } If any instance is not a docID or a slug.
   */
  getIDs(instances) {
    return instances.map((instance) => this.getID(instance));
  }


  /**
   * Removes the passed instance from its collection.
   * Also removes the associated Slug.
   * Note that prior to calling this method, the subclass should do additional checks to see if any dependent
   * objects have been deleted.
   * @param { String } instance A docID or slug representing the instance.
   * @throws { Meteor.Error} If the instance (and its associated slug) cannot be found.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    const doc = super.findDoc(docID);
    check(doc, Object);
    const slugDoc = Slugs.findDoc(doc.slugID);
    check(slugDoc, Object);
    super.removeIt(doc);
    Slugs.removeIt(slugDoc);
  }

  /**
   * Return true if instance is a docID or a slug for this entity.
   * @param { String } instance A docID or a slug.
   * @returns {boolean} True if instance is a docID or slug for this entity.
   */
  isDefined(instance) {
    return (super.isDefined(instance) || this.hasSlug(instance));
  }

  /**
   * Returns true if the passed slug is associated with an entity of this type.
   * @param { String } slug Either the name of a slug or a slugID.
   * @returns {boolean} True if the slug is in this collection.
   */
  hasSlug(slug) {
    return (!!(this._collection.findOne({ slug })) || Slugs.isSlugForEntity(slug, this._type));
  }

  /**
   * Return the docID of the instance associated with this slug.
   * @param { String } slug The slug (string or docID).
   * @returns { String } The docID.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  findIdBySlug(slug) {
    return Slugs.getEntityID(slug, this._type);
  }

  /**
   * Returns a list of docIDs associated with the instances associated with the list of slugs.
   * @param { Array } slugs A list or collection of slugs.
   * @return { Array } A list of docIDs.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  findIdsBySlugs(slugs) {
    return slugs.map(slug => this.findIdBySlug(slug));
  }

  /**
   * Returns the instance associated with the passed slug.
   * @param { String } slug The slug (string or docID).
   * @returns { Object } The document representing the instance.
   * @throws { Meteor.Error } If the slug cannot be found, or is not associated with an instance in this collection.
   */
  findDocBySlug(slug) {
    return this.findDoc(this.findIdBySlug(slug));
  }

  /**
   * Returns the slug name associated with this docID.
   * @param docID The docID
   * @returns { String } The slug name
   * @throws { Meteor.Error } If docID is not associated with this entity.
   */
  findSlugByID(docID) {
    this.assertDefined(docID);
    return Slugs.findDoc(this.findDoc(docID).slugID).name;
  }
}

/**
 * Provide this class for use by instance collections such as Interest.
 */
export default BaseInstanceCollection;
