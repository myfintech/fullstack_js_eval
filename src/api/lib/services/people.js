class PeopleService {
  constructor (repo) {
    this.repo = repo
  }

  async insert (data) {
    const result = await this.repo.insert(data)
    return new Promise((res, reject) => res(result))
  }
}

module.exports = {
  PeopleService
}
