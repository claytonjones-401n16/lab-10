'use strict';

const mongoose = require('mongoose');

class Model {
  constructor(schema) {
    this.schema = schema;
  }

/**
 * Creates and saves a record to the database.
 *
 * @param {object} record - An object containing the record data to save
 * @return {object} The object created or an error object
 *
 * @example
 *
 *     create({record})
 */

  async create(record) {
    try {
      let recordToSave = new this.schema(record);
      let result = await recordToSave.save();
      return result;
    } catch(e) {
      return {status: 'Validation Error', message: 'Invalid Data Structure'}
    }
  }

/**
 * Returns single or all records from given collection
 *
 * @param {string} _id - The ID of the record you want to read. Omit if you want all records.
 * @return {object} The single record object, or an object containing the whole collection
 *
 * @example
 *
 *     read(87oe98658)
 */

  async read(_id) {
    try {
      if (_id) {
        let record = await this.schema.findOne({_id});
        if (!record) return {status: 'Error', message: "ID not found"}
        return record;
      } else {
        let records = await this.schema.find();
        return records;
      }
    } catch(e) {
      return {status: 'Error', message: "Invalid ID"};
    }
  }

/**
 * Returns records matching given query
 *
 * @param {object} query - The query that you want to search for in the DB
 * @return {object} The record(s) matching the query
 *
 * @example
 *
 *     readByQuery({name: Joe})
 */
  async readByQuery(query) {
    let records = await this.schema.find(query);
    return records;
}


/**
 * Updates a single record in a collection, and returns that object.
 *
 * @param {string, object} , An ID string of target record and object to replace it with
 * @return {object} The new updated record
 *
 * @example
 *
 *     update('ID', {record})
 */
  async update(_id, record) {
    try {
      await this.schema.findOneAndUpdate({_id}, record);
      let updatedRecord = await this.read(_id);
      return updatedRecord;
    } catch(e) {
      return {status: 'Error', message: 'Could not update record'}
    }
  }

/**
 * Deletes single record from a collection. Returns ID of record deleted.
 *
 * @param {string} _id - An ID string
 * @return {string} ID of deleted record
 *
 * @example
 *
 *     delete('ID')
 */

  async delete(_id) {
    try {
      await this.schema.deleteOne({_id});
      return _id;
    } catch(e) {
      return {status: 'Error', message: 'Could not delete item'}
    }
  }

  verifyToken(token) {
    return this.schema.verifyToken(token);
  }

}

module.exports = Model;