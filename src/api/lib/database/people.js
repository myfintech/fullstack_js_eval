class PeopleRepository {
  constructor (db) {
    this.db = db
    this.table = 'people'
  }

  async insert (data) {
    const result = await this.db(this.table)
      .returning('*')
      .insert(data)

    return new Promise((res, reject) => res(result))
  }
}

module.exports = {
  PeopleRepository
}
