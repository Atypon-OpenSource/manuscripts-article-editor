"use strict";
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
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const errors_1 = require("../lib/errors");
const Collection_1 = require("../sync/Collection");
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
const collections_1 = require("./collections");
class Utilities {
    constructor(db) {
        this.init = (userID) => __awaiter(this, void 0, void 0, function* () {
            if (userID) {
                yield CollectionManager_1.default.createCollection({
                    collection: 'user',
                    channels: [
                        userID,
                        `${userID}-readwrite`,
                        // `${userProfileID}-readwrite`, // profile
                        `${userID}-projects`,
                        `${userID}-libraries`,
                        `${userID}-library-collections`, // library collections
                    ],
                    db: this.db,
                });
            }
            this.userCollection = CollectionManager_1.default.getCollection('user');
        });
        this.saveDependenciesForNew = (dependencies, collection) => __awaiter(this, void 0, void 0, function* () {
            const results = yield collection.bulkCreate(dependencies);
            const failures = results.filter(Collection_1.isBulkDocsError);
            if (failures.length) {
                throw new errors_1.BulkCreateError(failures);
            }
        });
        this.saveNewManuscript = (dependencies, containerID, manuscript, newProject) => __awaiter(this, void 0, void 0, function* () {
            if (newProject) {
                yield collections_1.createAndPushNewProject(newProject);
            }
            const collection = yield collections_1.createProjectCollection(this.db, containerID);
            yield this.saveDependenciesForNew(dependencies, collection);
            yield collection.create(manuscript, { containerID });
            return Promise.resolve(manuscript);
        });
        this.updateManuscriptTemplate = (dependencies, containerID, manuscript, updatedModels) => __awaiter(this, void 0, void 0, function* () {
            const collection = yield collections_1.createProjectCollection(this.db, containerID);
            // save the manuscript dependencies
            const results = yield collection.bulkCreate(dependencies);
            const failures = results.filter(Collection_1.isBulkDocsError);
            if (failures.length) {
                throw new errors_1.BulkCreateError(failures);
            }
            // save the updated models
            for (const model of updatedModels) {
                yield collection.save(model);
            }
            // save the manuscript
            yield collection.save(manuscript);
            return Promise.resolve(manuscript);
        });
        this.getUserTemplates = () => __awaiter(this, void 0, void 0, function* () {
            const userTemplates = [];
            const userTemplateModels = [];
            const promiseEverything = this.userCollection
                .find({
                objectType: manuscripts_json_schema_1.ObjectTypes.Project,
                templateContainer: true,
            })
                .exec()
                .then((docs) => docs.map((doc) => doc.toJSON()))
                .then((projects) => Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                const collection = new Collection_1.Collection({
                    collection: `project-${project._id}`,
                    channels: [`${project._id}-read`, `${project._id}-readwrite`],
                    db: this.db,
                });
                let retries = 0;
                while (retries <= 1) {
                    try {
                        yield collection.initialize(false);
                        yield collection.syncOnce('pull');
                        break;
                    }
                    catch (e) {
                        retries++;
                        console.error(e);
                    }
                }
                const templates = yield collection
                    .find({ objectType: manuscripts_json_schema_1.ObjectTypes.ManuscriptTemplate })
                    .exec()
                    .then((docs) => docs.map((doc) => doc.toJSON()));
                userTemplates.push(...templates);
                const models = yield collection
                    .find({
                    templateID: {
                        $in: templates.map((template) => template._id),
                    },
                })
                    .exec()
                    .then((docs) => docs.map((doc) => doc.toJSON()));
                userTemplateModels.push(...models);
                return;
            }))));
            yield promiseEverything;
            return { userTemplates, userTemplateModels };
        });
        this.createUser = (profile) => __awaiter(this, void 0, void 0, function* () {
            const userCollection = yield CollectionManager_1.default.createCollection({
                collection: 'user',
                channels: [],
                db: this.db,
            });
            yield userCollection.create(profile);
        });
        this.getAttachment = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            const attachment = yield this.collection.getAttachmentAsBlob(id, attachmentID);
            return attachment;
        });
        this.putAttachment = (id, attachment) => {
            return this.collection.putAttachment(id, attachment).then(() => undefined);
        };
        this.getInvitation = (invitingUserID, invitedEmail) => {
            return new Promise((resolve) => {
                const collection = this.userCollection;
                const sub = collection
                    .findOne({
                    objectType: manuscripts_json_schema_1.ObjectTypes.ContainerInvitation,
                    containerID: this.manuscriptID,
                    invitedUserEmail: invitedEmail,
                    invitingUserID,
                })
                    .$.subscribe((doc) => {
                    if (doc) {
                        sub.unsubscribe();
                        resolve(doc.toJSON());
                    }
                });
            });
        };
        this.getTools = () => {
            return {
                getInvitation: this.getInvitation,
                putAttachment: this.putAttachment,
                getAttachment: this.getAttachment,
                createUser: this.createUser,
                updateManuscriptTemplate: this.updateManuscriptTemplate,
                saveNewManuscript: this.saveNewManuscript,
            };
        };
        this.db = db;
    }
}
exports.default = Utilities;
//# sourceMappingURL=Utilities.js.map