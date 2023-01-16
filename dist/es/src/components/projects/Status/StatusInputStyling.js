"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertContainer = exports.StatusInputWrapper = exports.Expiring = exports.DateStyled = exports.TipItem = exports.Tooltip = exports.Details = exports.DndDisclaimer = exports.DndZone = exports.IconSpan = exports.DndItemButton = exports.customStyles = void 0;
const styled_components_1 = __importStar(require("styled-components"));
const select_styles_1 = require("../../../lib/select-styles");
const colors_1 = require("../../../theme/colors");
exports.customStyles = Object.assign(Object.assign({}, select_styles_1.selectStyles), { clearIndicator: (styles) => {
        return Object.assign(Object.assign({}, styles), { cursor: 'pointer', svg: {
                fill: '#6E6E6E',
            } });
    }, menuList: (styles) => {
        return Object.assign(Object.assign({}, styles), { padding: '0' });
    }, option: (styles, { isDisabled, isFocused }) => {
        return Object.assign(Object.assign({}, styles), { color: '#353535', cursor: isDisabled ? 'not-allowed' : 'pointer', padding: '0', backgroundColor: isFocused ? '#F2FBFC' : 'transparent', '&:hover': {
                backgroundColor: '#F2FBFC',
            } });
    } });
const pieStyles = styled_components_1.css `
  .pie {
    stroke-dasharray: ${(props) => props.pie.percent}
      ${(props) => props.pie.circumference};
  }
`;
const dndStyles = styled_components_1.css `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.default};
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
  padding: ${(props) => props.theme.grid.unit * 2}px;
`;
const iconStyles = styled_components_1.css `
  .iconToDo g {
    stroke: ${(props) => props.isSelected
    ? props.theme.colors.brand.medium
    : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
            ? props.theme.colors.text.error
            : props.defaultColor};
  }
  .iconDone circle {
    fill: ${(props) => props.isSelected
    ? props.theme.colors.brand.medium
    : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
            ? props.theme.colors.text.error
            : props.defaultColor};
  }
  .iconDoing circle {
    stroke: ${(props) => props.isSelected
    ? props.theme.colors.brand.medium
    : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
            ? props.theme.colors.text.error
            : props.defaultColor};
  }

  ${(props) => props.pie && pieStyles}
`;
const optionStyles = styled_components_1.css `
  background: ${(props) => props.isSelected ? props.theme.colors.background.fifth : 'transparent'};

  &.padded {
    padding: ${(props) => props.theme.grid.unit * 4}px;
  }

  ${iconStyles}
`;
exports.DndItemButton = styled_components_1.default.div `
  align-items: center;
  background: ${(props) => (props.isDragging ? 'pink' : 'white')};
  display: flex;
  font-size: ${(props) => props.theme.font.size.normal};
  line-height: ${(props) => props.theme.font.lineHeight.normal};

  ${optionStyles}

  svg {
    margin-right: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
exports.IconSpan = styled_components_1.default.span `
  display: inline-flex;
`;
exports.DndZone = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;

  ${exports.DndItemButton} {
    ${dndStyles}
  }

  .newStatus .pie {
    stroke-dasharray: 0 26;
  }

  .orderedStatus {
    margin: ${(props) => props.theme.grid.unit * 10}px 0;
  }
`;
exports.DndDisclaimer = styled_components_1.default.div `
  background-image: url("data:image/svg+xml,%3Csvg width='212' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1h214' stroke='%23E2E2E2' fill='none' stroke-dasharray='4' stroke-linecap='square'/%3E%3C/svg%3E");
  background-position: bottom;
  background-repeat: repeat-x;

  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 -${(props) => props.theme.grid.unit * 4}px;

  p {
    color: #6e6e6e;
    font-size: ${(props) => props.theme.font.size.small};
    font-weight: ${(props) => props.theme.font.weight.normal};
    line-height: ${(props) => props.theme.font.lineHeight.normal};
    margin: ${(props) => props.theme.grid.unit * 3}px 0;
    max-width: 150px;
    text-align: center;
  }
`;
exports.Details = styled_components_1.default.div `
  color: ${colors_1.greyLight};
  padding-left: ${(props) => props.theme.grid.unit * 6}px;
  position: relative;
`;
exports.Tooltip = styled_components_1.default.div `
  background: #333;
  border-radius: ${(props) => props.theme.grid.radius.default};
  color: ${(props) => props.theme.colors.text.onDark};
  display: flex;
  flex-direction: column-reverse;
  left: -72px;
  padding: ${(props) => props.theme.grid.unit * 4}px;
  position: absolute;
  top: 36px;
  width: 150px;

  &:after {
    bottom: 100%;
    border: ${(props) => props.theme.grid.unit * 2}px solid transparent;
    border-bottom-color: #333;
    content: ' ';
    height: 0;
    left: 50%;
    margin-left: -${(props) => props.theme.grid.unit * 2}px;
    position: absolute;
    pointer-events: none;
    width: 0;
  }
`;
exports.TipItem = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.small};
  font-weight: ${(props) => props.theme.font.weight.normal};
  line-height: ${(props) => props.theme.font.lineHeight.normal};

  ${exports.DndItemButton} {
    font-weight: ${(props) => props.theme.font.weight.bold};
  }

  & + & {
    margin-bottom: ${(props) => props.theme.grid.unit}px;

    ${exports.Details} {
      &:before {
        position: absolute;
        content: '';
        left: ${(props) => props.theme.grid.unit * 2}px;
        top: ${(props) => props.theme.grid.unit}px;
        height: calc(100% - ${(props) => props.theme.grid.unit}px);
        width: 1px;
        border-left: 1px dashed #6e6e6e;
      }
    }
  }
`;
exports.DateStyled = styled_components_1.default.div `
  color: ${colors_1.greyLight};
`;
exports.Expiring = styled_components_1.default.div `
  &.dueSoon {
    color: ${(props) => props.theme.colors.text.warning};
  }
  &.overdue {
    color: ${(props) => props.theme.colors.text.error};
  }
`;
exports.StatusInputWrapper = styled_components_1.default.div `
  position: relative;
  width: 100%;
`;
exports.AlertContainer = styled_components_1.default.div `
  bottom: -${(props) => props.theme.grid.unit * 16}px;
  display: flex;
  justify-content: flex-end;
  left: -100px;
  position: absolute;
  right: 0;

  > div {
    max-width: 100%;
    width: fit-content;
  }
`;
//# sourceMappingURL=StatusInputStyling.js.map