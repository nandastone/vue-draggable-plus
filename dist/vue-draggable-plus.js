var Be = Object.defineProperty, Pe = Object.defineProperties;
var Ve = Object.getOwnPropertyDescriptors;
var R = Object.getOwnPropertySymbols;
var ue = Object.prototype.hasOwnProperty, ce = Object.prototype.propertyIsEnumerable;
var se = (e, t, n) => t in e ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    ue.call(t, n) && se(e, n, t[n]);
  if (R)
    for (var n of R(t))
      ce.call(t, n) && se(e, n, t[n]);
  return e;
}, ae = (e, t) => Pe(e, Ve(t));
var z = (e, t) => {
  var n = {};
  for (var o in e)
    ue.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && R)
    for (var o of R(e))
      t.indexOf(o) < 0 && ce.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as Ce, getCurrentInstance as te, unref as d, watch as Ue, onUnmounted as Fe, onMounted as $e, nextTick as W, isRef as Y, defineComponent as je, computed as de, toRefs as ze, ref as Ye, reactive as ke, h as qe, isProxy as We } from "vue";
import N from "sortablejs";
const Ge = "[vue-draggable-plus]: ";
function Je(e) {
  console.warn(Ge + e);
}
function Xe(e) {
  console.error(Ge + e);
}
function fe(e, t, n) {
  return n >= 0 && n < e.length && e.splice(n, 0, e.splice(t, 1)[0]), e;
}
function Ke(e) {
  return e.replace(/-(\w)/g, (t, n) => n ? n.toUpperCase() : "");
}
function Qe(e) {
  return Object.keys(e).reduce((t, n) => (typeof e[n] != "undefined" && (t[Ke(n)] = e[n]), t), {});
}
function ge(e, t) {
  return Array.isArray(e) && e.splice(t, 1), e;
}
function pe(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function Ze(e) {
  return typeof e == "undefined";
}
function et(e) {
  return typeof e == "string";
}
function he(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function k(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function tt(e, t = document) {
  var o;
  let n = null;
  return typeof (t == null ? void 0 : t.querySelector) == "function" ? n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, e) : n = document.querySelector(e), n || Je(`Element not found: ${e}`), n;
}
function nt(e, t, n = null) {
  return function(...o) {
    return e.apply(n, o), t.apply(n, o);
  };
}
function ot(e, t) {
  const n = C({}, e);
  return Object.keys(t).forEach((o) => {
    n[o] ? n[o] = nt(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function rt(e) {
  return e instanceof HTMLElement;
}
function me(e, t) {
  Object.keys(e).forEach((n) => {
    t(n, e[n]);
  });
}
function it(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const lt = Object.assign, J = Symbol("cloneGhostOriginalHtml"), X = Symbol("cloneGhostOriginalWidth"), K = Symbol("cloneGhostOriginalHeight"), H = Symbol("cloneGhostAppliedBy");
function M() {
  return N.dragged;
}
function ne() {
  return N.ghost;
}
function Q(e) {
  if (!e || !e[H])
    return;
  const t = e[J];
  typeof t == "string" && (e.innerHTML = t);
  const n = e[X];
  typeof n == "string" && (e.style.width = n);
  const o = e[K];
  typeof o == "string" && (e.style.height = o), e[J] = void 0, e[X] = void 0, e[K] = void 0, e[H] = void 0;
}
function Le(e, t) {
  e.innerHTML = t.innerHTML;
  const n = t.getBoundingClientRect();
  e.style.width = `${n.width}px`, e.style.height = `${n.height}px`;
}
function st(e, t, n) {
  const o = t();
  o && (e[J] = e.innerHTML, e[X] = e.style.width, e[K] = e.style.height, o instanceof HTMLElement ? Le(e, o) : (e.innerHTML = o, e.style.width = "", e.style.height = ""), e[H] = n);
}
function Z(e, t, n) {
  e && e[H] !== n && (e[H] && Q(e), st(e, t, n));
}
function B() {
  Q(M()), Q(ne());
}
const T = /* @__PURE__ */ new Map();
function ut(e, t) {
  return T.set(e, { getFactory: t, observer: null }), () => {
    var o;
    const n = T.get(e);
    (o = n == null ? void 0 : n.observer) == null || o.disconnect(), T.delete(e);
  };
}
function ct(e) {
  const t = ne();
  t && T.forEach((n, o) => {
    var i;
    if (o === e)
      return;
    const l = n.getFactory();
    if (!l)
      return;
    const u = l();
    u && (Z(t, () => u, o), u instanceof HTMLElement && ((i = n.observer) == null || i.disconnect(), n.observer = new MutationObserver(
      () => Le(t, u)
    ), n.observer.observe(u, { childList: !0, subtree: !0 })));
  });
}
function at() {
  T.forEach((e) => {
    var t;
    (t = e.observer) == null || t.disconnect(), e.observer = null;
  });
}
function V() {
}
V.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (Z(M(), t, e.sortable.el), Z(ne(), t, e.sortable.el));
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
    B(), at();
  }
};
V.pluginName = "cloneGhost";
V.initializeByDefault = !0;
const P = /* @__PURE__ */ new Map();
let E = null;
function dt(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function ft() {
  if (E)
    return;
  const e = (t) => {
    const n = M();
    P.forEach(({ isDragOver: o, getOptions: l }, u) => {
      var b;
      const i = dt(
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
function gt() {
  E && (document.removeEventListener("pointermove", E), E = null);
}
function pt() {
  P.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function ht(e, t, n) {
  return P.set(e, { isDragOver: t, getOptions: n }), () => {
    P.delete(e);
  };
}
function U() {
}
U.prototype = {
  dragStartGlobal() {
    ft();
  },
  nullingGlobal() {
    gt(), pt();
    const e = M();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
U.pluginName = "dragStateTracker";
U.initializeByDefault = !0;
const be = "sortable-dragging";
function F() {
}
F.prototype = {
  dragStartGlobal() {
    document.body.classList.add(be);
  },
  nullingGlobal() {
    document.body.classList.remove(be);
  }
};
F.pluginName = "bodyClass";
F.initializeByDefault = !0;
let ye = !1;
function mt() {
  ye || (ye = !0, N.mount(
    V,
    U,
    F
  ));
}
mt();
function bt(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function yt(e) {
  te() && Fe(e);
}
function vt(e) {
  te() ? $e(e) : W(e);
}
let we = null, Ae = null;
const De = Ce(null);
function ve(e = null, t = null) {
  we = e, Ae = t, De.value = t;
}
function Ot() {
  return {
    data: we,
    clonedData: Ae
  };
}
const Oe = Symbol("cloneElement");
function Ie(...e) {
  var ie, le;
  const t = (ie = te()) == null ? void 0 : ie.proxy;
  let n = null;
  const o = e[0];
  let [, l, u] = e;
  Array.isArray(d(l)) || (u = l, l = null);
  let i = null, b = null, m = null;
  const L = Ce(!1), {
    immediate: y = !0,
    clone: G = bt,
    forceFallback: w,
    fallbackOnBody: O,
    customUpdate: A
  } = (le = d(u)) != null ? le : {};
  function $(r) {
    var h;
    const { from: s, oldIndex: a, item: g } = r, c = Array.from(s.childNodes);
    n = w && !O ? c.slice(0, -1) : c;
    const f = d((h = d(l)) == null ? void 0 : h[a]), p = G(f);
    ve(f, p), g[Oe] = p, W(() => ct(s));
  }
  function j(r) {
    const s = r.item[Oe];
    if (!Ze(s)) {
      if (k(r.item), Y(l)) {
        const a = [...d(l)];
        l.value = pe(a, r.newDraggableIndex, s);
        return;
      }
      pe(d(l), r.newDraggableIndex, s);
    }
  }
  function x(r) {
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: c, pullMode: f, clone: p } = r;
    if (he(s, a, g), f === "clone") {
      k(p);
      return;
    }
    if (Y(l)) {
      const h = [...d(l)];
      l.value = ge(h, c);
      return;
    }
    ge(d(l), c);
  }
  function Te(r) {
    if (A) {
      A(r);
      return;
    }
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: c, newDraggableIndex: f } = r;
    if (k(a), he(s, a, g), Y(l)) {
      const p = [...d(l)];
      l.value = fe(
        p,
        c,
        f
      );
      return;
    }
    fe(d(l), c, f);
  }
  function Ee(r) {
    const { newIndex: s, oldIndex: a, from: g, to: c } = r;
    let f = null;
    const p = s === a && g === c;
    try {
      if (p) {
        let h = null;
        n == null || n.some((D, S) => {
          if (h && (n == null ? void 0 : n.length) !== c.childNodes.length)
            return g.insertBefore(h, D.nextSibling), !0;
          const _ = c.childNodes[S];
          h = c == null ? void 0 : c.replaceChild(D, _);
        });
      }
    } catch (h) {
      f = h;
    } finally {
      n = null;
    }
    W(() => {
      if (ve(), f)
        throw f;
    });
  }
  const He = {
    onUpdate: Te,
    onStart: $,
    onAdd: j,
    onRemove: x,
    onEnd: Ee
  };
  function Me(r) {
    const s = d(o);
    return r || (r = et(s) ? tt(s, t == null ? void 0 : t.$el) : s), r && !rt(r) && (r = r.$el), r || Xe("Root element not found"), r;
  }
  function oe() {
    var h;
    const D = (h = d(u)) != null ? h : {}, { immediate: r, clone: s } = D, a = z(D, ["immediate", "clone"]);
    me(a, (S, _) => {
      it(S) && (a[S] = (I, ..._e) => {
        const Re = Ot();
        return lt(I, Re), _(I, ..._e);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const c = l === null ? {} : He, f = ot(c, a), p = c.onAdd;
    return (g || p) && (f.onAdd = function(S) {
      var I;
      if (((I = S.item) == null ? void 0 : I.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, S)) !== !1 && (p == null || p.call(this, S));
    }), f;
  }
  const re = (r) => {
    r = Me(r), i && v.destroy(), i = new N(r, oe()), b = ht(
      r,
      L,
      () => d(u)
    ), m = ut(
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
      i && me(oe(), (r, s) => {
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
  }, Ne = () => v == null ? void 0 : v.option("disabled", !0), xe = () => v == null ? void 0 : v.option("disabled", !1);
  return vt(() => {
    y && re();
  }), yt(v.destroy), ae(C({
    start: re,
    pause: Ne,
    resume: xe
  }, v), {
    draggedData: De,
    isDragOver: L
  });
}
const ee = [
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
], St = [
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
  ...ee.map((e) => `on${e.replace(/^\S/, (t) => t.toUpperCase())}`)
], wt = je({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: St,
  emits: ["update:modelValue", ...ee],
  setup(e, { slots: t, emit: n, expose: o, attrs: l }) {
    const u = ee.reduce((y, G) => {
      const w = `on${G.replace(/^\S/, (O) => O.toUpperCase())}`;
      return y[w] = (...O) => n(G, ...O), y;
    }, {}), i = de(() => {
      const O = ze(e), { modelValue: y } = O, G = z(O, ["modelValue"]), w = Object.entries(G).reduce((A, [$, j]) => {
        const x = d(j);
        return x !== void 0 && (A[$] = x), A;
      }, {});
      return C(C({}, u), Qe(C(C({}, l), w)));
    }), b = de({
      get: () => e.modelValue,
      set: (y) => n("update:modelValue", y)
    }), m = Ye(), L = ke(
      Ie(e.target || m, b, i)
    );
    return o(L), () => {
      var y;
      return qe(e.tag || "div", { ref: m }, (y = t == null ? void 0 : t.default) == null ? void 0 : y.call(t, L));
    };
  }
}), Se = {
  mounted: "mounted",
  unmounted: "unmounted"
}, q = /* @__PURE__ */ new WeakMap(), At = {
  [Se.mounted](e, t) {
    const n = We(t.value) ? [t.value] : t.value, [o, l] = n, u = Ie(e, o, l);
    q.set(e, u.destroy);
  },
  [Se.unmounted](e) {
    var t;
    (t = q.get(e)) == null || t(), q.delete(e);
  }
};
export {
  wt as VueDraggable,
  Ie as useDraggable,
  At as vDraggable
};
