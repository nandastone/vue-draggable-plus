var Pe = Object.defineProperty, Fe = Object.defineProperties;
var Ve = Object.getOwnPropertyDescriptors;
var R = Object.getOwnPropertySymbols;
var ce = Object.prototype.hasOwnProperty, ae = Object.prototype.propertyIsEnumerable;
var ue = (e, t, n) => t in e ? Pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    ce.call(t, n) && ue(e, n, t[n]);
  if (R)
    for (var n of R(t))
      ae.call(t, n) && ue(e, n, t[n]);
  return e;
}, de = (e, t) => Fe(e, Ve(t));
var k = (e, t) => {
  var n = {};
  for (var o in e)
    ce.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && R)
    for (var o of R(e))
      t.indexOf(o) < 0 && ae.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as Ge, getCurrentInstance as oe, unref as d, watch as Ue, onUnmounted as $e, onMounted as je, nextTick as X, isRef as q, defineComponent as ze, computed as fe, toRefs as Ye, ref as ke, reactive as qe, h as We, isProxy as Je } from "vue";
import N from "sortablejs";
const Le = "[vue-draggable-plus]: ";
function Xe(e) {
  console.warn(Le + e);
}
function Ke(e) {
  console.error(Le + e);
}
function ge(e, t, n) {
  return n >= 0 && n < e.length && e.splice(n, 0, e.splice(t, 1)[0]), e;
}
function Qe(e) {
  return e.replace(/-(\w)/g, (t, n) => n ? n.toUpperCase() : "");
}
function Ze(e) {
  return Object.keys(e).reduce((t, n) => (typeof e[n] != "undefined" && (t[Qe(n)] = e[n]), t), {});
}
function he(e, t) {
  return Array.isArray(e) && e.splice(t, 1), e;
}
function pe(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function et(e) {
  return typeof e == "undefined";
}
function tt(e) {
  return typeof e == "string";
}
function me(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function W(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function nt(e, t = document) {
  var o;
  let n = null;
  return typeof (t == null ? void 0 : t.querySelector) == "function" ? n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, e) : n = document.querySelector(e), n || Xe(`Element not found: ${e}`), n;
}
function ot(e, t, n = null) {
  return function(...o) {
    return e.apply(n, o), t.apply(n, o);
  };
}
function rt(e, t) {
  const n = C({}, e);
  return Object.keys(t).forEach((o) => {
    n[o] ? n[o] = ot(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function it(e) {
  return e instanceof HTMLElement;
}
function be(e, t) {
  Object.keys(e).forEach((n) => {
    t(n, e[n]);
  });
}
function lt(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const st = Object.assign, K = Symbol("cloneGhostOriginalHtml"), Q = Symbol("cloneGhostOriginalWidth"), Z = Symbol("cloneGhostOriginalHeight"), H = Symbol("cloneGhostAppliedBy");
function M() {
  return N.dragged;
}
function V() {
  return N.ghost;
}
function ee(e) {
  if (!e || !e[H])
    return;
  const t = e[K];
  typeof t == "string" && (e.innerHTML = t);
  const n = e[Q];
  typeof n == "string" && (e.style.width = n);
  const o = e[Z];
  typeof o == "string" && (e.style.height = o), e[K] = void 0, e[Q] = void 0, e[Z] = void 0, e[H] = void 0;
}
function we(e, t) {
  e.innerHTML = t.innerHTML;
  const n = t.getBoundingClientRect();
  e.style.width = `${n.width}px`, e.style.height = `${n.height}px`;
}
function ut(e, t, n) {
  const o = t();
  o && (e[K] = e.innerHTML, e[Q] = e.style.width, e[Z] = e.style.height, o instanceof HTMLElement ? we(e, o) : (e.innerHTML = o, e.style.width = "", e.style.height = ""), e[H] = n);
}
function te(e, t, n) {
  e && e[H] !== n && (e[H] && ee(e), ut(e, t, n));
}
function B() {
  ee(M()), ee(V());
}
const L = /* @__PURE__ */ new Map();
function ct(e, t) {
  return L.set(e, { getFactory: t, observer: null }), () => {
    var o;
    const n = L.get(e);
    (o = n == null ? void 0 : n.observer) == null || o.disconnect(), L.delete(e);
  };
}
function at(e) {
  const t = V();
  t && (L.forEach((n, o) => {
    var i;
    if (o === e)
      return;
    const l = n.getFactory();
    if (!l)
      return;
    const u = l();
    u && (te(t, () => u, o), u instanceof HTMLElement && ((i = n.observer) == null || i.disconnect(), n.observer = new MutationObserver(
      () => we(t, u)
    ), n.observer.observe(u, { childList: !0, subtree: !0 })));
  }), P && (t.style.visibility = "", P = !1));
}
function dt() {
  L.forEach((e) => {
    var t;
    (t = e.observer) == null || t.disconnect(), e.observer = null;
  });
}
let P = !1;
function ft(e) {
  const t = V();
  if (!t)
    return;
  let n = !1;
  L.forEach((o, l) => {
    l !== e && o.getFactory() && (n = !0);
  }), n && (t.style.visibility = "hidden", P = !0);
}
function U() {
}
U.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (te(M(), t, e.sortable.el), te(V(), t, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && B();
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = M();
    B(), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    B();
  },
  nullingGlobal() {
    B(), dt(), P = !1;
  }
};
U.pluginName = "cloneGhost";
U.initializeByDefault = !0;
const F = /* @__PURE__ */ new Map();
let E = null;
function gt(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function ht() {
  if (E)
    return;
  const e = (t) => {
    const n = M();
    F.forEach(({ isDragOver: o, getOptions: l }, u) => {
      var b;
      const i = gt(
        t.clientX,
        t.clientY,
        u.getBoundingClientRect()
      );
      if (o.value !== i) {
        o.value = i;
        const m = N.active;
        n && n.parentNode === u && (m == null ? void 0 : m.el) !== u && ((b = l()) != null && b.hideOnLeave) && (n.style.display = i ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), E = e;
}
function pt() {
  E && (document.removeEventListener("pointermove", E), E = null);
}
function mt() {
  F.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function bt(e, t, n) {
  return F.set(e, { isDragOver: t, getOptions: n }), () => {
    F.delete(e);
  };
}
function $() {
}
$.prototype = {
  dragStartGlobal() {
    ht();
  },
  nullingGlobal() {
    pt(), mt();
    const e = M();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
$.pluginName = "dragStateTracker";
$.initializeByDefault = !0;
const ye = "sortable-dragging";
function j() {
}
j.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ye);
  },
  nullingGlobal() {
    document.body.classList.remove(ye);
  }
};
j.pluginName = "bodyClass";
j.initializeByDefault = !0;
let ve = !1;
function yt() {
  ve || (ve = !0, N.mount(
    U,
    $,
    j
  ));
}
yt();
function vt(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Ot(e) {
  oe() && $e(e);
}
function St(e) {
  oe() ? je(e) : X(e);
}
let Ae = null, De = null;
const Ie = Ge(null);
function Oe(e = null, t = null) {
  Ae = e, De = t, Ie.value = t;
}
function Ct() {
  return {
    data: Ae,
    clonedData: De
  };
}
const Se = Symbol("cloneElement");
function Te(...e) {
  var le, se;
  const t = (le = oe()) == null ? void 0 : le.proxy;
  let n = null;
  const o = e[0];
  let [, l, u] = e;
  Array.isArray(d(l)) || (u = l, l = null);
  let i = null, b = null, m = null;
  const w = Ge(!1), {
    immediate: y = !0,
    clone: G = vt,
    forceFallback: A,
    fallbackOnBody: O,
    customUpdate: D
  } = (se = d(u)) != null ? se : {};
  function z(r) {
    var p;
    const { from: s, oldIndex: a, item: g } = r, c = Array.from(s.childNodes);
    n = A && !O ? c.slice(0, -1) : c;
    const f = d((p = d(l)) == null ? void 0 : p[a]), h = G(f);
    Oe(f, h), g[Se] = h, ft(s), X(() => at(s));
  }
  function Y(r) {
    const s = r.item[Se];
    if (!et(s)) {
      if (W(r.item), q(l)) {
        const a = [...d(l)];
        l.value = pe(a, r.newDraggableIndex, s);
        return;
      }
      pe(d(l), r.newDraggableIndex, s);
    }
  }
  function x(r) {
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: c, pullMode: f, clone: h } = r;
    if (me(s, a, g), f === "clone") {
      W(h);
      return;
    }
    if (q(l)) {
      const p = [...d(l)];
      l.value = he(p, c);
      return;
    }
    he(d(l), c);
  }
  function Ee(r) {
    if (D) {
      D(r);
      return;
    }
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: c, newDraggableIndex: f } = r;
    if (W(a), me(s, a, g), q(l)) {
      const h = [...d(l)];
      l.value = ge(
        h,
        c,
        f
      );
      return;
    }
    ge(d(l), c, f);
  }
  function He(r) {
    const { newIndex: s, oldIndex: a, from: g, to: c } = r;
    let f = null;
    const h = s === a && g === c;
    try {
      if (h) {
        let p = null;
        n == null || n.some((I, S) => {
          if (p && (n == null ? void 0 : n.length) !== c.childNodes.length)
            return g.insertBefore(p, I.nextSibling), !0;
          const _ = c.childNodes[S];
          p = c == null ? void 0 : c.replaceChild(I, _);
        });
      }
    } catch (p) {
      f = p;
    } finally {
      n = null;
    }
    X(() => {
      if (Oe(), f)
        throw f;
    });
  }
  const Me = {
    onUpdate: Ee,
    onStart: z,
    onAdd: Y,
    onRemove: x,
    onEnd: He
  };
  function Ne(r) {
    const s = d(o);
    return r || (r = tt(s) ? nt(s, t == null ? void 0 : t.$el) : s), r && !it(r) && (r = r.$el), r || Ke("Root element not found"), r;
  }
  function re() {
    var p;
    const I = (p = d(u)) != null ? p : {}, { immediate: r, clone: s } = I, a = k(I, ["immediate", "clone"]);
    be(a, (S, _) => {
      lt(S) && (a[S] = (T, ...Re) => {
        const Be = Ct();
        return st(T, Be), _(T, ...Re);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const c = l === null ? {} : Me, f = rt(c, a), h = c.onAdd;
    return (g || h) && (f.onAdd = function(S) {
      var T;
      if (((T = S.item) == null ? void 0 : T.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, S)) !== !1 && (h == null || h.call(this, S));
    }), f;
  }
  const ie = (r) => {
    r = Ne(r), i && v.destroy(), i = new N(r, re()), b = bt(
      r,
      w,
      () => d(u)
    ), m = ct(
      r,
      () => {
        const s = d(u);
        return s != null && s.cloneGhostOnStart ? s.cloneGhost : void 0;
      }
    );
  };
  Ue(
    () => u,
    () => {
      i && be(re(), (r, s) => {
        i == null || i.option(r, s);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, s) => i == null ? void 0 : i.option(r, s),
    destroy: () => {
      b == null || b(), b = null, m == null || m(), m = null, i == null || i.destroy(), i = null;
    },
    save: () => i == null ? void 0 : i.save(),
    toArray: () => i == null ? void 0 : i.toArray(),
    closest: (...r) => i == null ? void 0 : i.closest(...r)
  }, xe = () => v == null ? void 0 : v.option("disabled", !0), _e = () => v == null ? void 0 : v.option("disabled", !1);
  return St(() => {
    y && ie();
  }), Ot(v.destroy), de(C({
    start: ie,
    pause: xe,
    resume: _e
  }, v), {
    draggedData: Ie,
    isDragOver: w
  });
}
const ne = [
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
], Gt = [
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
  ...ne.map((e) => `on${e.replace(/^\S/, (t) => t.toUpperCase())}`)
], Dt = ze({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: Gt,
  emits: ["update:modelValue", ...ne],
  setup(e, { slots: t, emit: n, expose: o, attrs: l }) {
    const u = ne.reduce((y, G) => {
      const A = `on${G.replace(/^\S/, (O) => O.toUpperCase())}`;
      return y[A] = (...O) => n(G, ...O), y;
    }, {}), i = fe(() => {
      const O = Ye(e), { modelValue: y } = O, G = k(O, ["modelValue"]), A = Object.entries(G).reduce((D, [z, Y]) => {
        const x = d(Y);
        return x !== void 0 && (D[z] = x), D;
      }, {});
      return C(C({}, u), Ze(C(C({}, l), A)));
    }), b = fe({
      get: () => e.modelValue,
      set: (y) => n("update:modelValue", y)
    }), m = ke(), w = qe(
      Te(e.target || m, b, i)
    );
    return o(w), () => {
      var y;
      return We(e.tag || "div", { ref: m }, (y = t == null ? void 0 : t.default) == null ? void 0 : y.call(t, w));
    };
  }
}), Ce = {
  mounted: "mounted",
  unmounted: "unmounted"
}, J = /* @__PURE__ */ new WeakMap(), It = {
  [Ce.mounted](e, t) {
    const n = Je(t.value) ? [t.value] : t.value, [o, l] = n, u = Te(e, o, l);
    J.set(e, u.destroy);
  },
  [Ce.unmounted](e) {
    var t;
    (t = J.get(e)) == null || t(), J.delete(e);
  }
};
export {
  Dt as VueDraggable,
  Te as useDraggable,
  It as vDraggable
};
