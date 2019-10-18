module.exports = database => {
  return {
    /**
     * Insert person into people table
     * @param {{first_name: string,
     * last_name:string, birthday:string, company:string, title:string}} obj
     * @return {Promise} Inserted row with id
     */
    create: async obj => {
      const insertResultArray = await database("people")
        .returning(["*"])
        .insert({
          first_name: obj.first_name,
          last_name: obj.last_name,
          birthday: obj.birthday,
          company: obj.company,
          title: obj.title
        });

      return insertResultArray[0];
    },
    /**
     * Get all people
     * @param {Object} params
     * @returns {Promise} Array of people
     */
    getAll: async params => database("people").whereNull("deleted_at"),
    /**
     * Get specific person by id
     * @param {{ personID:number }} obj
     * @throws {InvalidArgument} Will throw if missing required arguments
     * @throws {NotFound} Will throw error if nothing is found
     * @return Person with id matching
     */
    getById: async obj => {
      if (!obj.personID) {
        const error = new Error("Missing personID");
        error.name = "InvalidArgument";
        throw error;
      }

      const selectResultArray = await database("people")
        .select()
        .where({
          id: obj.personID
        });

      if (selectResultArray.length === 0) {
        const error = new Error("Person not found");
        error.name = "NotFound";
        throw error;
      }

      return selectResultArray[0];
    }
  };
};
