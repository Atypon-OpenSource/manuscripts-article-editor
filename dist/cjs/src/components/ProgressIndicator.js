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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressIndicator = exports.InvalidIndicatorPropsError = exports.IndicatorSize = exports.IndicatorKind = void 0;
const assets_1 = require("@manuscripts/assets");
const react_1 = __importDefault(require("react"));
var IndicatorKind;
(function (IndicatorKind) {
    IndicatorKind[IndicatorKind["Author"] = 0] = "Author";
    IndicatorKind[IndicatorKind["ContributorDetail"] = 1] = "ContributorDetail";
    IndicatorKind[IndicatorKind["Contributors"] = 2] = "Contributors";
    IndicatorKind[IndicatorKind["Project"] = 3] = "Project";
    IndicatorKind[IndicatorKind["ReferenceLibrary"] = 4] = "ReferenceLibrary";
})(IndicatorKind = exports.IndicatorKind || (exports.IndicatorKind = {}));
// TODO: Actually provide small sizes in PaintCode project.
var IndicatorSize;
(function (IndicatorSize) {
    // Small,
    IndicatorSize[IndicatorSize["Large"] = 0] = "Large";
})(IndicatorSize = exports.IndicatorSize || (exports.IndicatorSize = {}));
class InvalidIndicatorPropsError extends Error {
    constructor(message, props) {
        super(message);
        this.props = props;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.InvalidIndicatorPropsError = InvalidIndicatorPropsError;
class ProgressIndicator extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
        };
        this.tickFunction = () => {
            this.setState({
                time: this.state.time + (this.props.timeIncrement || 0),
            });
        };
        if (props.progress && props.progress > 0 && !props.isDeterminate) {
            throw new InvalidIndicatorPropsError('progress > 0 for an indeterminate progress indicator', props);
        }
        this.canvasRef = react_1.default.createRef();
    }
    componentDidMount() {
        this.updateCanvas();
        if (this.props.timeIncrement) {
            this.tickHandle = setInterval(this.tickFunction, this.props.refreshRate);
        }
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    updateCanvas() {
        if (!this.canvasRef.current) {
            return;
        }
        assets_1.PlaceholderKit.clearCanvas(this.canvasRef.current);
        assets_1.PlaceholderKit.drawProgressIndication(this.canvasRef.current, this.state.time, this.props.progress || 0, this.props.isDeterminate || true);
        this.symbolDrawFunction()(this.canvasRef.current, this.state.time, this.props.symbolRotationMultiplier || 0, this.props.crossRotationMultiplier || 0);
    }
    componentWillUnmount() {
        if (this.tickHandle) {
            clearInterval(this.tickHandle);
        }
    }
    render() {
        // TODO: Actually handle the small size rendering in PaintCode.
        const dim = this.props.size === IndicatorSize.Large ? 375 : 100;
        return react_1.default.createElement("canvas", { ref: this.canvasRef, width: dim, height: dim });
    }
    symbolDrawFunction() {
        switch (this.props.symbols) {
            case IndicatorKind.Author:
                return assets_1.PlaceholderKit.drawAuthorSymbols;
            case IndicatorKind.ContributorDetail:
                return assets_1.PlaceholderKit.drawContributorDetailSymbols;
            case IndicatorKind.Contributors:
                return assets_1.PlaceholderKit.drawContributorSymbols;
            case IndicatorKind.Project:
                return assets_1.PlaceholderKit.drawProjectSymbols;
            case IndicatorKind.ReferenceLibrary:
                return assets_1.PlaceholderKit.drawReferenceLibrarySymbols;
            default:
                throw new InvalidIndicatorPropsError('Invalid key "symbols" in props', this.props);
        }
    }
}
exports.ProgressIndicator = ProgressIndicator;
ProgressIndicator.defaultProps = {
    progress: 0,
    size: IndicatorSize.Large,
    isDeterminate: false,
    timeIncrement: 0.001,
    symbolRotationMultiplier: 6.0,
    crossRotationMultiplier: 0.5,
    refreshRate: 25,
};
/*export class LargeDeterminateProjectsProgressIndicator extends ProgressIndicator {
  public static defaultProps = {
    progress: 0,
    size: IndicatorSize.Large,
    isDeterminate: false,
    timeIncrement: 0.001,
    symbolRotationMultiplier: 6.0,
    crossRotationMultiplier: 0.5,
    refreshRate: 25,
    symbols: IndicatorKind.Project,
  }
}*/
//# sourceMappingURL=ProgressIndicator.js.map