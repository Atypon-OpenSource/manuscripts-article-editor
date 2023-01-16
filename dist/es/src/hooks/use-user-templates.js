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
exports.useUserTemplates = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = require("react");
const DatabaseProvider_1 = require("../components/DatabaseProvider");
const Collection_1 = require("../sync/Collection");
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
const useUserTemplates = () => {
    const db = react_1.useContext(DatabaseProvider_1.DatabaseContext);
    const [userTemplates, setUserTemplates] = react_1.useState([]);
    const [userTemplateModels, setUserTemplateModels] = react_1.useState([]);
    const [isDone, setIsDone] = react_1.useState(false);
    react_1.useEffect(() => {
        const promiseEverything = CollectionManager_1.default.getCollection('user')
            .find({
            objectType: manuscripts_json_schema_1.ObjectTypes.Project,
            templateContainer: true,
        })
            .exec()
            .then((docs) => docs.map((doc) => doc.toJSON()))
            .then((projects) => Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
            const collection = new Collection_1.Collection({
                collection: `project-${project._id}`,
                channels: [`${project._id}-read`, `${project._id}-readwrite`],
                db,
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
            setUserTemplates(templates);
            const models = yield collection
                .find({
                templateID: {
                    $in: templates.map((template) => template._id),
                },
            })
                .exec()
                .then((docs) => docs.map((doc) => doc.toJSON()));
            setUserTemplateModels(models);
            return;
        }))));
        promiseEverything.then(() => setIsDone(true)).catch(() => setIsDone(true));
    }, [db]);
    return {
        userTemplates,
        userTemplateModels,
        isDone,
    };
};
exports.useUserTemplates = useUserTemplates;
//# sourceMappingURL=use-user-templates.js.map