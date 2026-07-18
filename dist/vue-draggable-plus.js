var we = Object.defineProperty, Ie = Object.defineProperties;
var xe = Object.getOwnPropertyDescriptors;
var N = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, Q = Object.prototype.propertyIsEnumerable;
var K = (e, n, t) => n in e ? we(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t, A = (e, n) => {
  for (var t in n || (n = {}))
    W.call(n, t) && K(e, t, n[t]);
  if (N)
    for (var t of N(n))
      Q.call(n, t) && K(e, t, n[t]);
  return e;
}, Z = (e, n) => Ie(e, xe(n));
var _ = (e, n) => {
  var t = {};
  for (var r in e)
    W.call(e, r) && n.indexOf(r) < 0 && (t[r] = e[r]);
  if (e != null && N)
    for (var r of N(e))
      n.indexOf(r) < 0 && Q.call(e, r) && (t[r] = e[r]);
  return t;
};
import { shallowRef as de, getCurrentInstance as q, unref as d, watch as Le, onUnmounted as Ee, onMounted as Te, nextTick as fe, isRef as F, defineComponent as Be, computed as ee, toRefs as Ne, ref as Me, reactive as Re, h as Ve, isProxy as Ue } from "vue";
import R from "sortablejs";
const ge = "[vue-draggable-plus]: ";
function Pe(e) {
  console.warn(ge + e);
}
function Ge(e) {
  console.error(ge + e);
}
function ne(e, n, t) {
  return t >= 0 && t < e.length && e.splice(t, 0, e.splice(n, 1)[0]), e;
}
function _e(e) {
  return e.replace(/-(\w)/g, (n, t) => t ? t.toUpperCase() : "");
}
function Fe(e) {
  return Object.keys(e).reduce((n, t) => (typeof e[t] != "undefined" && (n[_e(t)] = e[t]), n), {});
}
function te(e, n) {
  return Array.isArray(e) && e.splice(n, 1), e;
}
function oe(e, n, t) {
  return Array.isArray(e) && e.splice(n, 0, t), e;
}
function $e(e) {
  return typeof e == "undefined";
}
function je(e) {
  return typeof e == "string";
}
function re(e, n, t) {
  const r = e.children[t];
  e.insertBefore(n, r);
}
function $(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function He(e, n = document) {
  var r;
  let t = null;
  return typeof (n == null ? void 0 : n.querySelector) == "function" ? t = (r = n == null ? void 0 : n.querySelector) == null ? void 0 : r.call(n, e) : t = document.querySelector(e), t || Pe(`Element not found: ${e}`), t;
}
function ke(e, n, t = null) {
  return function(...r) {
    return e.apply(t, r), n.apply(t, r);
  };
}
function qe(e, n) {
  const t = A({}, e);
  return Object.keys(n).forEach((r) => {
    t[r] ? t[r] = ke(e[r], n[r]) : t[r] = n[r];
  }), t;
}
function ze(e) {
  return e instanceof HTMLElement;
}
function le(e, n) {
  Object.keys(e).forEach((t) => {
    n(t, e[t]);
  });
}
function Ye(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const Je = Object.assign;
function H() {
  return R.dragged;
}
const M = /* @__PURE__ */ new Map();
let x = null;
function Xe(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function Ke() {
  if (x)
    return;
  const e = (n) => {
    const t = H();
    M.forEach(({ isDragOver: r, getOptions: i }, f) => {
      var b;
      const l = Xe(
        n.clientX,
        n.clientY,
        f.getBoundingClientRect()
      );
      if (r.value !== l) {
        r.value = l;
        const h = R.active;
        t && t.parentNode === f && (h == null ? void 0 : h.el) !== f && ((b = i()) != null && b.hideOnLeave) && (t.style.display = l ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), x = e;
}
function We() {
  x && (document.removeEventListener("pointermove", x), x = null);
}
function Qe() {
  M.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function Ze(e, n, t) {
  return M.set(e, { isDragOver: n, getOptions: t }), () => {
    M.delete(e);
  };
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    Ke();
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on the
  // revert-to-origin path (_onDragOver ~line 1748), so dragEl can be moved back
  // into the source while hideOnLeave's display:none is still applied. Clear it
  // before the DOM insert so the reverted item isn't reinserted invisible.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = H();
    e && e.style.display === "none" && (e.style.display = "");
  },
  nullingGlobal() {
    We(), Qe();
    const e = H();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "dragStateTracker";
V.initializeByDefault = !0;
const ie = "sortable-dragging";
function U() {
}
U.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ie);
  },
  nullingGlobal() {
    document.body.classList.remove(ie);
  }
};
U.pluginName = "bodyClass";
U.initializeByDefault = !0;
let ue = !1;
function en() {
  ue || (ue = !0, R.mount(V, U));
}
en();
function nn(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function tn(e) {
  q() && Ee(e);
}
function on(e) {
  q() ? Te(e) : fe(e);
}
let me = null, pe = null;
const be = de(null);
function ae(e = null, n = null) {
  me = e, pe = n, be.value = n;
}
function rn() {
  return {
    data: me,
    clonedData: pe
  };
}
const se = Symbol("cloneElement");
function ye(...e) {
  var J, X;
  const n = (J = q()) == null ? void 0 : J.proxy;
  let t = null;
  const r = e[0];
  let [, i, f] = e;
  Array.isArray(d(i)) || (f = i, i = null);
  let l = null, b = null;
  const h = de(!1), {
    immediate: L = !0,
    clone: y = nn,
    forceFallback: C,
    fallbackOnBody: O,
    customUpdate: v
  } = (X = d(f)) != null ? X : {};
  function E(o) {
    var p;
    const { from: u, oldIndex: s, item: g } = o, a = Array.from(u.childNodes);
    t = C && !O ? a.slice(0, -1) : a;
    const c = d((p = d(i)) == null ? void 0 : p[s]), m = y(c);
    ae(c, m), g[se] = m;
  }
  function P(o) {
    const u = o.item[se];
    if (!$e(u)) {
      if ($(o.item), F(i)) {
        const s = [...d(i)];
        i.value = oe(s, o.newDraggableIndex, u);
        return;
      }
      oe(d(i), o.newDraggableIndex, u);
    }
  }
  function G(o) {
    const { from: u, item: s, oldIndex: g, oldDraggableIndex: a, pullMode: c, clone: m } = o;
    if (re(u, s, g), c === "clone") {
      $(m);
      return;
    }
    if (F(i)) {
      const p = [...d(i)];
      i.value = te(p, a);
      return;
    }
    te(d(i), a);
  }
  function T(o) {
    if (v) {
      v(o);
      return;
    }
    const { from: u, item: s, oldIndex: g, oldDraggableIndex: a, newDraggableIndex: c } = o;
    if ($(s), re(u, s, g), F(i)) {
      const m = [...d(i)];
      i.value = ne(
        m,
        a,
        c
      );
      return;
    }
    ne(d(i), a, c);
  }
  function he(o) {
    const { newIndex: u, oldIndex: s, from: g, to: a } = o;
    let c = null;
    const m = u === s && g === a;
    try {
      if (m) {
        let p = null;
        t == null || t.some((w, D) => {
          if (p && (t == null ? void 0 : t.length) !== a.childNodes.length)
            return g.insertBefore(p, w.nextSibling), !0;
          const B = a.childNodes[D];
          p = a == null ? void 0 : a.replaceChild(w, B);
        });
      }
    } catch (p) {
      c = p;
    } finally {
      t = null;
    }
    fe(() => {
      if (ae(), c)
        throw c;
    });
  }
  const ve = {
    onUpdate: T,
    onStart: E,
    onAdd: P,
    onRemove: G,
    onEnd: he
  };
  function Se(o) {
    const u = d(r);
    return o || (o = je(u) ? He(u, n == null ? void 0 : n.$el) : u), o && !ze(o) && (o = o.$el), o || Ge("Root element not found"), o;
  }
  function z() {
    var p;
    const w = (p = d(f)) != null ? p : {}, { immediate: o, clone: u } = w, s = _(w, ["immediate", "clone"]);
    le(s, (D, B) => {
      Ye(D) && (s[D] = (I, ...Ce) => {
        const Oe = rn();
        return Je(I, Oe), B(I, ...Ce);
      });
    });
    const g = s.onAdd;
    delete s.onAdd;
    const a = i === null ? {} : ve, c = qe(a, s), m = a.onAdd;
    return (g || m) && (c.onAdd = function(D) {
      var I;
      if (((I = D.item) == null ? void 0 : I.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, D)) !== !1 && (m == null || m.call(this, D));
    }), c;
  }
  const Y = (o) => {
    o = Se(o), l && S.destroy(), l = new R(o, z()), b = Ze(
      o,
      h,
      () => d(f)
    );
  };
  Le(
    () => f,
    () => {
      l && le(z(), (o, u) => {
        l == null || l.option(o, u);
      });
    },
    { deep: !0 }
  );
  const S = {
    option: (o, u) => l == null ? void 0 : l.option(o, u),
    destroy: () => {
      b == null || b(), b = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...o) => l == null ? void 0 : l.closest(...o)
  }, De = () => S == null ? void 0 : S.option("disabled", !0), Ae = () => S == null ? void 0 : S.option("disabled", !1);
  return on(() => {
    L && Y();
  }), tn(S.destroy), Z(A({
    start: Y,
    pause: De,
    resume: Ae
  }, S), {
    draggedData: be,
    isDragOver: h
  });
}
const k = [
  "update",
  "start",
  "add",
  "remove",
  "choose",
  "unchoose",
  "end",
  "sort",
  "filter",
  "clone",
  "move",
  "change"
], ln = [
  "clone",
  "animation",
  "ghostClass",
  "group",
  "sort",
  "disabled",
  "store",
  "handle",
  "draggable",
  "swapThreshold",
  "invertSwap",
  "invertedSwapThreshold",
  "removeCloneOnHide",
  "direction",
  "chosenClass",
  "dragClass",
  "ignore",
  "filter",
  "preventOnFilter",
  "easing",
  "setData",
  "dropBubble",
  "dragoverBubble",
  "dataIdAttr",
  "delay",
  "delayOnTouchOnly",
  "touchStartThreshold",
  "forceFallback",
  "fallbackClass",
  "fallbackOnBody",
  "fallbackTolerance",
  "fallbackOffset",
  "supportPointer",
  "emptyInsertThreshold",
  "scroll",
  "forceAutoScrollFallback",
  "scrollSensitivity",
  "scrollSpeed",
  "bubbleScroll",
  "modelValue",
  "tag",
  "target",
  "customUpdate",
  ...k.map((e) => `on${e.replace(/^\S/, (n) => n.toUpperCase())}`)
], cn = Be({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: ln,
  emits: ["update:modelValue", ...k],
  setup(e, { slots: n, emit: t, expose: r, attrs: i }) {
    const f = k.reduce((y, C) => {
      const O = `on${C.replace(/^\S/, (v) => v.toUpperCase())}`;
      return y[O] = (...v) => t(C, ...v), y;
    }, {}), l = ee(() => {
      const v = Ne(e), { modelValue: y } = v, C = _(v, ["modelValue"]), O = Object.entries(C).reduce((E, [P, G]) => {
        const T = d(G);
        return T !== void 0 && (E[P] = T), E;
      }, {});
      return A(A({}, f), Fe(A(A({}, i), O)));
    }), b = ee({
      get: () => e.modelValue,
      set: (y) => t("update:modelValue", y)
    }), h = Me(), L = Re(
      ye(e.target || h, b, l)
    );
    return r(L), () => {
      var y;
      return Ve(e.tag || "div", { ref: h }, (y = n == null ? void 0 : n.default) == null ? void 0 : y.call(n, L));
    };
  }
}), ce = {
  mounted: "mounted",
  unmounted: "unmounted"
}, j = /* @__PURE__ */ new WeakMap(), dn = {
  [ce.mounted](e, n) {
    const t = Ue(n.value) ? [n.value] : n.value, [r, i] = t, f = ye(e, r, i);
    j.set(e, f.destroy);
  },
  [ce.unmounted](e) {
    var n;
    (n = j.get(e)) == null || n(), j.delete(e);
  }
};
export {
  cn as VueDraggable,
  ye as useDraggable,
  dn as vDraggable
};
