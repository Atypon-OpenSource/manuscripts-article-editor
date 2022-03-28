"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStateFromSources = void 0;
function buildStateFromSources(...builders) {
    return new Promise((resolve, reject) => {
        let futureState = {};
        let i = 0;
        const next = (resultState) => {
            if (resultState) {
                futureState = Object.assign(Object.assign({}, futureState), resultState);
            }
            if (builders[++i]) {
                builders[i].build(futureState, next);
            }
            else {
                resolve(futureState);
            }
        };
        try {
            builders[i].build(futureState, next);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.buildStateFromSources = buildStateFromSources;
//# sourceMappingURL=buildStateFromSources.js.map