"use strict";
(self.webpackChunkzb = self.webpackChunkzb || []).push([
    ["7f311a19cf252a70a5ee"], {
        "5xpdGJwW5y": (t, e, i) => {
            i.r(e), i.d(e, {
                default: () => h
            });
            var o = i("36zy8vQSBH"),
                n = i.n(o),
                s = i("3Wd0sF4I+M"),
                a = i("nDKNwoXEzh"),
                d = i("BFqpbR8oGx"),
                r = i("Q9kRLXlovR"),
                c = i("qMlgSONLU+"),
                l = i("0UZNZmwAlW"),
                m = i("lk8sHD2hCX"),
                p = i("GwMJFRrJlr"),
                u = i("uS8z1UmkwQ");
            const h = n().extend({
                appMeta: (0, u.inject)(),
                currentOrg: (0, u.inject)(),
                currentUser: (0, u.inject)(),
                features: (0, u.inject)(),
                permission: (0, u.inject)(),
                notificationService: (0, u.inject)("zf-notification"),
                appViewService: (0, u.inject)("control-app-view"),
                queryParams: ["account_type", "pdf_institution_id", "stmt_suggestion_count", "accountid", "account_name", "document_id", "isAccountInfoNeeded", "tax_type"],
                account_type: "",
                pdf_institution_id: "",
                document_id: null,
                canShowBankStmtPromotion: !1,
                isUploadedFromCloud: !1,
                attachedDocumentsCount: 0,
                maxDocumentsCount: 1,
                canShowPDFBankpopover: !1,
                tax_type: "tax",
                canShowDuplicateWarning: (0, p.ifAandNotB)("isPDFImportAllowed", "model.account.is_auto_duplicate_disabled"),
                canShowUploadDropDown: (0, a.or)("features.canShowAttachFromCloud", "canShowAttachFromDocsOption"),
                hideSampleFilesforIN: (0, a.and)("currentOrg.isIndiaVersion", "model.canHideSampleFilesForIN"),
                canShowSampleFile: (0, p.nor)("model.isCardImport", "model.isBankAccountImport"),
                canShowAttachFromDocsOption: (0, a.and)("permission.documents.document_view", "features.canShowDocuments"),
                canShowSeparator: (0, a.or)("model.{showAutoGenerate,isMappingRequired}", "canMapAddrToContact"),
                xmlNotes: Object.freeze(["zb.import.xml.notes1", "zb.import.xml.notes2", "zb.import.xml.notes3"]),
                canShowGSTHelp: (0, s.computed)("model.entity_constant", (function() {
                    return this.currentOrg.isIndiaVersion && !["statement", "custpmt_invoice", "workpaper_trial_balance", "workpaper_balance_sheet", "workpaper_profit_and_loss"].includes(this.model.entity_constant)
                })),
                isNewImportFlow: (0, a.equal)("model.entity_constant", "invoice"),
                isEmptyUpload: (0, a.empty)("uploadedFileName"),
                canDisableImportButton: (0, s.computed)("isEmptyUpload", "isABCExport", "model.isTncAccepted", "model.account.pdf_institution_id", "accountid", (function() {
                    if (this.isPDFImportAllowed) {
                        let {
                            account: {
                                pdf_institution_id: t
                            } = {},
                            isTncAccepted: e
                        } = this.model;
                        return !t || this.currentOrg.is_perfios_enabled && !e
                    }
                    return this.isEmptyUpload || this.isABCExport
                })),
                isEnterpriseClient: (0, a.reads)("appMeta.isEnterpriseClient"),
                uploadedFileName: (0, s.computed)("isUploadedFromCloud", "model.uploadedFile.name", "uploadedDocObj", (function() {
                    let {
                        isUploadedFromCloud: t,
                        uploadedDocObj: e,
                        model: i
                    } = this;
                    return t ? decodeURIComponent(e.docName || "") : i.uploadedFile ? i.uploadedFile.name : ""
                })),
                fileExtension: (0, s.computed)("model.uploadedFile", (function() {
                    let t = this.get("uploadedFileName") || "",
                        e = t.lastIndexOf("."),
                        i = t.length;
                    return (e > 0 ? t.slice(e + 1, i) : "").toLowerCase()
                })),
                fileFormatsDesc: (0, s.computed)("model.isBankStatementImport", "isABCImport", (function() {
                    return this.isABCImport ? "zb.import.abc" : this.get("model.isBankStatementImport") ? "zb.import.bankfileformats" : "zb.import.fileformats"
                })),
                isXLSFile: (0, a.equal)("fileExtension", "xls"),
                isABCImport: (0, a.equal)("model.entity_constant", "abc_import"),
                isABCExport: (0, s.computed)("isXLSFile", "isABCImport", (function() {
                    return this.isXLSFile && this.isABCImport
                })),
                isCSVFile: (0, a.equal)("fileExtension", "csv"),
                isQIFFile: (0, a.equal)("fileExtension", "qif"),
                isPDFFile: (0, a.equal)("fileExtension", "pdf"),
                isPDFImportAllowed: (0, a.and)("isPDFFile", "currentOrg.isPDFImportEnabled", "model.isBankStatementImport"),
                canMapAddrToContact: (0, s.computed)("model.entity_constant", (function() {
                    return l.default.custaddrImpSuptEnty.includes(this.get("model.entity_constant"))
                })),
                showAmountColumn: (0, s.computed)("fileExtension", "model.isBankStatementImport", (function() {
                    return this.get("model.isBankStatementImport") && ["csv", "tsv", "xls"].includes(this.fileExtension)
                })),
                skipMapping: (0, s.computed)("fileExtension", "currentOrg.isPDFImportEnabled", (function() {
                    let t = ["ofx", "xml", "qif"],
                        {
                            currentOrg: e
                        } = this;
                    return e.isPDFImportEnabled && t.push("pdf"), t.includes(this.fileExtension)
                })),
                duplicateComparison: (0, s.computed)("model.duplicateComparison", (function() {
                    return this.model.duplicateComparison ? this.model.duplicateComparison : "".concat(this.model.entity_name_singular_translate, " ").concat((0, c.default)("tax.common.name"))
                })),
                sampleFilesAttrsMap: (0, s.computed)("model.account.account_type", "model.prefixPath", (function() {
                    let t = "credit_card" === this.get("model.account.account_type") ? "sample_creditcardstatement" : "sample_bankstatement",
                        e = this.get("model.prefixPath"),
                        i = ["csv", "tsv", "xls", "ofx", "qif"].map((i => {
                            let o = "".concat(t, ".").concat(i);
                            return {
                                fileName: o,
                                svgName: "import-".concat(i),
                                url: "".concat(e).concat(o)
                            }
                        })),
                        o = [{
                            fileName: "".concat(t, "_camt053.xml"),
                            svgName: "import-xml",
                            url: "".concat(e).concat(t, "_camt.xml")
                        }];
                    return "credit_card" !== this.get("model.account.account_type") && o.push({
                        fileName: "".concat(t, "_camt054.xml"),
                        svgName: "import-xml",
                        url: "".concat(e).concat(t, "_camt054.xml")
                    }), [...i, ...o]
                })),
                fileName: (0, s.computed)("model.{sample_file_name,editionSpecificFileNames}", "currentOrg.version", (function() {
                    var t;
                    let {
                        model: e
                    } = this, i = null === (t = l.default.VERSION_DETAILS.findBy("version", this.currentOrg.version)) || void 0 === t ? void 0 : t.versionCode;
                    return e.editionSpecificFileNames && e.editionSpecificFileNames[i] || e.sample_file_name
                })),
                sampleFilePath: (0, s.computed)("model.{prefixPath,amount_format,isBankStatementImport,editions}", "fileExtension", "fileName", "appViewService.filePrefix", "appMeta.is_books", (function() {
                    var t;
                    let {
                        model: e,
                        fileName: i,
                        appMeta: {
                            is_books: o
                        } = {}
                    } = this, n = e.prefixPath;
                    if (n = "".concat(this.appViewService.filePrefix).concat(n), e.isBankStatementImport) {
                        let {
                            fileExtension: t
                        } = this;
                        if ("qif" === t) return n + e.sample_file_name_qif;
                        if ("ofx" === t) return n + e.sample_file_name_ofx;
                        if ("xml" === t) return n + e.sample_file_name_camt;
                        if ("single_with_negative" === e.amount_format) return n + e.sample_file_name_onecolumn_negative;
                        if ("single_with_flag" === e.amount_format) return n + e.sample_file_name_onecolumn_flag
                    }
                    let {
                        editions: s
                    } = e, a = null === (t = l.default.VERSION_DETAILS.findBy("version", this.currentOrg.version)) || void 0 === t ? void 0 : t.versionCode;
                    (0, d.isPresent)(s) && (0, d.isPresent)(a) && s.includes(a) && ("es-mx" === a && (a = o ? "mx" : ""), a && (i = "".concat(a, "/").concat(i)));
                    let r = this.model.entity_constant;
                    if (r.startsWith("cm_")) {
                        let t = "/samplefile/download?entity=".concat(r, "&accept=csv");
                        return t = m.default.prependAPIPrefix(t), t = m.default.appendAuthParams(t), t
                    }
                    return n + i
                })),
                sampleXlsFilePath: (0, s.computed)("model.{prefixPath,sample_file_name_xls}", "currentOrg.{isGermanVersion,isMexicanVersion}", "appMeta.is_books", (function() {
                    let t = this.get("model.sample_file_name_xls"),
                        {
                            currentOrg: {
                                isGermanVersion: e,
                                isMexicanVersion: i
                            } = {},
                            appMeta: {
                                is_books: o
                            } = {}
                        } = this,
                        n = i && o;
                    if (!t) return;
                    let s, a = "".concat(this.appViewService.filePrefix).concat(this.model.prefixPath),
                        r = this.get("model.specific_xls_editions") || this.get("model.editions");
                    return (0, d.isPresent)(r) && (this.get("currentOrg.isUSVersion") && r.includes("us") ? s = "us/".concat(t) : this.get("currentOrg.isUKVersion") && r.includes("uk") ? s = "uk/".concat(t) : this.get("currentOrg.isCanadaVersion") && r.includes("ca") ? s = "ca/".concat(t) : this.get("currentOrg.isAUVersion") && r.includes("au") ? s = "au/".concat(t) : this.get("currentOrg.isIndiaVersion") && r.includes("in") ? s = "in/".concat(t) : this.get("currentOrg.isUAEVersion") && r.includes("ae") ? s = "ae/".concat(t) : this.get("currentOrg.isSAVersion") && r.includes("sa") ? s = "sa/".concat(t) : this.get("currentOrg.isBHVersion") && r.includes("bh") ? s = "bh/".concat(t) : e && r.includes("de") ? s = "de/".concat(t) : this.get("currentOrg.isGlobalVersion") && r.includes("global") ? s = t : n && r.includes("es-mx") && (s = "mx/".concat(t))), !this.get("model.specific_xls_editions") || s ? a + (s || t) : void 0
                })),
                uploadFileFormatHelp: "zb.import.fileformats",
                delimiters: [{
                    delimiter_name: (0, c.default)("zb.comma.delimeter"),
                    value: ","
                }, {
                    delimiter_name: (0, c.default)("zb.semicolon.delimeter"),
                    value: ";"
                }],
                getFormData() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                        e = new FormData,
                        i = this.get("model.uploadedFile.document_id"),
                        {
                            map_address_to_contact: o = !1
                        } = this.model;
                    return (0, d.isPresent)(i) ? e.append("document_id", i) : this.isUploadedFromCloud ? e.append("doc", JSON.stringify(this.cloudDocObj)) : e.append("importfile", this.get("model.uploadedFile")), e.append("charencoding", this.get("model.charencoding")), t || (e.append("entity", this.get("model.entity_constant")), this.get("model.overwrite_supported") && e.append("duplicate_handling", this.get("model.duplicate_handling")), (this.isCSVFile || this.isUploadedFromCloud) && e.append("delimiter", this.get("model.delimiter")), (0, d.isEmpty)(this.get("model.autogenerate")) || e.append("autogenerate", this.get("model.autogenerate")), (0, d.isPresent)(this.get("model.map_related_entities")) && e.append("map_related_entities", this.get("model.map_related_entities")), l.default.custaddrImpSuptEnty.includes(this.get("model.entity_constant")) && e.append("map_address_to_contact", o), this.get("model.isBankStatementImport") && (e.append("amount_format", this.get("model.amount_format")), e.append("accountid", this.get("model.account.accountid")), this.isQIFFile ? (e.append("dateformat", this.get("model.dateformat")), e.append("currencyformat", this.get("model.currencyformat"))) : this.isPDFImportAllowed && (e.append("institution_id", this.get("model.account.pdf_institution_id")), this.get("model.isPasswordProtected") && e.append("password", r.default.encryptByRSA(this.get("model.password"), this.modulus, this.exponent))))), e
                },
                gstImportHelpUrl: (0, s.computed)((function() {
                    return "".concat(this.get("appMeta.homeUrl"), "/in/books/kb/gst/gst-import-format.html")
                })),
                institionAutoCompleteParams: (0, s.computed)("account_type", "model.account.account_type", (function() {
                    return {
                        account_type: this.account_type || this.model.account.account_type
                    }
                })),
                needPdfInstitutionUpdate: (0, s.computed)("isPDFImportAllowed", "model.account.pdf_institution_id", "currentOrg.isPDFImportEnabled", (function() {
                    return this.isPDFImportAllowed && this.get("model.account") && (this.currentOrg.isPDFImportEnabled || (0, d.isEmpty)(this.get("model.account.pdf_institution_id")))
                })),
                canDisablePdfInstitutionAssociation: (0, s.computed)("model.isTncAccepted", "needPdfInstitutionUpdate", (function() {
                    return !this.get("model.isTncAccepted") || this.needPdfInstitutionUpdate
                })),
                async updatePdfInstitution() {
                    let {
                        bankaccount: {
                            institution_id: t,
                            institution_name: e
                        } = {}
                    } = await this.store.getJSON("/bankaccounts/editpage", {
                        account_id: this.model.account.accountid
                    }), i = "credit_card" === this.account_type ? "creditCardPdfInstitutions" : "bankPdfInstitutions";
                    if (this.currentOrg.isPDFImportEnabled) {
                        let o = {
                            institution_id: t,
                            bank_name: e
                        };
                        this.setProperties({
                            entity: i,
                            selectedBank: o,
                            content: [o],
                            "model.account.pdf_institution_id": t
                        })
                    } else this.set("model.account.pdf_institution_id", t)
                },
                actions: {
                    uploadFile(t) {
                        this.model.setProperties({
                            isPasswordRequired: !1,
                            uploadedFile: t.context,
                            password: "",
                            isPasswordProtected: !1
                        }), this.needPdfInstitutionUpdate && this.updatePdfInstitution()
                    },
                    showCloudPicker() {
                        this.send("showCloudServices", {
                            type: "picker",
                            actionName: "attachFileFromCloud",
                            fileExtensions: "csv,tsv,xls",
                            fileMimeTypes: "csv,tsv,xls"
                        })
                    },
                    triggerBankStmtPromotion() {
                        this.toggleProperty("canShowBankStmtPromotion")
                    },
                    importFile() {
                        this.get("model.isPasswordProtected") && (0, d.isEmpty)(this.modulus) ? this.store.getJSON("/bankaccounts/import/encryptionkey").then((t => {
                            this.setProperties({
                                modulus: t.data.modulus,
                                exponent: t.data.exponent
                            }), this.send("_importFile")
                        })) : this.send("_importFile")
                    },
                    _importFile() {
                        var t, e;
                        let {
                            model: i
                        } = this, o = (null === (t = i.account) || void 0 === t ? void 0 : t.accountid) || this.accountid;
                        if (i.isBankStatementImport && !o) return void this.send("showErrorMsg", "zb.mileage.emptyaccount");
                        if (this.needPdfInstitutionUpdate && !this.currentOrg.isPDFImportEnabled) return void this.updatePdfInstitution();
                        let n = this.getFormData(),
                            s = (null === (e = this.currentOrg) || void 0 === e ? void 0 : e.isNewImportFlow) || !1,
                            a = "/uploadfile?organization_id=".concat(this.currentOrg.organization_id, "&is_new_flow=").concat(s),
                            d = {
                                type: "POST",
                                data: n,
                                processData: !1,
                                contentType: !1
                            };
                        return this.set("model.isUploading", !0), i.sendRequest(a, d).then((t => {
                            let {
                                data: e = {}
                            } = t;
                            if (i.deserialize(e), i.is_file_type_pdf && (this.send("showSuccessMsg", e.message), this.send("closeWizardAndReDirect")), this.skipMapping) return i.set("skipMapping", !0), void this.send("gotoImportPreview", i);
                            this.send("showFieldMapping", i)
                        })).catch((t => {
                            11065 === t.code && i.setProperties({
                                isPasswordRequired: !0,
                                isPasswordProtected: !0
                            }), this.send("showErrorMsg", t.message)
                        })).finally((() => {
                            this.set("model.isUploading", !1)
                        }))
                    },
                    handleContactSupport() {
                        this.set("canShowPDFBankpopover", !1), this.send("contactSupport")
                    },
                    removeUploadedFile() {
                        let {
                            isUploadedFromCloud: t
                        } = this;
                        t ? (this.set("uploadedDocObj", ""), this.set("isUploadedFromCloud", !1)) : this.set("model.uploadedFile", "")
                    },
                    attachFileFromDocuments(t, e, i) {
                        let o = {
                            selectedDocumentsCount: t,
                            maxDocumentsCount: e,
                            entity: i
                        };
                        this.send("attachFromDocuments", o)
                    },
                    convertXMLToJSON() {
                        var t = this;
                        let {
                            currentOrg: {
                                organization_id: e
                            } = {},
                            model: {
                                entity_constant: i,
                                uploadedFile: o
                            } = {}
                        } = this, n = {
                            organization_id: e,
                            entity: i
                        }, s = m.default.constructUrlParam("/einvoice/import", n), a = new FormData;
                        a.append("importfile", o), this.set("isXMLImportLoading", !0), this.store.ajax(s, {
                            type: "POST",
                            data: a
                        }).then((function() {
                            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                {
                                    message: i
                                } = e;
                            t.notificationService.success(i), t.send("closeWizardAndReDirect")
                        })).catch((function() {
                            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                {
                                    message: i
                                } = e;
                            t.notificationService.error(i)
                        })).finally((() => {
                            this.set("isXMLImportLoading", !1)
                        }))
                    }
                }
            })
        }
    }
]);