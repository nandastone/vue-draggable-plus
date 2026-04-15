var Me = Object.defineProperty, Be = Object.defineProperties;
var Re = Object.getOwnPropertyDescriptors;
var M = Object.getOwnPropertySymbols;
var se = Object.prototype.hasOwnProperty, ue = Object.prototype.propertyIsEnumerable;
var ie = (e, t, n) => t in e ? Me(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    se.call(t, n) && ie(e, n, t[n]);
  if (M)
    for (var n of M(t))
      ue.call(t, n) && ie(e, n, t[n]);
  return e;
}, ce = (e, t) => Be(e, Re(t));
var Y = (e, t) => {
  var n = {};
  for (var o in e)
    se.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && M)
    for (var o of M(e))
      t.indexOf(o) < 0 && ue.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as Oe, getCurrentInstance as te, unref as f, watch as Pe, onUnmounted as Ve, onMounted as Ue, nextTick as Ce, isRef as j, defineComponent as $e, computed as ae, toRefs as Fe, ref as Ye, reactive as je, h as ke, isProxy as ze } from "vue";
import L from "sortablejs";
const Ge = "[vue-draggable-plus]: ";
function qe(e) {
  console.warn(Ge + e);
}
function We(e) {
  console.error(Ge + e);
}
function de(e, t, n) {
  return n >= 0 && n < e.length && e.splice(n, 0, e.splice(t, 1)[0]), e;
}
function Je(e) {
  return e.replace(/-(\w)/g, (t, n) => n ? n.toUpperCase() : "");
}
function Ke(e) {
  return Object.keys(e).reduce((t, n) => (typeof e[n] != "undefined" && (t[Je(n)] = e[n]), t), {});
}
function fe(e, t) {
  return Array.isArray(e) && e.splice(t, 1), e;
}
function ge(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function Xe(e) {
  return typeof e == "undefined";
}
function Qe(e) {
  return typeof e == "string";
}
function pe(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function k(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function Ze(e, t = document) {
  var o;
  let n = null;
  return typeof (t == null ? void 0 : t.querySelector) == "function" ? n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, e) : n = document.querySelector(e), n || qe(`Element not found: ${e}`), n;
}
function et(e, t, n = null) {
  return function(...o) {
    return e.apply(n, o), t.apply(n, o);
  };
}
function tt(e, t) {
  const n = C({}, e);
  return Object.keys(t).forEach((o) => {
    n[o] ? n[o] = et(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function nt(e) {
  return e instanceof HTMLElement;
}
function me(e, t) {
  Object.keys(e).forEach((n) => {
    t(n, e[n]);
  });
}
function ot(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const rt = Object.assign, W = Symbol("cloneGhostOriginalHtml"), J = Symbol("cloneGhostOriginalWidth"), K = Symbol("cloneGhostOriginalHeight"), T = Symbol("cloneGhostAppliedBy"), X = Symbol("cloneGhostSticky");
function E() {
  return L.dragged;
}
function Q() {
  return L.ghost;
}
function Z(e, t = !1) {
  if (!e || !e[T] || !t && e[X])
    return;
  const n = e[W];
  typeof n == "string" && (e.innerHTML = n);
  const o = e[J];
  typeof o == "string" && (e.style.width = o);
  const l = e[K];
  typeof l == "string" && (e.style.height = l), e[W] = void 0, e[J] = void 0, e[K] = void 0, e[T] = void 0, e[X] = void 0;
}
function lt(e, t, n, o = !1) {
  const l = t();
  if (l) {
    if (e[W] = e.innerHTML, e[J] = e.style.width, e[K] = e.style.height, e.innerHTML = typeof l == "string" ? l : l.innerHTML, l instanceof HTMLElement) {
      const c = l.getBoundingClientRect();
      e.style.width = `${c.width}px`, e.style.height = `${c.height}px`;
    } else
      e.style.width = "", e.style.height = "";
    e[T] = n, e[X] = o;
  }
}
function z(e, t, n, o = !1) {
  e && e[T] !== n && (e[T] && Z(e, !0), lt(e, t, n, o));
}
function B(e = !1) {
  Z(E(), e), Z(Q(), e);
}
function P() {
}
P.prototype = {
  // With `cloneGhostOnStart`, apply the destination's preview to
  // Sortable.ghost at drag start so the cursor-follower reflects the drop
  // target from the first pixel of movement. Only applied to the ghost (not
  // dragEl) because dragEl is still in the source at this point and
  // swapping it would mutate the source item's visible markup. The apply is
  // marked sticky so `dragOverGlobal(isOwner)` and `revertGlobal` don't
  // restore it when the cursor passes back over the source.
  dragStartGlobal(e) {
    const t = e.sortable.options;
    if (!t.cloneGhost || !t.cloneGhostOnStart)
      return;
    const n = L.active;
    (n == null ? void 0 : n.el) !== e.sortable.el && z(Q(), t.cloneGhost, e.sortable.el, !0);
  },
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (z(E(), t, e.sortable.el), z(Q(), t, e.sortable.el));
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
    const e = E();
    B(), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    B(!0);
  },
  nullingGlobal() {
    B(!0);
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const R = /* @__PURE__ */ new Map();
let I = null;
function it(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function st() {
  if (I)
    return;
  const e = (t) => {
    const n = E();
    R.forEach(({ isDragOver: o, getOptions: l }, c) => {
      var h;
      const i = it(
        t.clientX,
        t.clientY,
        c.getBoundingClientRect()
      );
      if (o.value !== i) {
        o.value = i;
        const b = L.active;
        n && n.parentNode === c && (b == null ? void 0 : b.el) !== c && ((h = l()) != null && h.hideOnLeave) && (n.style.display = i ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), I = e;
}
function ut() {
  I && (document.removeEventListener("pointermove", I), I = null);
}
function ct() {
  R.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function at(e, t, n) {
  return R.set(e, { isDragOver: t, getOptions: n }), () => {
    R.delete(e);
  };
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    st();
  },
  nullingGlobal() {
    ut(), ct();
    const e = E();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "dragStateTracker";
V.initializeByDefault = !0;
const he = "sortable-dragging";
function U() {
}
U.prototype = {
  dragStartGlobal() {
    document.body.classList.add(he);
  },
  nullingGlobal() {
    document.body.classList.remove(he);
  }
};
U.pluginName = "bodyClass";
U.initializeByDefault = !0;
let ye = !1;
function dt() {
  ye || (ye = !0, L.mount(
    P,
    V,
    U
  ));
}
dt();
function ft(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function gt(e) {
  te() && Ve(e);
}
function pt(e) {
  te() ? Ue(e) : Ce(e);
}
let Le = null, Ae = null;
const we = Oe(null);
function be(e = null, t = null) {
  Le = e, Ae = t, we.value = t;
}
function mt() {
  return {
    data: Le,
    clonedData: Ae
  };
}
const Se = Symbol("cloneElement");
function De(...e) {
  var re, le;
  const t = (re = te()) == null ? void 0 : re.proxy;
  let n = null;
  const o = e[0];
  let [, l, c] = e;
  Array.isArray(f(l)) || (c = l, l = null);
  let i = null, h = null;
  const b = Oe(!1), {
    immediate: N = !0,
    clone: y = ft,
    forceFallback: G,
    fallbackOnBody: A,
    customUpdate: S
  } = (le = f(c)) != null ? le : {};
  function H(r) {
    var m;
    const { from: s, oldIndex: a, item: g } = r, u = Array.from(s.childNodes);
    n = G && !A ? u.slice(0, -1) : u;
    const d = f((m = f(l)) == null ? void 0 : m[a]), p = y(d);
    be(d, p), g[Se] = p;
  }
  function $(r) {
    const s = r.item[Se];
    if (!Xe(s)) {
      if (k(r.item), j(l)) {
        const a = [...f(l)];
        l.value = ge(a, r.newDraggableIndex, s);
        return;
      }
      ge(f(l), r.newDraggableIndex, s);
    }
  }
  function F(r) {
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, pullMode: d, clone: p } = r;
    if (pe(s, a, g), d === "clone") {
      k(p);
      return;
    }
    if (j(l)) {
      const m = [...f(l)];
      l.value = fe(m, u);
      return;
    }
    fe(f(l), u);
  }
  function _(r) {
    if (S) {
      S(r);
      return;
    }
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, newDraggableIndex: d } = r;
    if (k(a), pe(s, a, g), j(l)) {
      const p = [...f(l)];
      l.value = de(
        p,
        u,
        d
      );
      return;
    }
    de(f(l), u, d);
  }
  function Ie(r) {
    const { newIndex: s, oldIndex: a, from: g, to: u } = r;
    let d = null;
    const p = s === a && g === u;
    try {
      if (p) {
        let m = null;
        n == null || n.some((w, O) => {
          if (m && (n == null ? void 0 : n.length) !== u.childNodes.length)
            return g.insertBefore(m, w.nextSibling), !0;
          const x = u.childNodes[O];
          m = u == null ? void 0 : u.replaceChild(w, x);
        });
      }
    } catch (m) {
      d = m;
    } finally {
      n = null;
    }
    Ce(() => {
      if (be(), d)
        throw d;
    });
  }
  const Te = {
    onUpdate: _,
    onStart: H,
    onAdd: $,
    onRemove: F,
    onEnd: Ie
  };
  function Ee(r) {
    const s = f(o);
    return r || (r = Qe(s) ? Ze(s, t == null ? void 0 : t.$el) : s), r && !nt(r) && (r = r.$el), r || We("Root element not found"), r;
  }
  function ne() {
    var m;
    const w = (m = f(c)) != null ? m : {}, { immediate: r, clone: s } = w, a = Y(w, ["immediate", "clone"]);
    me(a, (O, x) => {
      ot(O) && (a[O] = (D, ..._e) => {
        const xe = mt();
        return rt(D, xe), x(D, ..._e);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const u = l === null ? {} : Te, d = tt(u, a), p = u.onAdd;
    return (g || p) && (d.onAdd = function(O) {
      var D;
      if (((D = O.item) == null ? void 0 : D.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, O)) !== !1 && (p == null || p.call(this, O));
    }), d;
  }
  const oe = (r) => {
    r = Ee(r), i && v.destroy(), i = new L(r, ne()), h = at(
      r,
      b,
      () => f(c)
    );
  };
  Pe(
    () => c,
    () => {
      i && me(ne(), (r, s) => {
        i == null || i.option(r, s);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, s) => i == null ? void 0 : i.option(r, s),
    destroy: () => {
      h == null || h(), h = null, i == null || i.destroy(), i = null;
    },
    save: () => i == null ? void 0 : i.save(),
    toArray: () => i == null ? void 0 : i.toArray(),
    closest: (...r) => i == null ? void 0 : i.closest(...r)
  }, Ne = () => v == null ? void 0 : v.option("disabled", !0), He = () => v == null ? void 0 : v.option("disabled", !1);
  return pt(() => {
    N && oe();
  }), gt(v.destroy), ce(C({
    start: oe,
    pause: Ne,
    resume: He
  }, v), {
    draggedData: we,
    isDragOver: b
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
], ht = [
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
], vt = $e({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: ht,
  emits: ["update:modelValue", ...ee],
  setup(e, { slots: t, emit: n, expose: o, attrs: l }) {
    const c = ee.reduce((y, G) => {
      const A = `on${G.replace(/^\S/, (S) => S.toUpperCase())}`;
      return y[A] = (...S) => n(G, ...S), y;
    }, {}), i = ae(() => {
      const S = Fe(e), { modelValue: y } = S, G = Y(S, ["modelValue"]), A = Object.entries(G).reduce((H, [$, F]) => {
        const _ = f(F);
        return _ !== void 0 && (H[$] = _), H;
      }, {});
      return C(C({}, c), Ke(C(C({}, l), A)));
    }), h = ae({
      get: () => e.modelValue,
      set: (y) => n("update:modelValue", y)
    }), b = Ye(), N = je(
      De(e.target || b, h, i)
    );
    return o(N), () => {
      var y;
      return ke(e.tag || "div", { ref: b }, (y = t == null ? void 0 : t.default) == null ? void 0 : y.call(t, N));
    };
  }
}), ve = {
  mounted: "mounted",
  unmounted: "unmounted"
}, q = /* @__PURE__ */ new WeakMap(), Ot = {
  [ve.mounted](e, t) {
    const n = ze(t.value) ? [t.value] : t.value, [o, l] = n, c = De(e, o, l);
    q.set(e, c.destroy);
  },
  [ve.unmounted](e) {
    var t;
    (t = q.get(e)) == null || t(), q.delete(e);
  }
};
export {
  vt as VueDraggable,
  De as useDraggable,
  Ot as vDraggable
};
