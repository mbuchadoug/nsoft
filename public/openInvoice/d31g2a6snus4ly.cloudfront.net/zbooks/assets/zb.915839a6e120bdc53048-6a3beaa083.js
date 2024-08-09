"use strict";
(self.webpackChunkzb = self.webpackChunkzb || []).push([
    ["c75c99051a1b8ed69b2d"], {
        tILkoG0h8U: (e, t, s) => {
            s.r(t), s.d(t, {
                default: () => a
            });
            var i = s("36zy8vQSBH"),
                n = s.n(i),
                o = s("gbDCjYKf04"),
                r = s("uS8z1UmkwQ");
            const a = n().extend({
                appMeta: (0, r.inject)(),
                currentOrg: (0, r.inject)(),
                currentUser: (0, r.inject)(),
                features: (0, r.inject)(),
                permission: (0, r.inject)(),
                init() {
                    this._super(...arguments), this.setDefaultValues()
                },
                options: null,
                model: null,
                defaultOptions: null,
                canShowConfigLayout: !1,
                isExportLimitExceeded: !1,
                canShowPrintPreference: !1,
                setDefaultValues() {
                    this.setProperties({
                        options: {
                            isPrintPreference: !1,
                            password: "",
                            isPasswordNeeded: !1,
                            exportFormat: "",
                            exportNormalType: !0,
                            language_code: this.currentOrg.language_code,
                            show_current_view: !1
                        },
                        canShowSelectReport: !1,
                        canShowConfigLayout: !1,
                        isExportLimitExceeded: !1
                    }), this.model && this.set("model.layouts", (0, o.copy)(this.defaultOptions))
                }
            })
        }
    }
]);