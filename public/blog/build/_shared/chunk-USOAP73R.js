import {
    a
} from "/build/_shared/chunk-3SZCNBN5.js";
import {
    g as s,
    k as i
} from "/build/_shared/chunk-TF7C7MH2.js";
import {
    b as l
} from "/build/_shared/chunk-KO3OK2JV.js";
import {
    e as o
} from "/build/_shared/chunk-ADMCF34Z.js";
var p = "/build/_assets/mdfile-KT4VFRDX.css";
var t = o(l());

function r() {
    let e = i();
    return e ? (0, t.jsx)("div", {
        className: "bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300",
        children: (0, t.jsx)("div", {
            className: " max-w-[52rem] mx-auto px-4 pb-28 sm:px-6 md:px-8 xl:px-12 lg:max-w-6xl",
            children: (0, t.jsxs)("div", {
                className: "overflow-hidden",
                children: [(0, t.jsx)("div", {
                    className: "max-w-8xl mx-auto",
                    children: (0, t.jsx)("div", {
                        className: "flex px-4 pt-8 pb-10 lg:px-8",
                        children: (0, t.jsxs)(s, {
                            to: "/blog",
                            className: "group flex font-semibold text-sm leading-6 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white",
                            children: [(0, t.jsx)("svg", {
                                viewBox: "0 -9 3 24",
                                className: "overflow-visible mr-3 text-slate-400 w-auto h-6 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                                children: (0, t.jsx)("path", {
                                    d: "M3 0L0 3L3 6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                })
                            }), "Go back"]
                        })
                    })
                }), (0, t.jsx)("div", {
                    className: "px-4 sm:px-6 md:px-8",
                    children: (0, t.jsx)("div", {
                        className: "max-w-3xl mx-auto pb-28",
                        children: (0, t.jsx)("main", {
                            className: "bg-gray-50 dark:bg-slate-900",
                            children: (0, t.jsxs)("article", {
                                className: "relative pt-10",
                                children: [(0, t.jsx)("h1", {
                                    className: "text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 md:text-3xl ",
                                    children: e.title
                                }), (0, t.jsx)("div", {
                                    className: "text-sm leading-6",
                                    children: (0, t.jsxs)("dl", {
                                        children: [(0, t.jsx)("dt", {
                                            className: "sr-only",
                                            children: "Date"
                                        }), (0, t.jsx)("dd", {
                                            className: "absolute top-0 inset-x-0 text-slate-700 dark:text-slate-400",
                                            children: (0, t.jsx)("time", {
                                                dateTime: e.date,
                                                children: e.date
                                            })
                                        })]
                                    })
                                }), (0, t.jsx)("div", {
                                    className: "mt-6",
                                    children: (0, t.jsx)("ul", {
                                        className: "flex flex-wrap text-sm leading-6 -mt-6 -mx-5",
                                        children: (0, t.jsx)("li", {
                                            className: "flex items-center font-medium whitespace-nowrap px-5 mt-6",
                                            children: (0, t.jsxs)("div", {
                                                className: "text-sm leading-4",
                                                children: [(e == null ? void 0 : e.author) && (0, t.jsx)("div", {
                                                    className: "text-slate-900 dark:text-slate-200",
                                                    children: e.author
                                                }), (e == null ? void 0 : e.nickname) && (0, t.jsx)("div", {
                                                    className: "mt-1",
                                                    children: (0, t.jsxs)("a", {
                                                        href: `https://github.com/${e.nickname}`,
                                                        className: "text-indigo-600 dark:text-indigo-400",
                                                        children: ["@", e.nickname]
                                                    })
                                                })]
                                            })
                                        })
                                    })
                                }), (0, t.jsx)("div", {
                                    className: "mt-6 single_post",
                                    children: (0, t.jsx)("div", {
                                        dangerouslySetInnerHTML: {
                                            __html: e.html
                                        }
                                    })
                                })]
                            })
                        })
                    })
                })]
            })
        })
    }) : (0, t.jsx)(a, {})
}
export {
    p as a, r as b
};