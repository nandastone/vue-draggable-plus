var _e = Object.defineProperty, Me = Object.defineProperties;
var Be = Object.getOwnPropertyDescriptors;
var M = Object.getOwnPropertySymbols;
var re = Object.prototype.hasOwnProperty, le = Object.prototype.propertyIsEnumerable;
var oe = (e, t, n) => t in e ? _e(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    re.call(t, n) && oe(e, n, t[n]);
  if (M)
    for (var n of M(t))
      le.call(t, n) && oe(e, n, t[n]);
  return e;
}, ie = (e, t) => Me(e, Be(t));
var j = (e, t) => {
  var n = {};
  for (var o in e)
    re.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && M)
    for (var o of M(e))
      t.indexOf(o) < 0 && le.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as ve, getCurrentInstance as Q, unref as d, watch as Re, onUnmounted as Pe, onMounted as Ve, nextTick as Se, isRef as z, defineComponent as Ue, computed as se, toRefs as $e, ref as Fe, reactive as je, h as ze, isProxy as Ye } from "vue";
import E from "sortablejs";
const Oe = "[vue-draggable-plus]: ";
function ke(e) {
  console.warn(Oe + e);
}
function qe(e) {
  console.error(Oe + e);
}
function ue(e, t, n) {
  return n >= 0 && n < e.length && e.splice(n, 0, e.splice(t, 1)[0]), e;
}
function We(e) {
  return e.replace(/-(\w)/g, (t, n) => n ? n.toUpperCase() : "");
}
function Je(e) {
  return Object.keys(e).reduce((t, n) => (typeof e[n] != "undefined" && (t[We(n)] = e[n]), t), {});
}
function ce(e, t) {
  return Array.isArray(e) && e.splice(t, 1), e;
}
function ae(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function Xe(e) {
  return typeof e == "undefined";
}
function Ke(e) {
  return typeof e == "string";
}
function de(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function Y(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function Qe(e, t = document) {
  var o;
  let n = null;
  return typeof (t == null ? void 0 : t.querySelector) == "function" ? n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, e) : n = document.querySelector(e), n || ke(`Element not found: ${e}`), n;
}
function Ze(e, t, n = null) {
  return function(...o) {
    return e.apply(n, o), t.apply(n, o);
  };
}
function et(e, t) {
  const n = C({}, e);
  return Object.keys(t).forEach((o) => {
    n[o] ? n[o] = Ze(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function tt(e) {
  return e instanceof HTMLElement;
}
function fe(e, t) {
  Object.keys(e).forEach((n) => {
    t(n, e[n]);
  });
}
function nt(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const ot = Object.assign, q = Symbol("cloneGhostOriginalHtml"), W = Symbol("cloneGhostOriginalWidth"), J = Symbol("cloneGhostOriginalHeight"), I = Symbol("cloneGhostAppliedBy");
function T() {
  return E.dragged;
}
function Ce() {
  return E.ghost;
}
function X(e) {
  if (!e || !e[I])
    return;
  const t = e[q];
  typeof t == "string" && (e.innerHTML = t);
  const n = e[W];
  typeof n == "string" && (e.style.width = n);
  const o = e[J];
  typeof o == "string" && (e.style.height = o), e[q] = void 0, e[W] = void 0, e[J] = void 0, e[I] = void 0;
}
function rt(e, t, n) {
  const o = t();
  if (o) {
    if (e[q] = e.innerHTML, e[W] = e.style.width, e[J] = e.style.height, e.innerHTML = typeof o == "string" ? o : o.innerHTML, o instanceof HTMLElement) {
      const i = o.getBoundingClientRect();
      e.style.width = `${i.width}px`, e.style.height = `${i.height}px`;
    } else
      e.style.width = "", e.style.height = "";
    e[I] = n;
  }
}
function ge(e, t, n) {
  e && e[I] !== n && (e[I] && X(e), rt(e, t, n));
}
function B() {
  X(T()), X(Ce());
}
function P() {
}
P.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (ge(T(), t, e.sortable.el), ge(Ce(), t, e.sortable.el));
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
    const e = T();
    B(), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    B();
  },
  nullingGlobal() {
    B();
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const R = /* @__PURE__ */ new Map();
let G = null;
function lt(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function it() {
  if (G)
    return;
  const e = (t) => {
    const n = T();
    R.forEach(({ isDragOver: o, getOptions: i }, f) => {
      var h;
      const l = lt(
        t.clientX,
        t.clientY,
        f.getBoundingClientRect()
      );
      if (o.value !== l) {
        o.value = l;
        const b = E.active;
        n && n.parentNode === f && (b == null ? void 0 : b.el) !== f && ((h = i()) != null && h.hideOnLeave) && (n.style.display = l ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), G = e;
}
function st() {
  G && (document.removeEventListener("pointermove", G), G = null);
}
function ut() {
  R.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function ct(e, t, n) {
  return R.set(e, { isDragOver: t, getOptions: n }), () => {
    R.delete(e);
  };
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    it();
  },
  nullingGlobal() {
    st(), ut();
    const e = T();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "dragStateTracker";
V.initializeByDefault = !0;
const pe = "sortable-dragging";
function U() {
}
U.prototype = {
  dragStartGlobal() {
    document.body.classList.add(pe);
  },
  nullingGlobal() {
    document.body.classList.remove(pe);
  }
};
U.pluginName = "bodyClass";
U.initializeByDefault = !0;
let me = !1;
function at() {
  me || (me = !0, E.mount(
    P,
    V,
    U
  ));
}
at();
function dt(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function ft(e) {
  Q() && Pe(e);
}
function gt(e) {
  Q() ? Ve(e) : Se(e);
}
let Ae = null, Le = null;
const we = ve(null);
function he(e = null, t = null) {
  Ae = e, Le = t, we.value = t;
}
function pt() {
  return {
    data: Ae,
    clonedData: Le
  };
}
const ye = Symbol("cloneElement");
function De(...e) {
  var te, ne;
  const t = (te = Q()) == null ? void 0 : te.proxy;
  let n = null;
  const o = e[0];
  let [, i, f] = e;
  Array.isArray(d(i)) || (f = i, i = null);
  let l = null, h = null;
  const b = ve(!1), {
    immediate: N = !0,
    clone: y = dt,
    forceFallback: A,
    fallbackOnBody: L,
    customUpdate: v
  } = (ne = d(f)) != null ? ne : {};
  function H(r) {
    var m;
    const { from: s, oldIndex: c, item: g } = r, u = Array.from(s.childNodes);
    n = A && !L ? u.slice(0, -1) : u;
    const a = d((m = d(i)) == null ? void 0 : m[c]), p = y(a);
    he(a, p), g[ye] = p;
  }
  function $(r) {
    const s = r.item[ye];
    if (!Xe(s)) {
      if (Y(r.item), z(i)) {
        const c = [...d(i)];
        i.value = ae(c, r.newDraggableIndex, s);
        return;
      }
      ae(d(i), r.newDraggableIndex, s);
    }
  }
  function F(r) {
    const { from: s, item: c, oldIndex: g, oldDraggableIndex: u, pullMode: a, clone: p } = r;
    if (de(s, c, g), a === "clone") {
      Y(p);
      return;
    }
    if (z(i)) {
      const m = [...d(i)];
      i.value = ce(m, u);
      return;
    }
    ce(d(i), u);
  }
  function x(r) {
    if (v) {
      v(r);
      return;
    }
    const { from: s, item: c, oldIndex: g, oldDraggableIndex: u, newDraggableIndex: a } = r;
    if (Y(c), de(s, c, g), z(i)) {
      const p = [...d(i)];
      i.value = ue(
        p,
        u,
        a
      );
      return;
    }
    ue(d(i), u, a);
  }
  function Ge(r) {
    const { newIndex: s, oldIndex: c, from: g, to: u } = r;
    let a = null;
    const p = s === c && g === u;
    try {
      if (p) {
        let m = null;
        n == null || n.some((w, O) => {
          if (m && (n == null ? void 0 : n.length) !== u.childNodes.length)
            return g.insertBefore(m, w.nextSibling), !0;
          const _ = u.childNodes[O];
          m = u == null ? void 0 : u.replaceChild(w, _);
        });
      }
    } catch (m) {
      a = m;
    } finally {
      n = null;
    }
    Se(() => {
      if (he(), a)
        throw a;
    });
  }
  const Ie = {
    onUpdate: x,
    onStart: H,
    onAdd: $,
    onRemove: F,
    onEnd: Ge
  };
  function Te(r) {
    const s = d(o);
    return r || (r = Ke(s) ? Qe(s, t == null ? void 0 : t.$el) : s), r && !tt(r) && (r = r.$el), r || qe("Root element not found"), r;
  }
  function Z() {
    var m;
    const w = (m = d(f)) != null ? m : {}, { immediate: r, clone: s } = w, c = j(w, ["immediate", "clone"]);
    fe(c, (O, _) => {
      nt(O) && (c[O] = (D, ...He) => {
        const xe = pt();
        return ot(D, xe), _(D, ...He);
      });
    });
    const g = c.onAdd;
    delete c.onAdd;
    const u = i === null ? {} : Ie, a = et(u, c), p = u.onAdd;
    return (g || p) && (a.onAdd = function(O) {
      var D;
      if (((D = O.item) == null ? void 0 : D.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, O)) !== !1 && (p == null || p.call(this, O));
    }), a;
  }
  const ee = (r) => {
    r = Te(r), l && S.destroy(), l = new E(r, Z()), h = ct(
      r,
      b,
      () => d(f)
    );
  };
  Re(
    () => f,
    () => {
      l && fe(Z(), (r, s) => {
        l == null || l.option(r, s);
      });
    },
    { deep: !0 }
  );
  const S = {
    option: (r, s) => l == null ? void 0 : l.option(r, s),
    destroy: () => {
      h == null || h(), h = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Ee = () => S == null ? void 0 : S.option("disabled", !0), Ne = () => S == null ? void 0 : S.option("disabled", !1);
  return gt(() => {
    N && ee();
  }), ft(S.destroy), ie(C({
    start: ee,
    pause: Ee,
    resume: Ne
  }, S), {
    draggedData: we,
    isDragOver: b
  });
}
const K = [
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
], mt = [
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
  ...K.map((e) => `on${e.replace(/^\S/, (t) => t.toUpperCase())}`)
], vt = Ue({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: mt,
  emits: ["update:modelValue", ...K],
  setup(e, { slots: t, emit: n, expose: o, attrs: i }) {
    const f = K.reduce((y, A) => {
      const L = `on${A.replace(/^\S/, (v) => v.toUpperCase())}`;
      return y[L] = (...v) => n(A, ...v), y;
    }, {}), l = se(() => {
      const v = $e(e), { modelValue: y } = v, A = j(v, ["modelValue"]), L = Object.entries(A).reduce((H, [$, F]) => {
        const x = d(F);
        return x !== void 0 && (H[$] = x), H;
      }, {});
      return C(C({}, f), Je(C(C({}, i), L)));
    }), h = se({
      get: () => e.modelValue,
      set: (y) => n("update:modelValue", y)
    }), b = Fe(), N = je(
      De(e.target || b, h, l)
    );
    return o(N), () => {
      var y;
      return ze(e.tag || "div", { ref: b }, (y = t == null ? void 0 : t.default) == null ? void 0 : y.call(t, N));
    };
  }
}), be = {
  mounted: "mounted",
  unmounted: "unmounted"
}, k = /* @__PURE__ */ new WeakMap(), St = {
  [be.mounted](e, t) {
    const n = Ye(t.value) ? [t.value] : t.value, [o, i] = n, f = De(e, o, i);
    k.set(e, f.destroy);
  },
  [be.unmounted](e) {
    var t;
    (t = k.get(e)) == null || t(), k.delete(e);
  }
};
export {
  vt as VueDraggable,
  De as useDraggable,
  St as vDraggable
};
