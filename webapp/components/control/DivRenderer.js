var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "sap/ui/core/Renderer", "sap/ui/Device"], function (require, exports, Renderer_1, Device_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var oRenderer = Renderer_1.default.extend("ui5.testApp.components.control.DivRenderer");
    var DivRenderer = /** @class */ (function (_super) {
        __extends(DivRenderer, _super);
        function DivRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DivRenderer.prototype.render = function (oRM, oDiv) {
            oRM.write("<div");
            oRM.writeControlData(oDiv);
            if (oDiv.getSlot()) {
                oRM.writeAttribute("slot", oDiv.getSlot());
            }
            oRM.write(">");
            this.renderItems(oDiv, oRM);
            oRM.write("</div>");
        };
        DivRenderer.prototype.renderItems = function (oControl, oRm) {
            var aChildren = oControl.getItems(), sWrapperTag = '';
            for (var i = 0; i < aChildren.length; i++) {
                // Don't wrap if it's a FlexBox control
                if (aChildren[i].isA('sap.m.FlexBox') || oControl.getRenderType() === sap.m.FlexRendertype.Bare) {
                    sWrapperTag = "";
                }
                else if (oControl.getRenderType() === sap.m.FlexRendertype.List) {
                    sWrapperTag = "li";
                }
                else {
                    sWrapperTag = "div";
                }
                this.renderItem(aChildren[i], sWrapperTag, oRm);
            }
        };
        ;
        DivRenderer.prototype.renderItem = function (oItem, sWrapperTag, oRm) {
            if (sWrapperTag) {
                // Open wrapper
                oRm.write('<' + sWrapperTag);
                // ScrollContainer needs height:100% on the flex item
                if (oItem instanceof sap.m.ScrollContainer) {
                    oRm.addClass("sapMFlexBoxScroll");
                }
                // Hide invisible items, but leave them in the DOM
                if (!oItem.getVisible()) {
                    oRm.addClass("sapUiHiddenPlaceholder");
                }
            }
            // Set layout properties
            var oLayoutData = oItem.getLayoutData();
            // If no layout data is set, create it so that an ID can be set on the wrapper
            if (sWrapperTag && !oLayoutData) {
                oItem.setAggregation("layoutData", new sap.m.FlexItemData(), true);
                oLayoutData = oItem.getLayoutData();
            }
            if (oLayoutData instanceof sap.m.FlexItemData) {
                // FlexItemData is an element not a control, so we need to write id and style class ourselves if a wrapper tag is used
                if (sWrapperTag && oLayoutData.getId()) {
                    oRm.writeAttributeEscaped("id", oLayoutData.getId());
                }
                // Add style class set by app
                if (oLayoutData.getStyleClass()) {
                    var toHex_1 = function (iChar, iLength) {
                        var sHex = iChar.toString(16);
                        if (iLength) {
                            sHex = sHex.padStart(iLength, '0');
                        }
                        return sHex;
                    };
                    var rHtml = /[\x00-\x2b\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\xff\u2028\u2029]/g, rHtmlReplace_1 = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/, mHtmlLookup_1 = {
                        "<": "&lt;",
                        ">": "&gt;",
                        "&": "&amp;",
                        "\"": "&quot;"
                    };
                    var fnHtml = function (sChar) {
                        var sEncoded = mHtmlLookup_1[sChar];
                        if (!sEncoded) {
                            if (rHtmlReplace_1.test(sChar)) {
                                sEncoded = "&#xfffd;";
                            }
                            else {
                                sEncoded = "&#x" + toHex_1(sChar.charCodeAt(0), 0) + ";";
                            }
                            mHtmlLookup_1[sChar] = sEncoded;
                        }
                        return sEncoded;
                    };
                    this.addItemClass(fnHtml(oLayoutData.getStyleClass()), oItem, sWrapperTag, oRm);
                }
                // Add classes relevant for flex item
                this.addItemClass("sapMFlexItemAlign" + oLayoutData.getAlignSelf(), oItem, sWrapperTag, oRm);
                this.addItemClass("sapMFlexBoxBG" + oLayoutData.getBackgroundDesign(), oItem, sWrapperTag, oRm);
                // Set layout properties for flex item
                if (sWrapperTag) {
                    this.setFlexItemStyles(oRm, oLayoutData);
                }
            }
            this.addItemClass("sapMFlexItem", oItem, sWrapperTag, oRm);
            // Write the styles and classes and close the wrapper tag
            if (sWrapperTag) {
                oRm.writeStyles();
                oRm.writeClasses();
                oRm.write(">");
            }
            // Render control
            oRm.renderControl(oItem);
            if (sWrapperTag) {
                // Close wrapper
                oRm.write('</' + sWrapperTag + '>');
            }
        };
        ;
        DivRenderer.prototype.addItemClass = function (sClass, oItem, sWrapperTag, oRm) {
            if (sWrapperTag) {
                oRm.addClass(sClass);
            }
            else {
                oItem.addStyleClass(sClass);
            }
        };
        DivRenderer.prototype.setFlexItemStyles = function (oRm, oLayoutData) {
            oRm = oRm || null;
            var sOrder = '' + oLayoutData.getOrder(), sGrowFactor = '' + oLayoutData.getGrowFactor(), sShrinkFactor = '' + oLayoutData.getShrinkFactor(), sBaseSize = oLayoutData.getBaseSize().toLowerCase(), sMinHeight = oLayoutData.getMinHeight(), sMaxHeight = oLayoutData.getMaxHeight(), sMinWidth = oLayoutData.getMinWidth(), sMaxWidth = oLayoutData.getMaxWidth();
            // Set values if different from default
            if (typeof sOrder !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "order", sOrder);
            }
            if (typeof sGrowFactor !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "flex-grow", sGrowFactor);
            }
            if (typeof sShrinkFactor !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "flex-shrink", sShrinkFactor);
            }
            if (typeof sBaseSize !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "flex-basis", sBaseSize);
            }
            if (typeof sMinHeight !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "min-height", sMinHeight);
            }
            if (typeof sMaxHeight !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "max-height", sMaxHeight);
            }
            if (typeof sMinWidth !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "min-width", sMinWidth);
            }
            if (typeof sMaxWidth !== 'undefined') {
                this.setStyle(oRm, oLayoutData, "max-width", sMaxWidth);
            }
        };
        DivRenderer.prototype.setStyle = function (oRm, oLayoutData, sProperty, sValue) {
            if (typeof (sValue) === "string") {
                // Convert camel-case to lower-case and dashes
                sValue = sValue.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
            }
            this.writeStyle(oRm, oLayoutData, sProperty, sValue);
        };
        DivRenderer.prototype.writeStyle = function (oRm, oLayoutData, sProperty, sValue) {
            // IE 10-11 miscalculate the width of the flex items when box-sizing: border-box // TODO remove after 1.62 version
            // Instead of using flex-basis, we use an explicit width/height
            // @see https://github.com/philipwalton/flexbugs#7-flex-basis-doesnt-account-for-box-sizingborder-box
            if (Device_1.default.browser.internet_explorer && (sProperty === "flex-basis" || sProperty === "flex-preferred-size")) {
                if (oLayoutData.getParent()) {
                    if (oLayoutData.getParent().getParent().getDirection().indexOf("Row") > -1) {
                        sProperty = "width";
                    }
                    else {
                        sProperty = "height";
                    }
                }
            }
            // Finally, write property value to control using either the render manager or the element directly
            if (oRm) {
                if (sValue === "0" || sValue) {
                    oRm.addStyle(sProperty, sValue);
                }
            }
            else {
                // Set the property on the wrapper or the control root itself
                if (oLayoutData.$().length) { // Does the layout data have a DOM representation?
                    // jQuery removes 'null' styles
                    if (sValue !== "0" && !sValue) {
                        oLayoutData.$().css(sProperty, null);
                    }
                    else {
                        oLayoutData.$().css(sProperty, sValue);
                    }
                }
                else {
                    // Get control root for bare item
                    if (oLayoutData.getParent()) {
                        // jQuery removes 'null' styles
                        if (sValue !== "0" && !sValue) {
                            oLayoutData.getParent().$().css(sProperty, null);
                        }
                        else {
                            oLayoutData.getParent().$().css(sProperty, sValue);
                        }
                    }
                }
            }
        };
        DivRenderer = __decorate([
            UI5("ui5.testApp.components.control.DivRenderer")
        ], DivRenderer);
        return DivRenderer;
    }(oRenderer));
    exports.default = DivRenderer;
});
//# sourceMappingURL=DivRenderer.js.map