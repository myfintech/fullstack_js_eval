const { shutdown } = require('./supertestServer')

after(async () => {
  await shutdown()
})
