#!/usr/bin/env node

// tslint:disable:no-console

const ProgressBar = require('progress')

const axios = require('axios')

const waitFor = async (name, config) => {
  console.log(`Connecting to ${name} at ${config.url}`)

  const bar = new ProgressBar('[:bar]', { total: 30 })

  const timer = setInterval(() => {
    bar.tick()

    if (bar.complete) {
      clearInterval(timer)
      console.log(`\nCould not connect to ${name} at ${config.url}`)
      throw new Error()
    }
  }, 1000)

  do {
    try {
      const result = await axios(config)
      // TODO: check response for "not ready" vs "ready but error"
      clearInterval(timer)
      console.log(`\nConnected to ${name} at ${result.request.res.responseUrl}`)
      return
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } while (true)
}

const waitForCouchbase = () =>
  waitFor('Couchbase', {
    timeout: 1000,
    url: `http://${process.env.APP_COUCHBASE_HOSTNAME}:8091`,
  })

const waitForBuckets = async () => {
  const buckets = [
    process.env.APP_DERIVED_DATA_BUCKET,
    process.env.APP_DATA_BUCKET,
    process.env.APP_STATE_BUCKET,
    process.env.APP_USER_BUCKET,
  ]

  for (const bucket of buckets) {
    if (!bucket) {
      throw new Error('Undefined bucket')
    }

    await waitFor(`${bucket} bucket`, {
      auth: {
        password: process.env.APP_COUCHBASE_RBAC_PASSWORD,
        username: bucket,
      },
      timeout: 1000,
      url: `http://${
        process.env.APP_COUCHBASE_HOSTNAME
      }:8091/pools/default/buckets/${bucket}`,
    })
  }
}

const waitForServices = async () => {
  const buckets = [
    process.env.APP_DERIVED_DATA_BUCKET,
    process.env.APP_DATA_BUCKET,
    process.env.APP_STATE_BUCKET,
    process.env.APP_USER_BUCKET,
  ]

  for (const bucket of buckets) {
    await waitFor(`${bucket} bucket N1QL service`, {
      auth: {
        password: process.env.APP_COUCHBASE_ADMIN_PASS,
        username: process.env.APP_COUCHBASE_ADMIN_USER,
      },
      params: {
        statement: `SELECT _id FROM \`${bucket}\` USE KEYS ["_id"] LIMIT 1`,
      },
      timeout: 1000,
      url: `http://${process.env.APP_COUCHBASE_HOSTNAME}:8093/query/service`,
    })
  }
}

const waitForSyncGateway = async () =>
  waitFor('Sync Gateway', {
    timeout: 1000,
    url: `http://${process.env.APP_GATEWAY_HOSTNAME}:4985`,
  })

waitForCouchbase()
  .then(waitForBuckets)
  .then(waitForServices)
  .then(waitForSyncGateway)
  .then(() => {
    console.log('ready')
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
