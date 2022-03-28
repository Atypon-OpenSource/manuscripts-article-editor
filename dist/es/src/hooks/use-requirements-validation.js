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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequirementsValidation = void 0;
const react_1 = require("react");
const RequirementsInspector_1 = require("../components/requirements/RequirementsInspector");
const store_1 = require("../store");
const use_idle_prop_effect_1 = require("./use-idle-prop-effect");
const useRequirementsValidation = ({ state }) => {
    const [{ manuscript, modelMap }] = store_1.useStore((store) => ({
        manuscript: store.manuscript,
        modelMap: store.modelMap,
    }));
    const [error, setError] = react_1.useState();
    const [result, setResult] = react_1.useState([]);
    const prototypeID = manuscript.prototype;
    // TODO: re-enable once the quality report (RequirementsValidation) is saved
    // useEffect(() => {
    //   if (isPullComplete) {
    //     const subscription = collection
    //       .find({
    //         manuscriptID: manuscript._id,
    //         objectType: ObjectTypes.RequirementsValidation,
    //       })
    //       .$.subscribe((docs) => {
    //         setLoaded(true)
    //         if (!docs || !docs.length) {
    //           return
    //         }
    //         const doc = docs[0].toJSON() as RequirementsValidation
    //         setDoc(doc)
    //       })
    //     return () => {
    //       subscription.unsubscribe()
    //     }
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [project._id, isPullComplete, manuscript._id])
    use_idle_prop_effect_1.useIdlePropEffect(() => {
        RequirementsInspector_1.buildQualityCheck(modelMap, prototypeID, manuscript._id, {
            validateImageFiles: false,
        })
            .then(setResult)
            // Saving the report failed, we need to update the `RequirementsValidation` schema in order to fix the issue.
            // TODO: re-enable once we decide to save the quality report (RequirementsValidation).
            // .then((results) => {
            //   // make sure not to create multiple documents
            //   if (!loaded) {
            //     return
            //   }
            //   const nextDoc = doc
            //     ? {
            //         ...doc,
            //         results,
            //       }
            //     : buildValidation(results as RequirementsValidationData[])
            //   setError(null)
            //   return collection.save(nextDoc, {
            //     containerID: project._id,
            //     manuscriptID: manuscript._id,
            //   })
            // })
            .catch((err) => {
            setError(err);
        });
    }, [state], 1000);
    return { result, error };
};
exports.useRequirementsValidation = useRequirementsValidation;
//# sourceMappingURL=use-requirements-validation.js.map