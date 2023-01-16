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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
class Api {
    constructor() {
        this.setToken = (token) => {
            this.instance = axios_1.default.create({
                baseURL: config_1.default.api.url,
                headers: Object.assign(Object.assign({}, config_1.default.api.headers), { Authorization: 'Bearer ' + token }),
            });
        };
        this.get = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.instance.get(url, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    data: {},
                });
                return result.data;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.post = (path, data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.instance.post(path, data);
                return result.data;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.delete = (url) => {
            return this.instance.delete(url);
        };
        this.options = (url) => {
            return this.instance.options(url);
        };
        this.put = (path, data) => {
            return this.instance.put(path, data);
        };
        this.getProject = (projectID) => {
            return this.post(`container/${projectID}/load`, { types: [] });
        };
        this.getProjectCollaborators = (projectID) => {
            return this.get(`project/${projectID}/collaborators`);
        };
        this.getUserProjects = () => {
            return this.get(`user/projects`);
        };
        this.getUser = () => {
            return this.get(`user`);
        };
        this.getProjectModels = (projectID, types = []) => {
            return this.post(`container/${projectID}/load`, { types });
        };
        this.deleteModel = (manuscriptID, modelID) => {
            return this.delete(`/project/:projectId/manuscripts/${manuscriptID}/model/${modelID}`);
        };
        this.deleteProject = (projectID) => {
            return this.delete(`project/${projectID}`); // not sure what exactly it sends over
        };
        this.addManuscript = (projectID, data) => {
            return this.post(`project/${projectID}`, data); // will it really return manuscript?
        };
        this.getManuscript = (containerID, manuscriptID) => this.post(`/container/${containerID}/${manuscriptID}/load`, {
            types: [],
        });
        this.getManuscriptModels = (containerID, manuscriptID, types) => this.post(`/container/${containerID}/${manuscriptID}/load`, {
            types,
        });
        this.getCollaborators = (containerID) => this.get(`/project/${containerID}/collaborators`);
        this.signUpAndGetToken = (username, password, name) => __awaiter(this, void 0, void 0, function* () {
            yield this.post('/registration/signup', {
                username,
                password,
                name,
            });
            const result = yield this.get('user');
            return result === null || result === void 0 ? void 0 : result.token;
        });
        this.saveProject = (projectId, models) => {
            return this.post(`project/${projectId}/save`, { data: models });
        };
        this.createProject = (title) => {
            return this.post('project', { title });
        };
        this.createNewManuscript = (projectID, manuscriptID, templateID = '' // not going to work for now. Needs to be allowed without templateID for dev purposes.
        ) => {
            if (!templateID) {
                templateID =
                    'MPManuscriptTemplate:www-zotero-org-styles-plos-one-PLOS-ONE-Journal-Publication';
                console.log("Applying development templateID as there was no real ID provided on new manuscript creation. This is because API doesn't allow no templateID but it used to be allowed on CouchDB");
            }
            return this.post(`container/projects/${projectID}/manuscript/${manuscriptID}`, {
                manuscriptID,
                templateID,
            });
        };
        this.saveProjectData = (projectID, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.post(`project/${projectID}/save`, {
                data,
            });
            return data;
        });
        this.saveManuscriptData = (projectID, manuscriptID, models) => __awaiter(this, void 0, void 0, function* () {
            // this method delete all the previous data from the project, including the project itself (!)
            // if no project model is present, the current project model will be delete and it will be impossible to load the manuscript anymore.
            yield this.post(`project/${projectID}/manuscripts/${manuscriptID}/save`, {
                data: models,
            });
        });
        this.createUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            // this is fiction - no such thing in the api
            return this.post('/user', { email, password });
        });
        // upsertManuscript = (
        //   projectId: string,
        //   manuscriptId: string,
        //   models: Model[]
        // ) => {
        //   return this.post(`project/${projectId}/save/${manuscriptId}`, models) // currently not supported by the api
        // }
        this.createSnapshot = (containerID, snapshot) => {
            return this.post(`snapshot/${containerID}/create`, snapshot);
        };
        this.instance = axios_1.default.create({
            baseURL: config_1.default.api.url,
            headers: config_1.default.api.headers,
        });
    }
}
exports.default = Api;
//# sourceMappingURL=Api.js.map