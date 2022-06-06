# manuscripts-article-editor

This repository contains the editor package of Manuscripts app to be used in a react application.

## Dependencies

Manuscripts is highly modular: it is composed out of a series of NPM published modules following a few different themes.

### Data model

- [@manuscripts/manuscripts-json-schema](https://www.npmjs.com/package/@manuscripts/manuscripts-json-schema) (source code at [gitlab.com/mpapp-public/manuscripts-json-schema](https://gitlab.com/mpapp-public/manuscripts-json-schema)): a JSON schema describing the application's data model used in this and other manuscripts.io based applications, plus browser, Node.js and [Couchbase Sync Gateway](https://github.com/couchbase/sync_gateway) executable validator functions.
- [@manuscripts/manuscripts-json-schema-utils](https://www.npmjs.com/package/@manuscripts/manuscripts-json-schema-utils) (source at [gitlab.com/mpapp-public/manuscripts-json-schema-utils/](https://gitlab.com/mpapp-public/manuscripts-json-schema-utils/)): a set of utility functions for working with [Manuscripts JSON schema](https://gitlab.com/mpapp-public/manuscripts-json-schema) formatted data.

### Data synchronisation

- [@manuscripts/manuscripts-sync](https://www.npmjs.com/package/@manuscripts/manuscripts-sync) (source at [gitlab.com/mpapp-public/manuscripts-sync/](https://gitlab.com/mpapp-public/manuscripts-sync)): this repository contains a build script, a Dockerfile, and a [sync function definition](https://docs.couchbase.com/sync-gateway/current/sync-function-api.html) and associated tests for a [Couchbase Sync Gateway](https://github.com/couchbase/sync_gateway) instance configured to act as a realtime synchronisation backend, from the frontend application interacted with using [RxDB](https://github.com/pubkey/rxdb) / [PouchDB](https://pouchdb.com). The Sync Gateway used is currently a mildly forked version tracking the stable versions of Sync Gateway.
- [@manuscripts/sync-client](https://www.npmjs.com/package/@manuscripts/sync-client) (source at [gitlab.com/mpapp-public/manuscripts-sync-client](https://gitlab.com/mpapp-public/manuscripts-sync-client)): client-side business logic for merging Manuscripts data model revisions: implementations of conflict detection and merging strategies relevant for different model types in the [schema](https://gitlab.com/mpapp-public/manuscripts-json-schema).

### Editor components

- [@manuscripts/manuscript-editor](https://www.npmjs.com/package/@manuscripts/manuscript-editor) (source at [gitlab.com/mpapp-public/manuscripts-manuscript-editor](https://gitlab.com/mpapp-public/manuscripts-manuscript-editor)): the article body editor as a React component – this is where the great majority of this frontend application's logic is actually found from.
- [@manuscripts/title-editor](https://www.npmjs.com/package/@manuscripts/title-editor) (source at [gitlab.com/mpapp-public/manuscripts-title-editor](https://gitlab.com/mpapp-public/manuscripts-title-editor): a React editor component for headings, titles and other title-like short stretches of text. In practice, the title editor component is mostly a [ProseMirror schema](https://prosemirror.net/examples/schema/).
- [@manuscripts/comment-editor](https://www.npmjs.com/package/@manuscripts/comment-editor) (source at [gitlab.com/mpapp-public/manuscripts-comment-editor](https://gitlab.com/mpapp-public/manuscripts-comment-editor)): a React editor component for editing and viewing manuscript comments. Like the title editor component, the abstract editor is mostly a wrapper for a [ProseMirror schema](https://prosemirror.net/examples/schema/).
- [@manuscripts/abstract-editor](https://www.npmjs.com/package/@manuscripts/abstract-editor) (source at [gitlab.com/mpapp-public/manuscripts-abstract-editor](https://gitlab.com/mpapp-public/manuscripts-abstract-editor)): a React editor component for editing and viewing abstracts. Like the title editor component, the abstract editor is mostly a wrapper for a [ProseMirror schema](https://prosemirror.net/examples/schema/).

### [ProseMirror](https://prosemirror.net) specifics

- [@manuscripts/prosemirror-recreate-steps](https://www.npmjs.com/package/@manuscripts/prosemirror-recreate-steps) (source at [gitlab.com/mpapp-public/prosemirror-recreate-steps](https://gitlab.com/mpapp-public/prosemirror-recreate-steps)): an extension to the [ProseMirror](https://prosemirror.net) word processing library that the Manuscripts editor is based on, used to find and merge changes between two documents without access to the precise history of steps.
- [@manuscripts/manuscript-transform](https://www.npmjs.com/package/@manuscripts/manuscript-transform) (source at [gitlab.com/mpapp-public/manuscripts-manuscript-transform](https://gitlab.com/mpapp-public/manuscripts-manuscript-transform): the definition of the ProseMirror schema used by `@manuscripts/manuscript-editor`, plus modules for converting to and from the Manuscripts data model and exporting to HTML or JATS XML.

### Export

- [@manuscripts/sachs](https://www.npmjs.com/package/@manuscripts/sachs) (source at [gitlab.com/mpapp-public/sachs](https://gitlab.com/mpapp-public/sachs)): command-line utility for Manuscripts format conversion, used by the [Pressroom](https://gitlab.com/mpapp-public/pressroom) web service, in particular at the time of writing, JATS XML conversions. A thin wrapper for the actual conversion code in `@manuscripts/manuscript-transform`.
- [Pressroom](https://gitlab.com/mpapp-public/pressroom): a web service for importing and exporting Manuscripts formatted data, wrapping `sachs` and other open source document transformation tools and libraries into a REST web service. Source at [gitlab.com/mpapp-public/pressroom](https://gitlab.com/mpapp-public/pressroom), documentation at [pressroom.manuscripts.io/v1/docs?html](https://pressroom.manuscripts.io/v1/docs?html).

### Reusable UI components

- [@manuscripts/style-guide](https://www.npmjs.com/package/@manuscripts/style-guide) (source at [gitlab.com/mpapp-public/manuscripts-style-guide](https://gitlab.com/mpapp-public/manuscripts-style-guide)): a set of reusable UI controls and theme definitions used by this application and other Manuscripts based applications.
- [@manuscripts/resizer](https://www.npmjs.com/package/@manuscripts/resizer) (source at [gitlab.com/mpapp-public/manuscripts-resizer](https://gitlab.com/mpapp-public/manuscripts-resizer)): a React component providing a resize handle for panels, based on an [AtlasKit](https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/navigation/) component.
- [@manuscripts/assets](https://www.npmjs.com/package/@manuscripts/assets) (source at [gitlab.com/mpapp-private/manuscripts-gfx-assets/](https://gitlab.com/mpapp-private/manuscripts-gfx-assets/)): shared graphical assets used across Manuscripts projects in bitmap image, SVG and PDF vector form as well as React components built into the NPM package, based on [Sketch](https://sketch.com) originals.

### Datasets

- [@manuscripts/data](https://www.npmjs.com/package/@manuscripts/data) (source at [gitlab.com/mpapp-public/manuscripts-data](https://www.npmjs.com/package/@manuscripts/data)): source data such as document templates for use by Manuscripts client applications, plus scripts for building and deploying the data to npm.
- [@manuscripts/examples](https://www.npmjs.com/package/@manuscripts/examples) (source at [gitlab.com/mpapp-public/manuscripts-examples](https://gitlab.com/mpapp-public/manuscripts-examples)): example Manuscripts documents for reference and test purposes.

### Utilities

- [@manuscripts/eslint-config](https://www.npmjs.com/package/@manuscripts/eslint-config) (source at [gitlab.com/mpapp-public/manuscripts-eslint-config](https://gitlab.com/mpapp-public/manuscripts-eslint-config)): as the name suggests, the ESLint configuration used by other Manuscripts TypeScript repositories.
- [@manuscripts/publish](https://www.npmjs.com/package/@manuscripts/publish) (source at [gitlab.com/mpapp-public/manuscripts-publish](https://gitlab.com/mpapp-public/manuscripts-publish)): a command-line utility to assist publishing other Manuscripts NPM packages to an NPM registry (publishes a package if the current version hasn't already been published).

## Installation

Run `yarn install @manuscripts/article-editor` in your application.

## Build (for production)

The variables listed in `.env.example` must all be defined as environment variables in your project.

Run `yarn build` to build the app to the `dist` folder.

Deploy the files to S3 with `scripts/deploy.sh`.

## Running the client in development mode

1. `cp .env.example .env`. The variables listed in `.env.example` have appropriate default values for running in a mode where the backend API server is running locally (this is optional, and you can complete local development tasks in the absence of the backend services). See steps below under "Running the backend API in Docker" for steps to launch the API server locally.
2. Run `docker volume create --name=yarn-cache` to create a yarn cache for the backend services that you will launch in the next step. This step is only needed once.
3. `docker-compose up jupyter` to start the services needed for development.
4. `yarn start` to start the app in development mode (using `webpack-dev-server` and `react-hot-loader`).
5. To avoid signing up an account, open `http://localhost:8080/developer` to create a dummy user profile. Now you're good to go.

## Running the backend API in Docker

1. Add any environment variables needed for the API server in `docker/server/.env`.
1. `docker login registry.gitlab.com` to log in to GitLab’s Container Registry using your GitLab username and password (or a deploy token for read-only access to the registry images).
1. Run `docker-compose pull` to pull the latest server Docker images.
1. [first run] Initialize the backend services: `scripts/api/initialize.sh`. If running on Windows or MacOS, it may be necessary to increase the RAM allocated to Docker. (This can be done through Docker Desktop > Preferences > Resources > Advanced > Memory.)
1. [subsequent runs] Start the backend services: `docker-compose up api`
1. Run `docker-compose up jupyter` to start the additional services.
1. Open chrome://flags/#cookies-without-same-site-must-be-secure and set to Disabled.
1. Run `yarn start` to start the frontend.
1. Open Chrome, and enter `http://localhost:8080/signup` to create a user account. Confirmation emails generally won't be sent from a locally-running API, but you can ignore that message (see APP_SKIP_ACCOUNT_VERIFICATION in `docker/server/defaults.env`)
1. To stop the service, run `docker-compose down`. Add an optional `-v` flag to delete the data volumes.

## Running the Manuscripts stack in Kubernetes via Docker Desktop

1. Make sure `kubectl` is using the appropriate context:
   1. Run `kubectl config current-context` to show the current context.
   1. Run `kubectl config get-contexts` to list the available contexts.
   1. Run `kubectl config set-context docker-desktop` to set the context.
1. To build the client image, run `docker-compose build client`
1. To start the services, run `docker stack deploy --compose-file <(docker-compose config) manuscripts`
1. To stop the services, run `docker stack rm manuscripts`

## Template publishing

1. Make sure you are using the test environment. (@manuscripts/data fetch published templates from the test environment: https://gitlab.com/mpapp-public/manuscripts-data/-/blob/master/scripts/fetch-published-templates.js#L6)
2. Make sure you are logged in as a user who is allowed to publish templates (APP_COUCHBASE_ALLOWED_OWNERS)
   or you are using (have access to) one of the projects which is allowed to publish templates (APP_COUCHBASE_ALLOWED_PROJECTS).
3. Create a manuscript, edit the title (will be used as the template title), and specify requirements. Then publish the template (This can be done through Project menu > Publish Template).
4. Release new version of [manuscripts-data](https://gitlab.com/mpapp-public/manuscripts-data). (The build process will fetch published, user-generated template data from a manuscripts-api endpoint and adds it to the data published as @manuscripts/data)
5. Release new version of [manuscripts-requirements](https://gitlab.com/mpapp-public/manuscripts-requirements) after updating the @manuscripts/data dependency version. (Essential for the validation process and building the quality report.)
6. Upgrade [pressroom-js](https://gitlab.com/mpapp-public/pressroom-js) after updating @manuscripts/data and @manuscripts/requirements dependencies.
7. Update [fusion-kubernetes-env](https://gitlab.com/mpapp-private/fusion-kubernetes-env) with the new pressroom-js image tag.
8. Upgrade this repository dependencies (@manuscripts/data and @manuscripts/requirements).

## Testing

### Unit tests

Run `yarn test` to run the unit tests in Jest.

### Running tests with Cypress

1. Run `yarn run cypress:open` to launch the Cypress runner.
1. From the Cypress runner, select an individual test to run or select `Run all specs`

## Development

See the [`manuscripts-frontend` wiki](https://gitlab.com/mpapp-public/manuscripts-frontend/wikis/) for more information.

# Developing manuscripts-api

1. If needed, initialize the backend services: `scripts/api/initialize.sh`
1. Start the other backend services in Docker: `docker-compose up sync-gateway jupyter`
1. Start the API: `scripts/api/start-local.sh`

## Developing @manuscripts/style-guide

1. Clone [`@manuscripts/style-guide`](https://gitlab.com/mpapp-public/manuscripts-style-guide) to a folder alongside this one, run `yarn install` to install its dependencies, run `yarn link` to make it available as a local dependency, then run `yarn dev` in that folder to start building it.
1. In this folder, run `yarn link @manuscripts/style-guide` to use the linked module as a local dependency.

## Analysis

Run `yarn stats` to generate a `stats.json` file, then `yarn analyze` to open `webpack-bundle-analyzer`'s visualization of the webpack bundle.

## Configuration

The service is configured using environment variables, `.env.example` file placed at the root of the repository.

<dl>
  <dt>API_APPLICATION_ID</dt>
  <dd>The application ID acceptable by the server (manuscripts-api).</dd>

  <dt>API_BASE_URL</dt>
  <dd>The *server* app base URL (the manuscripts-api instance) corresponding to this service.</dd>

  <dt>BACKUP_REPLICATION_PATH</dt>
  <dd>Backup replication URL.</dd>

  <dt>BASE_URL</dt>
  <dd>The base URL of this service (the manuscripts-frontend instance).</dd>

  <dt>BEACON_HTTP_URL</dt>
  <dd>The URL of a service that tracks the user presence on a manuscript.</dd>

  <dt>BEACON_WS_URL</dt>
  <dd>The URL of WebSocket. Required for tracking users presence on a manuscript.</dd>

  <dt>COMMENTING</dt>
  <dd>If set to '1', enables commenting on a manuscript.</dd>

  <dt>DERIVED_DATA_BUCKET</dt>
  <dd>The name of a database bucket for derived data.</dd>

  <dt>DISABLE_ATTACH_CODE</dt>
  <dd>If set to '1', disables the ability to attach code with figure.</dd>

  <dt>DISCOURSE_HOST</dt>
  <dd>The base URL of the Discourse host (used to show updates).</dd>

  <dt>ENABLE_CONNECT_LOGIN_OPTION</dt>
  <dd>If set to '1', enables auth using connect.</dd>

  <dt>EXPORT_LITERATUM</dt>
  <dd>If set to '1', enables the ability to export manuscript as Literatum Digital Object.</dd>

  <dt>EXPORT_STS</dt>
  <dd>If set to '1', enables the ability to export manuscript as STS.</dd>

  <dt>EXPORT_TO_REVIEW</dt>
  <dd>If set to '1', show Submissions tab and enable submit to review option.</dd>

  <dt>EXTYLES_ARC_SECRET</dt>
  <dd>Secret used as part of pressroom request to import docx/doc via eXtyles Arc.</dd>

  <dt>FEATURE_FILE_MANAGEMENT</dt>
  <dd>If set to '1', enables the ability to manage files. Specially made for lean workflow purposes.</dd>

  <dt>FEATURE_HEADER_IMAGE</dt>
  <dd>If set to '1', enables the ability to manage header image, which is not a part of article body but can be used as a thumbnail or any other decorative element.</dd>

  <dt>FEATURE_FIGURE_ALIGNMENT</dt>
  <dd>If set to '1', enables the ability to provide metadata about how the figure has to be aligned in HTML or PDF or any other format.</dd>

  <dt>FEATURE_NODE_INSPECTOR</dt>
  <dd>If set to '1', enables the ability to manage individual nodes.</dd>

  <dt>FEATURE_DOI</dt>
  <dd>If set to '1', enables the ability to manage DOI of the article.</dd>

  <dt>FEATURE_RUNNING_TITLE</dt>
  <dd>If set to '1', enables the ability to manage article's running title.</dd>

  <dt>FEATURE_PRODUCTION_NOTES</dt>
  <dd>If set to '1', enables the ability to manipulate notes on a manuscript. Specially made for lean workflow purposes.</dd>

  <dt>FEATURE_PROJECT_MANAGEMENT</dt>
  <dd>If set to '1', provide project management tools to users. Allow users to tag and track the status of parts of a manuscript, and assign work to collaborators.</dd>

  <dt>FEATURE_QUALITY_CONTROL</dt>
  <dd>If set to '1', enables the ability to display quality reports. Specially made for lean workflow purposes.</dd>

  <dt>FEATURE_SWITCH_TEMPLATE</dt>
  <dd>If set to '1', enables the ability to change the manuscript's template.</dd>

  <dt>FOOTNOTES_ENABLED</dt>
  <dd>If set to '1', allow providing footnotes.</dd>

  <dt>FRONTMATTER_URI</dt>
  <dd>The URL of the login or about page (generated by manuscripts-io-www)</dd>

  <dt>IAM_BASE_URL</dt>
  <dd>The base URL of the IAM server. Used when auth using Connect.</dd>

  <dt>JUPYTER_URL</dt>
  <dd>The base URL of Jupyter notebook server.</dd>
  <dt>JUPYTER_TOKEN</dt>
  <dd>Token used to authenticate requests to Jupyter notebook server.</dd>

  <dt>LEAN_WORKFLOW</dt>
  <dd>If set to '1', enables lean workflow mode (This mode include some UI changes and load the manuscript differently so that it can be tracked).</dd>

  <dt>LEAN_WORKFLOW_MANAGER_URL</dt>
  <dd>The base URL of lean workflow server.</dd>

  <dt>LEAN_WORKFLOW_GRAPHQL_ENDPOINT</dt>
  <dd>The endPoint for the graphql.</dd>

  <dt>LOG_SYNC_EVENTS</dt>
  <dd>If set to '1', console log sync events.</dd>

  <dt>NATIVE</dt>
  <dd>If set to '1', the build of manuscripts-frontend is intended for the native (Mac) app</dd>

  <dt>PICKER_ORIGINS</dt>
  <dd>List of acceptable security origins where the Manuscripts document picker is presented at</dd>

  <dt>PRESSROOM_URL</dt>
  <dd>The base URL of pressroom service (used for importing/exporting).</dd>

  <dt>PRODUCTION</dt>
  <dd>If set to 0, include a "Develop" menu in the menu bar.</dd>

  <dt>PROJECTS_BUCKET</dt>
  <dd>The name of a database bucket for projects data.</dd>

  <dt>PUBLISH_TEMPLATES</dt>
  <dd>If set to '1', enables the ability to publish template.</dd>

  <dt>SERVICEWORKER_ENABLED</dt>
  <dd>When set to '1', application is built with its [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) enabled. Essential for offline support.</dd>

  <dt>SHACKLES_ENABLED</dt>
  <dd>If set to '1', enables the ability to show history (snapshots).</dd>

  <dt>SHACKLES_URL</dt>
  <dd>The base URL of shackles service (used to create/retrieve snapshots).</dd>

  <dt>SUPPORT_EMAIL</dt>
  <dd>The email address used to contact support.</dd>

  <dt>SUBMISSION_SERIES_CODE</dt>
  <dd>Required for export as a "Literatum bundle".</dd>

  <dt>SUBMISSION_GROUP_DOI</dt>
  <dd>Required for export as a "Literatum bundle".</dd>

  <dt>SUBMISSION_ID</dt>
  <dd>The ID of submission does exist in the lean workflow server. To be used for local development (to workaround the association between submission/manuscript to load manuscript properly) when lean workflow mode enabled.</dd>

  <dt>SYNC_GATEWAY_URL</dt>
  <dd>The base URL of Sync Gateway.</dd>

  <dt>ZOTERO_TRANSLATION_SERVER</dt>
  <dd>URL used as a citation search source.</dd>

  <dt>FEATURE_KEYWORDS_CATEGORIES</dt>
  <dd>Allow categories for the keywords.</dd>

  <dt>RXDB</dt>
  <dd>Enable RxDb Database.</dd>
</dl>
