const moment = require("moment");

module.exports = database => {
  return {
    /**
     * Create address for a given person
     * @param {{personID:number, line1:string, line2:string, city:string, state:string, zip:string}} obj
     * @return Inserted row with id
     */
    create: async obj => {
      const insertResultArray = await database("addresses")
        .returning(["*"])
        .insert({
          person_id: obj.personID,
          line1: obj.line1,
          line2: obj.birthline2day,
          city: obj.city,
          state: obj.state,
          zip: obj.zip,
          updated_at: moment().toISOString()
        });

      return insertResultArray[0];
    },
    /**
     * Get all addresses for a given person
     * @param {{personID:number}} obj
     * @throws {InvalidArgument} Will throw if missing required arguments
     * @return Array of addresses
     */
    getAll: async obj => {
      if (!obj.personID) {
        const error = new Error("Missing personID");
        error.name = "InvalidArgument";
        throw error;
      }

      const addressArray = await database("addresses")
        .select()
        .whereNull("deleted_at")
        .where({
          person_id: obj.personID
        });
      return addressArray;
    },
    /**
     * Get specific address for a given person
     * @param {{ personID:number, addressID:number }} obj
     * @param {number} obj.personID Id of the person the address belongs to
     * @param {number} obj.addressID Requested address id
     * @throws {InvalidArgument} Will throw if missing required arguments
     * @throws {NotFound} Will throw error if nothing is found
     * @return Address with matching id and person_id
     */
    getByIdAndPeopleId: async obj => {
      if (!obj.personID) {
        const error = new Error("Missing personID");
        error.name = "InvalidArgument";
        throw error;
      }

      if (!obj.addressID) {
        const error = new Error("Missing addressID");
        error.name = "InvalidArgument";
        throw error;
      }

      const selectResultArray = await database("addresses")
        .select()
        .where({
          id: obj.addressID,
          person_id: obj.personID
        });

      if (selectResultArray.length === 0) {
        const error = new Error("Address not found");
        error.name = "NotFound";
        throw error;
      }

      return selectResultArray[0];
    },
    /**
     * Remove a given address. Soft deleted.
     * @param {{ personID:number, addressID:number }} obj
     * @param {number} obj.personID Id of the person the address belongs to
     * @param {number} obj.addressID Requested address id
     * @throws {InvalidArgument} Will throw if missing required arguments
     * @throws {NotFound} Will throw error if nothing is found
     * @return Returns boolean with isDeleted
     */
    remove: async obj => {
      if (!obj.personID) {
        const error = new Error("Missing personID");
        error.name = "InvalidArgument";
        throw error;
      }

      if (!obj.addressID) {
        const error = new Error("Missing addressID");
        error.name = "InvalidArgument";
        throw error;
      }

      const selectResultArray = await database("addresses")
        .select()
        .where({
          id: obj.addressID,
          person_id: obj.personID
        });

      if (selectResultArray.length === 0) {
        const error = new Error("Address not found");
        error.name = "NotFound";
        throw error;
      }

      const address = selectResultArray[0];

      const updateResultBoolean = await database("addresses")
        .where({
          id: address.id,
          person_id: address.person_id
        })
        .update({
          updated_at: moment().toISOString(),
          deleted_at: moment().toISOString()
        });

      return updateResultBoolean;
    }
  };
};
