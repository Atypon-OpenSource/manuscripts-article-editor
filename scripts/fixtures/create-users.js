const axios = require('axios')
const uuid = require('uuid')
const config = require('../../src/config.ts')

const timestamp = () => Math.floor(Date.now() / 1000)

const users = [{
  allowsTracking: false,
  email: 'alice.foo@example.com',
  name: 'Alice Foo',
  password: '123123123'
}, {
  allowsTracking: false,
  email: 'bob.bar@example.com',
  name: 'Bob Bar',
  password: '123123123'
}]

const now = timestamp()

const createUser = user =>
  axios.post('http://localhost:3000/api/v1/registration/signup', user)

const createProject = (users) =>
  axios.post(`http://localhost:4985/${config.buckets.projects}/`, {
    _id: `MPProject:project-${uuid()}`,
    createdAt: now,
    objectType: 'MPProject',
    owners: users.map(user => `User_${user.email}`),
    sessionID: uuid(),
    title: 'Hi',
    updatedAt: now,
    viewers: [],
    writers: [],
  })

const run = async () => {
  try {
    await Promise.all(users.map(createUser))
    console.log('Created users')
  } catch (e) {
    console.error(e.message)
    console.error(e.response.data)
  }

  try {
    await createProject(users)
    console.log('Created project')
  } catch (e) {
    console.error(e.message)
    console.error(e.response.data)
  }
}

run()
  .then(() => {
    console.log('finished')
  })
  .catch(e => {
    console.error(e)
  })
