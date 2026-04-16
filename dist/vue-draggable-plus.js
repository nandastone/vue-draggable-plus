var Be = Object.defineProperty, Pe = Object.defineProperties;
var Ve = Object.getOwnPropertyDescriptors;
var _ = Object.getOwnPropertySymbols;
var ue = Object.prototype.hasOwnProperty, ce = Object.prototype.propertyIsEnumerable;
var se = (e, t, n) => t in e ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    ue.call(t, n) && se(e, n, t[n]);
  if (_)
    for (var n of _(t))
      ce.call(t, n) && se(e, n, t[n]);
  return e;
}, ae = (e, t) => Pe(e, Ve(t));
var j = (e, t) => {
  var n = {};
  for (var o in e)
    ue.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && _)
    for (var o of _(e))
      t.indexOf(o) < 0 && ce.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as Ce, getCurrentInstance as te, unref as d, watch as Ue, onUnmounted as $e, onMounted as Fe, nextTick as we, isRef as z, defineComponent as je, computed as de, toRefs as ze, ref as Ye, reactive as ke, h as qe, isProxy as We } from "vue";
import H from "sortablejs";
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
function he(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function Ze(e) {
  return typeof e == "undefined";
}
function et(e) {
  return typeof e == "string";
}
function pe(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function Y(e) {
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
const lt = Object.assign, q = Symbol("cloneGhostOriginalHtml"), W = Symbol("cloneGhostOriginalWidth"), J = Symbol("cloneGhostOriginalHeight"), E = Symbol("cloneGhostAppliedBy");
function M() {
  return H.dragged;
}
function ne() {
  return H.ghost;
}
function X(e) {
  if (!e || !e[E])
    return;
  const t = e[q];
  typeof t == "string" && (e.innerHTML = t);
  const n = e[W];
  typeof n == "string" && (e.style.width = n);
  const o = e[J];
  typeof o == "string" && (e.style.height = o), e[q] = void 0, e[W] = void 0, e[J] = void 0, e[E] = void 0;
}
function st(e, t, n) {
  const o = t();
  if (o) {
    if (e[q] = e.innerHTML, e[W] = e.style.width, e[J] = e.style.height, e.innerHTML = typeof o == "string" ? o : o.innerHTML, o instanceof HTMLElement) {
      const i = o.getBoundingClientRect();
      e.style.width = `${i.width}px`, e.style.height = `${i.height}px`;
    } else
      e.style.width = "", e.style.height = "";
    e[E] = n;
  }
}
function K(e, t, n) {
  e && e[E] !== n && (e[E] && X(e), st(e, t, n));
}
function R() {
  X(M()), X(ne());
}
const Q = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map();
function ut(e, t) {
  return Q.set(e, t), () => {
    Q.delete(e);
  };
}
function ct(e) {
  const t = ne();
  t && Q.forEach((n, o) => {
    if (o === e)
      return;
    const i = n();
    if (!i || (K(t, () => i, o), !(i instanceof HTMLElement)))
      return;
    const c = new MutationObserver(() => {
      t.innerHTML = i.innerHTML;
      const l = i.getBoundingClientRect();
      t.style.width = `${l.width}px`, t.style.height = `${l.height}px`;
    });
    c.observe(i, { childList: !0, subtree: !0 }), Z.set(o, c);
  });
}
function at() {
  Z.forEach((e) => e.disconnect()), Z.clear();
}
function P() {
}
P.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (K(M(), t, e.sortable.el), K(ne(), t, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && R();
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = M();
    R(), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    R();
  },
  nullingGlobal() {
    R(), at();
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const B = /* @__PURE__ */ new Map();
let I = null;
function dt(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function ft() {
  if (I)
    return;
  const e = (t) => {
    const n = M();
    B.forEach(({ isDragOver: o, getOptions: i }, c) => {
      var y;
      const l = dt(
        t.clientX,
        t.clientY,
        c.getBoundingClientRect()
      );
      if (o.value !== l) {
        o.value = l;
        const m = H.active;
        n && n.parentNode === c && (m == null ? void 0 : m.el) !== c && ((y = i()) != null && y.hideOnLeave) && (n.style.display = l ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), I = e;
}
function gt() {
  I && (document.removeEventListener("pointermove", I), I = null);
}
function ht() {
  B.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function pt(e, t, n) {
  return B.set(e, { isDragOver: t, getOptions: n }), () => {
    B.delete(e);
  };
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    ft();
  },
  nullingGlobal() {
    gt(), ht();
    const e = M();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "dragStateTracker";
V.initializeByDefault = !0;
const ye = "sortable-dragging";
function U() {
}
U.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ye);
  },
  nullingGlobal() {
    document.body.classList.remove(ye);
  }
};
U.pluginName = "bodyClass";
U.initializeByDefault = !0;
let be = !1;
function mt() {
  be || (be = !0, H.mount(
    P,
    V,
    U
  ));
}
mt();
function yt(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function bt(e) {
  te() && $e(e);
}
function vt(e) {
  te() ? Fe(e) : we(e);
}
let Le = null, Ae = null;
const Te = Ce(null);
function ve(e = null, t = null) {
  Le = e, Ae = t, Te.value = t;
}
function Ot() {
  return {
    data: Le,
    clonedData: Ae
  };
}
const Oe = Symbol("cloneElement");
function De(...e) {
  var ie, le;
  const t = (ie = te()) == null ? void 0 : ie.proxy;
  let n = null;
  const o = e[0];
  let [, i, c] = e;
  Array.isArray(d(i)) || (c = i, i = null);
  let l = null, y = null, m = null;
  const G = Ce(!1), {
    immediate: b = !0,
    clone: w = yt,
    forceFallback: L,
    fallbackOnBody: O,
    customUpdate: A
  } = (le = d(c)) != null ? le : {};
  function $(r) {
    var p;
    const { from: s, oldIndex: a, item: g } = r, u = Array.from(s.childNodes);
    n = L && !O ? u.slice(0, -1) : u;
    const f = d((p = d(i)) == null ? void 0 : p[a]), h = w(f);
    ve(f, h), g[Oe] = h, ct(s);
  }
  function F(r) {
    const s = r.item[Oe];
    if (!Ze(s)) {
      if (Y(r.item), z(i)) {
        const a = [...d(i)];
        i.value = he(a, r.newDraggableIndex, s);
        return;
      }
      he(d(i), r.newDraggableIndex, s);
    }
  }
  function x(r) {
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, pullMode: f, clone: h } = r;
    if (pe(s, a, g), f === "clone") {
      Y(h);
      return;
    }
    if (z(i)) {
      const p = [...d(i)];
      i.value = ge(p, u);
      return;
    }
    ge(d(i), u);
  }
  function Ie(r) {
    if (A) {
      A(r);
      return;
    }
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, newDraggableIndex: f } = r;
    if (Y(a), pe(s, a, g), z(i)) {
      const h = [...d(i)];
      i.value = fe(
        h,
        u,
        f
      );
      return;
    }
    fe(d(i), u, f);
  }
  function Ee(r) {
    const { newIndex: s, oldIndex: a, from: g, to: u } = r;
    let f = null;
    const h = s === a && g === u;
    try {
      if (h) {
        let p = null;
        n == null || n.some((T, S) => {
          if (p && (n == null ? void 0 : n.length) !== u.childNodes.length)
            return g.insertBefore(p, T.nextSibling), !0;
          const N = u.childNodes[S];
          p = u == null ? void 0 : u.replaceChild(T, N);
        });
      }
    } catch (p) {
      f = p;
    } finally {
      n = null;
    }
    we(() => {
      if (ve(), f)
        throw f;
    });
  }
  const Me = {
    onUpdate: Ie,
    onStart: $,
    onAdd: F,
    onRemove: x,
    onEnd: Ee
  };
  function He(r) {
    const s = d(o);
    return r || (r = et(s) ? tt(s, t == null ? void 0 : t.$el) : s), r && !rt(r) && (r = r.$el), r || Xe("Root element not found"), r;
  }
  function oe() {
    var p;
    const T = (p = d(c)) != null ? p : {}, { immediate: r, clone: s } = T, a = j(T, ["immediate", "clone"]);
    me(a, (S, N) => {
      it(S) && (a[S] = (D, ..._e) => {
        const Re = Ot();
        return lt(D, Re), N(D, ..._e);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const u = i === null ? {} : Me, f = ot(u, a), h = u.onAdd;
    return (g || h) && (f.onAdd = function(S) {
      var D;
      if (((D = S.item) == null ? void 0 : D.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, S)) !== !1 && (h == null || h.call(this, S));
    }), f;
  }
  const re = (r) => {
    r = He(r), l && v.destroy(), l = new H(r, oe()), y = pt(
      r,
      G,
      () => d(c)
    );
    const s = d(c);
    s != null && s.cloneGhost && s.cloneGhostOnStart && (m = ut(
      r,
      s.cloneGhost
    ));
  };
  Ue(
    () => c,
    () => {
      l && me(oe(), (r, s) => {
        l == null || l.option(r, s);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, s) => l == null ? void 0 : l.option(r, s),
    destroy: () => {
      y == null || y(), y = null, m == null || m(), m = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, xe = () => v == null ? void 0 : v.option("disabled", !0), Ne = () => v == null ? void 0 : v.option("disabled", !1);
  return vt(() => {
    b && re();
  }), bt(v.destroy), ae(C({
    start: re,
    pause: xe,
    resume: Ne
  }, v), {
    draggedData: Te,
    isDragOver: G
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
], Lt = je({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: St,
  emits: ["update:modelValue", ...ee],
  setup(e, { slots: t, emit: n, expose: o, attrs: i }) {
    const c = ee.reduce((b, w) => {
      const L = `on${w.replace(/^\S/, (O) => O.toUpperCase())}`;
      return b[L] = (...O) => n(w, ...O), b;
    }, {}), l = de(() => {
      const O = ze(e), { modelValue: b } = O, w = j(O, ["modelValue"]), L = Object.entries(w).reduce((A, [$, F]) => {
        const x = d(F);
        return x !== void 0 && (A[$] = x), A;
      }, {});
      return C(C({}, c), Qe(C(C({}, i), L)));
    }), y = de({
      get: () => e.modelValue,
      set: (b) => n("update:modelValue", b)
    }), m = Ye(), G = ke(
      De(e.target || m, y, l)
    );
    return o(G), () => {
      var b;
      return qe(e.tag || "div", { ref: m }, (b = t == null ? void 0 : t.default) == null ? void 0 : b.call(t, G));
    };
  }
}), Se = {
  mounted: "mounted",
  unmounted: "unmounted"
}, k = /* @__PURE__ */ new WeakMap(), At = {
  [Se.mounted](e, t) {
    const n = We(t.value) ? [t.value] : t.value, [o, i] = n, c = De(e, o, i);
    k.set(e, c.destroy);
  },
  [Se.unmounted](e) {
    var t;
    (t = k.get(e)) == null || t(), k.delete(e);
  }
};
export {
  Lt as VueDraggable,
  De as useDraggable,
  At as vDraggable
};
