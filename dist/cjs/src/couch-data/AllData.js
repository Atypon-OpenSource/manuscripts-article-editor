"use strict";
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const track_changes_1 = require("@manuscripts/track-changes"); // This type dependency seems to be out of order. That should be refactored
const authors_1 = require("../lib/authors");
const collaborators_1 = require("../lib/collaborators");
const data_1 = require("../lib/data");
const invitation_1 = require("../lib/invitation");
const CollectionEffects_1 = __importDefault(require("../sync/CollectionEffects"));
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
const syncEvents_1 = __importDefault(require("../sync/syncEvents"));
const Bibilo_1 = require("./Bibilo");
const db_1 = require("./db");
const ModelManager_1 = __importDefault(require("./ModelManager"));
const TokenData_1 = require("./TokenData");
const SUBSCRIPTION_TIMEOUT = 20000;
class RxDBDataBridge {
    constructor(props) {
        this.listeners = new Set();
        this.expectedState = [];
        this.initSyncStateStatus = () => {
            const accumulatableDispatch = (dispatch) => {
                let queue = [];
                return (action) => {
                    if (!queue.length) {
                        setTimeout(() => {
                            queue.reverse().forEach((action) => dispatch(action));
                            queue = [];
                            this.setState({
                                syncState: this.collectionListenerState,
                                dispatchSyncState: accumulatableDispatch(dispatch),
                            });
                        }, 20000);
                    }
                    queue.push(action);
                };
            };
            /* PROVIDING RESULT OF SYNC'ING STATUS  */
            this.collectionListenerState = {};
            const dispatch = (action) => {
                this.collectionListenerState = syncEvents_1.default(this.collectionListenerState, action);
            };
            const syncListenerDispatch = (action) => {
                CollectionEffects_1.default(dispatch)(action);
                dispatch(action);
            };
            CollectionManager_1.default.listen({
                getState: () => this.collectionListenerState,
                dispatch: syncListenerDispatch,
            });
        };
        this.getData = () => __awaiter(this, void 0, void 0, function* () {
            const modelTools = yield this.modelManager.getTools();
            const data = Object.assign(Object.assign({}, this.state), modelTools);
            return data; // hmmm....
        });
        this.setState = (arg) => {
            this.state =
                typeof arg === 'function' ? arg(this.state) : Object.assign(Object.assign({}, this.state), arg);
            const currentKeys = Object.keys(this.state);
            this.expectedState = this.expectedState.filter((key) => !currentKeys.includes(key));
            Object.keys(this.state).forEach((stateKey) => {
                const inExpectedIndex = this.expectedState.indexOf(stateKey);
                if (inExpectedIndex >= 0) {
                    this.expectedState.splice(inExpectedIndex);
                }
            });
            this.dispatch();
        };
        this.dispatch = () => {
            this.listeners.forEach((fn) => fn(this.state));
        };
        this.onUpdate = (fn) => {
            this.listeners.add(fn);
            return () => this.listeners.delete(fn);
        };
        this.omniHandler = (type) => {
            this.expect(type);
            return (doc) => __awaiter(this, void 0, void 0, function* () {
                if (doc) {
                    this.setState((state) => {
                        return Object.assign(Object.assign({}, state), { [type]: doc.toJSON() });
                    });
                }
            });
        };
        this.omniMapHandler = (type) => {
            this.expect(type);
            return (docs) => __awaiter(this, void 0, void 0, function* () {
                if (docs) {
                    const docsMap = new Map();
                    for (const doc of docs) {
                        docsMap.set(doc._id, doc.toJSON());
                    }
                    this.setState((state) => {
                        return Object.assign(Object.assign({}, state), { [type]: docsMap });
                    });
                }
            });
        };
        this.expect = (key) => {
            this.expectedState.push(key); // kinda relies on the state to be flat
        };
        this.omniArrayHandler = (type) => {
            this.expect(type);
            return (docs) => __awaiter(this, void 0, void 0, function* () {
                if (docs) {
                    this.setState((state) => (Object.assign(Object.assign({}, state), { [type]: docs.map((doc) => doc.toJSON()) })));
                }
            });
        };
        this.cc = (collectionName = `project-${this.projectID}`) => CollectionManager_1.default.getCollection(collectionName);
        this.dependsOnStateConditionOnce = (condition, dependant) => {
            const unsubscribe = this.onUpdate((state) => {
                const satisfied = condition(state);
                if (satisfied) {
                    unsubscribe();
                    const maybeSubscription = dependant(state);
                    if (maybeSubscription) {
                        this.rxSubscriptions.push(maybeSubscription);
                    }
                    // this maybe a problem as some of the data may not be updated on changes in the store
                }
            });
        };
        this.subscribe = (manuscriptID, containerID, userID) => {
            // @TODO move subs into a separate data class sort of thing
            this.rxSubscriptions = [
                // collect all of them and expose single unsubscribe facade
                this.cc()
                    .findOne(manuscriptID)
                    .$.subscribe(this.omniHandler('manuscript')),
                this.cc('user')
                    .findOne(containerID)
                    .$.subscribe(this.omniHandler('project')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.Tag,
                })
                    .$.subscribe(this.omniArrayHandler('tags')),
                this.cc('collaborators')
                    .find({
                    objectType: manuscripts_json_schema_1.ObjectTypes.UserCollaborator,
                })
                    .$.subscribe(this.omniMapHandler('collaborators')),
                this.cc()
                    .find({
                    containerID,
                })
                    .$.subscribe(this.omniMapHandler('projectModels')),
                this.cc()
                    .find({
                    objectType: manuscripts_json_schema_1.ObjectTypes.Library,
                })
                    .$.subscribe(this.omniMapHandler('library')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.ContainerInvitation,
                })
                    .$.subscribe(this.omniArrayHandler('containerInvitations')),
                this.cc()
                    .find({
                    objectType: manuscripts_json_schema_1.ObjectTypes.Library,
                })
                    .$.subscribe(this.omniMapHandler('globalLibraries')),
                this.cc()
                    .find({
                    manuscriptID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.ContributorRole,
                })
                    .$.subscribe(this.omniArrayHandler('contributorRoles')),
                this.cc()
                    .find({
                    manuscriptID,
                    $or: [
                        { objectType: manuscripts_json_schema_1.ObjectTypes.Contributor },
                        { objectType: manuscripts_json_schema_1.ObjectTypes.Affiliation },
                    ],
                })
                    .$.subscribe((docs) => {
                    if (!docs) {
                        return;
                    }
                    const models = docs.map((doc) => doc.toJSON());
                    this.setState({
                        authorsAndAffiliations: authors_1.buildAuthorsAndAffiliations(models),
                    });
                }),
                this.cc()
                    .find({
                    containerID,
                    manuscriptID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.CommentAnnotation,
                })
                    .$.subscribe(this.omniArrayHandler('comments')),
                this.cc()
                    .find({
                    containerID,
                    manuscriptID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.ManuscriptNote,
                })
                    .$.subscribe(this.omniArrayHandler('notes')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.ProjectInvitation,
                })
                    .$.subscribe(this.omniArrayHandler('invitations')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.Keyword,
                })
                    .$.subscribe(this.omniMapHandler('keywords')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.LibraryCollection,
                })
                    .$.subscribe(this.omniMapHandler('projectLibraryCollections')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.BibliographyItem,
                })
                    .$.subscribe(this.omniMapHandler('library')),
                this.cc()
                    .find({
                    containerID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.Manuscript,
                })
                    .$.subscribe((docs) => {
                    if (docs) {
                        this.setState((state) => (Object.assign(Object.assign({}, state), { manuscripts: docs.map((doc) => doc.toJSON()) })));
                    }
                    else {
                        this.setState({ manuscripts: [] });
                    }
                }),
                this.cc('user')
                    .find({
                    objectType: manuscripts_json_schema_1.ObjectTypes.Project,
                })
                    .$.subscribe(this.omniArrayHandler('projects')),
                this.cc()
                    .find({
                    manuscriptID,
                    objectType: { $eq: manuscripts_json_schema_1.ObjectTypes.StatusLabel },
                })
                    .$.subscribe(this.omniArrayHandler('statusLabels')),
            ];
            // subscribing for modelsMap
            this.cc()
                .find({
                $and: [
                    { containerID },
                    {
                        $or: [{ manuscriptID }, { manuscriptID: { $exists: false } }],
                    },
                ],
            })
                .$.subscribe((models) => __awaiter(this, void 0, void 0, function* () {
                const modelMap = yield manuscript_transform_1.buildModelMap(models);
                this.setState((state) => (Object.assign(Object.assign({}, state), { modelMap })));
            }));
            // subscribing for commits
            this.cc()
                .find({
                $and: [{ containerID }, { objectType: manuscripts_json_schema_1.ObjectTypes.Commit }],
            })
                .$.subscribe((docs) => {
                const commits = docs.map((doc) => {
                    const json = doc.toJSON();
                    return track_changes_1.commitFromJSON(json, manuscript_transform_1.schema);
                });
                return this.setState({
                    commits,
                });
            });
            // getting snapshots
            this.cc()
                .find({
                objectType: manuscripts_json_schema_1.ObjectTypes.Snapshot,
            })
                .$.subscribe((snapshots) => {
                this.setState({
                    snapshots: snapshots
                        .map((doc) => doc.toJSON())
                        .sort((a, b) => b.createdAt - a.createdAt),
                });
            });
            this.dependsOnStateConditionOnce((state) => state.user && state.collaborators, (state) => {
                this.setState({
                    collaboratorsProfiles: collaborators_1.buildCollaboratorProfiles(state.collaborators, state.user),
                    collaboratorsById: collaborators_1.buildCollaboratorProfiles(state.collaborators, state.user, '_id'),
                });
            });
            this.dependsOnStateConditionOnce((state) => state.invitations && state.containerInvitations, (state) => {
                this.setState({
                    projectInvitations: state.invitations,
                    invitations: invitation_1.buildInvitations(state.invitations, state.containerInvitations),
                });
            });
            this.dependsOnStateConditionOnce((state) => state.globalLibraries && state.globalLibraryCollections, (state) => {
                const channels = [
                    ...[
                        ...state.globalLibraries.keys(),
                        ...state.globalLibraryCollections.keys(),
                    ].map((id) => `${id}-read`),
                    `${containerID}-bibitems`,
                ];
                this.initCollection('libraryitems', channels)
                    .then((r) => {
                    this.cc('libraryitems')
                        .find({
                        objectType: manuscripts_json_schema_1.ObjectTypes.UserProject,
                    })
                        .$.subscribe(this.omniArrayHandler('userProjects'));
                })
                    .catch((e) => {
                    console.log(e);
                    return false;
                });
            });
            this.dependsOnStateConditionOnce((state) => state.library && state.manuscript, (state) => {
                this.cc();
                this.biblio = new Bibilo_1.Biblio(state.manuscript.bundle, state.library, this.cc(), state.manuscript.lang);
                this.setState({ biblio: this.biblio.getTools() });
            });
            if (userID) {
                const userSubs = [
                    this.cc('user')
                        .find({
                        objectType: manuscripts_json_schema_1.ObjectTypes.LibraryCollection,
                    })
                        .$.subscribe(this.omniMapHandler('globalLibraryCollections')),
                    this.cc('user')
                        .findOne({
                        userID,
                        objectType: manuscripts_json_schema_1.ObjectTypes.UserProfile,
                    })
                        .$.subscribe((doc) => __awaiter(this, void 0, void 0, function* () {
                        if (doc) {
                            const user = yield data_1.buildUser(doc);
                            this.setState((state) => {
                                return Object.assign(Object.assign({}, state), { user });
                            });
                        }
                    })),
                    this.cc('user')
                        .find({
                        objectType: manuscripts_json_schema_1.ObjectTypes.BibliographyItem,
                        containerID,
                    })
                        .$.subscribe(this.omniMapHandler('globalLibraryItems')),
                ];
                this.rxSubscriptions = [...this.rxSubscriptions, ...userSubs];
            }
            return {
                unsubscribe: () => this.rxSubscriptions.forEach((sub) => sub.unsubscribe()),
            };
        };
        this.tokenData = new TokenData_1.TokenData();
        const userData = this.tokenData.getTokenActions();
        this.state = {};
        this.projectID = props.projectID;
        this.userID = props.userID || (userData === null || userData === void 0 ? void 0 : userData.userID); // needs to be acquired from the token if no token - get user id provided from props (maybe)
        this.userProfileID = userData === null || userData === void 0 ? void 0 : userData.userProfileID; // needs to be acquired from the token if no token - get user id provided from props (maybe)
        this.manuscriptID = props.manuscriptID;
    }
    setDB(db) {
        this.db = db;
    }
    initCollection(collection, channels) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCollection = yield CollectionManager_1.default.createCollection({
                collection,
                channels,
                db: this.db,
            });
            return createdCollection;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield db_1.databaseCreator;
                this.setDB(db);
                yield this.initCollection(`project-${this.projectID}`, [
                    `${this.projectID}-read`,
                    `${this.projectID}-readwrite`,
                ]);
                // what to do when no user?
                // need to return an explicit warning about no user
                // maybe return an empty object so it will later fail on user presence check
                if (this.userID) {
                    yield this.initCollection('user', [
                        this.userID,
                        `${this.userID}-readwrite`,
                        `${this.userProfileID}-readwrite`,
                        `${this.userID}-projects`,
                        `${this.userID}-libraries`,
                        `${this.userID}-library-collections`, // library collections
                    ]);
                }
                yield this.initCollection(`collaborators`, [
                    `${this.projectID}-read`,
                    `${this.projectID}-readwrite`,
                ]);
                this.sub = this.subscribe(this.manuscriptID, this.projectID, this.userID);
                // need to init if received update at least once from all the collections
                this.setState({
                    deleteProject: (projectID) => __awaiter(this, void 0, void 0, function* () {
                        return this.cc('user').delete(projectID);
                    }),
                    updateProject: (projectID, data) => {
                        return this.cc('user').update(projectID, data);
                    },
                });
                this.dependsOnStateConditionOnce((state) => !!state.modelMap && state.snapshots && state.commits, () => {
                    this.modelManager = new ModelManager_1.default(this.state.modelMap, (modelMap) => {
                        this.setState({ modelMap });
                    }, this.manuscriptID, this.projectID, this.cc(), this.cc('user'), this.state.snapshots, this.state.commits, this.db);
                    this.dispatch();
                });
                this.initSyncStateStatus();
                return new Promise((resolve) => {
                    let resolved = false;
                    const unsubscribe = this.onUpdate(() => {
                        if (!this.expectedState.length &&
                            this.modelManager &&
                            this.state.biblio) {
                            /*
                              this is an optimisation
                              to wait for each subscription to kick in at least once,
                              so we won't give the main store an empty state and then cause
                              a lot of updates on the store by feeding in initial state piece by piece
                             */
                            unsubscribe();
                            resolve(this);
                            resolved = true;
                        }
                    });
                    // resolve anyway if takes too long
                    setTimeout(() => {
                        if (!resolved) {
                            console.warn('Not all couch subscriptions responded');
                            resolve(this);
                        }
                    }, SUBSCRIPTION_TIMEOUT);
                });
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    reload(manuscriptID, projectID, userID) {
        if (manuscriptID !== this.manuscriptID || projectID !== this.projectID) {
            this.sub.unsubscribe();
            this.state = {};
            this.projectID = projectID;
            this.manuscriptID = manuscriptID;
            this.userID = userID; // not sure
            return this.init();
            // if (projectID !== this.projectID) {
            //   this.collection = CollectionManager.getCollection<Manuscript>(
            //     `project-${projectID}`
            //   )
            // }
        }
    }
    destroy() {
        this.sub.unsubscribe();
    }
}
exports.default = RxDBDataBridge;
//# sourceMappingURL=AllData.js.map