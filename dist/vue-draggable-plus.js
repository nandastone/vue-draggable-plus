var Ue = Object.defineProperty, $e = Object.defineProperties;
var Ye = Object.getOwnPropertyDescriptors;
var R = Object.getOwnPropertySymbols;
var de = Object.prototype.hasOwnProperty, fe = Object.prototype.propertyIsEnumerable;
var ae = (e, t, n) => t in e ? Ue(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t) => {
  for (var n in t || (t = {}))
    de.call(t, n) && ae(e, n, t[n]);
  if (R)
    for (var n of R(t))
      fe.call(t, n) && ae(e, n, t[n]);
  return e;
}, ge = (e, t) => $e(e, Ye(t));
var q = (e, t) => {
  var n = {};
  for (var o in e)
    de.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && R)
    for (var o of R(e))
      t.indexOf(o) < 0 && fe.call(e, o) && (n[o] = e[o]);
  return n;
};
import { shallowRef as Ae, getCurrentInstance as le, unref as d, watch as je, onUnmounted as ke, onMounted as ze, nextTick as Q, isRef as W, defineComponent as qe, computed as pe, toRefs as We, ref as Je, reactive as Xe, h as Ke, isProxy as Qe } from "vue";
import M from "sortablejs";
const Ee = "[vue-draggable-plus]: ";
function Ze(e) {
  console.warn(Ee + e);
}
function et(e) {
  console.error(Ee + e);
}
function me(e, t, n) {
  return n >= 0 && n < e.length && e.splice(n, 0, e.splice(t, 1)[0]), e;
}
function tt(e) {
  return e.replace(/-(\w)/g, (t, n) => n ? n.toUpperCase() : "");
}
function nt(e) {
  return Object.keys(e).reduce((t, n) => (typeof e[n] != "undefined" && (t[tt(n)] = e[n]), t), {});
}
function he(e, t) {
  return Array.isArray(e) && e.splice(t, 1), e;
}
function be(e, t, n) {
  return Array.isArray(e) && e.splice(t, 0, n), e;
}
function ot(e) {
  return typeof e == "undefined";
}
function rt(e) {
  return typeof e == "string";
}
function ye(e, t, n) {
  const o = e.children[n];
  e.insertBefore(t, o);
}
function J(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function lt(e, t = document) {
  var o;
  let n = null;
  return typeof (t == null ? void 0 : t.querySelector) == "function" ? n = (o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, e) : n = document.querySelector(e), n || Ze(`Element not found: ${e}`), n;
}
function it(e, t, n = null) {
  return function(...o) {
    return e.apply(n, o), t.apply(n, o);
  };
}
function st(e, t) {
  const n = C({}, e);
  return Object.keys(t).forEach((o) => {
    n[o] ? n[o] = it(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function ut(e) {
  return e instanceof HTMLElement;
}
function ve(e, t) {
  Object.keys(e).forEach((n) => {
    t(n, e[n]);
  });
}
function ct(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const at = Object.assign, Z = Symbol("cloneGhostOriginalHtml"), ee = Symbol("cloneGhostOriginalWidth"), te = Symbol("cloneGhostOriginalHeight"), _ = Symbol("cloneGhostAppliedBy");
function H() {
  return M.dragged;
}
function V() {
  return M.ghost;
}
function N(e) {
  if (!e || !e[_])
    return;
  const t = e[Z];
  typeof t == "string" && (e.innerHTML = t);
  const n = e[ee];
  typeof n == "string" && (e.style.width = n);
  const o = e[te];
  typeof o == "string" && (e.style.height = o), e[Z] = void 0, e[ee] = void 0, e[te] = void 0, e[_] = void 0;
}
function Ie(e, t) {
  e.innerHTML = t.innerHTML;
  const n = t.getBoundingClientRect();
  e.style.width = `${n.width}px`, e.style.height = `${n.height}px`;
}
function dt(e, t, n) {
  const o = t();
  o && (e[Z] = e.innerHTML, e[ee] = e.style.width, e[te] = e.style.height, o instanceof HTMLElement ? Ie(e, o) : (e.innerHTML = o, e.style.width = "", e.style.height = ""), e[_] = n);
}
function ne(e, t, n) {
  e && e[_] !== n && (e[_] && N(e), dt(e, t, n));
}
function X() {
  N(H()), N(V());
}
const L = /* @__PURE__ */ new Map();
function ft(e, t) {
  return L.set(e, { getFactory: t, observer: null }), () => {
    var o;
    const n = L.get(e);
    (o = n == null ? void 0 : n.observer) == null || o.disconnect(), L.delete(e);
  };
}
function gt(e) {
  const t = V();
  if (!t)
    return;
  let n = !1;
  L.forEach((o, i) => {
    var g;
    if (i === e)
      return;
    const c = o.getFactory();
    if (!c)
      return;
    const l = c();
    l && (ne(t, () => l, i), n = !0, l instanceof HTMLElement && ((g = o.observer) == null || g.disconnect(), o.observer = new MutationObserver(
      () => Ie(t, l)
    ), o.observer.observe(l, { childList: !0, subtree: !0 })));
  }), n && (P = !0, oe());
}
let P = !1;
function pt() {
  L.forEach((e) => {
    var t;
    (t = e.observer) == null || t.disconnect(), e.observer = null;
  });
}
const F = "vue-draggable-plus-clone-ghost-pending", Se = "vue-draggable-plus-clone-ghost-style";
function mt() {
  if (typeof document == "undefined" || document.getElementById(Se))
    return;
  const e = document.createElement("style");
  e.id = Se, e.textContent = `body.${F} .sortable-drag,body.${F} .sortable-fallback{visibility:hidden!important}`, document.head.appendChild(e);
}
function ht(e) {
  let t = !1;
  L.forEach((n, o) => {
    o !== e && n.getFactory() && (t = !0);
  }), t && document.body.classList.add(F);
}
function oe() {
  typeof document != "undefined" && document.body.classList.remove(F);
}
function $() {
}
$.prototype = {
  // Fires in SortableJS's _onDragStart, BEFORE _appendGhost (which is
  // scheduled via setTimeout(0) in _dragStarted). Setting the body class
  // here means the ghost is born with visibility:hidden via CSS — the
  // browser never paints a frame of the source dragEl's cloned content.
  // Cleared by triggerCloneGhostOnStart (after applying via nextTick) or
  // dragOverValid (when the cursor enters a destination).
  dragStartGlobal(e) {
    ht(e.sortable.el);
  },
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const t = e.sortable.options.cloneGhost;
    t && (ne(H(), t, e.sortable.el), ne(V(), t, e.sortable.el), oe());
  },
  dragOverGlobal(e) {
    e.isOwner && (P || X());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = H();
    N(e), P || N(V()), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    X();
  },
  nullingGlobal() {
    X(), pt(), oe(), P = !1;
  }
};
$.pluginName = "cloneGhost";
$.initializeByDefault = !0;
const U = /* @__PURE__ */ new Map();
let T = null;
function bt(e, t, n) {
  return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
}
function yt() {
  if (T)
    return;
  const e = (t) => {
    const n = H();
    U.forEach(({ isDragOver: o, getOptions: i }, c) => {
      var g;
      const l = bt(
        t.clientX,
        t.clientY,
        c.getBoundingClientRect()
      );
      if (o.value !== l) {
        o.value = l;
        const b = M.active;
        n && n.parentNode === c && (b == null ? void 0 : b.el) !== c && ((g = i()) != null && g.hideOnLeave) && (n.style.display = l ? "" : "none");
      }
    });
  };
  document.addEventListener("pointermove", e), T = e;
}
function vt() {
  T && (document.removeEventListener("pointermove", T), T = null);
}
function St() {
  U.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function Ot(e, t, n) {
  return U.set(e, { isDragOver: t, getOptions: n }), () => {
    U.delete(e);
  };
}
function Y() {
}
Y.prototype = {
  dragStartGlobal() {
    yt();
  },
  nullingGlobal() {
    vt(), St();
    const e = H();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
Y.pluginName = "dragStateTracker";
Y.initializeByDefault = !0;
const Oe = "sortable-dragging";
function j() {
}
j.prototype = {
  dragStartGlobal() {
    document.body.classList.add(Oe);
  },
  nullingGlobal() {
    document.body.classList.remove(Oe);
  }
};
j.pluginName = "bodyClass";
j.initializeByDefault = !0;
let Ce = !1;
function Ct() {
  Ce || (Ce = !0, mt(), M.mount(
    $,
    Y,
    j
  ));
}
Ct();
function Gt(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Lt(e) {
  le() && ke(e);
}
function wt(e) {
  le() ? ze(e) : Q(e);
}
let De = null, Te = null;
const _e = Ae(null);
function Ge(e = null, t = null) {
  De = e, Te = t, _e.value = t;
}
function At() {
  return {
    data: De,
    clonedData: Te
  };
}
const Le = Symbol("cloneElement");
function He(...e) {
  var ue, ce;
  const t = (ue = le()) == null ? void 0 : ue.proxy;
  let n = null;
  const o = e[0];
  let [, i, c] = e;
  Array.isArray(d(i)) || (c = i, i = null);
  let l = null, g = null, b = null;
  const w = Ae(!1), {
    immediate: y = !0,
    clone: G = Gt,
    forceFallback: A,
    fallbackOnBody: S,
    customUpdate: E
  } = (ce = d(c)) != null ? ce : {};
  function k(r) {
    var h;
    const { from: s, oldIndex: a, item: p } = r, u = Array.from(s.childNodes);
    n = A && !S ? u.slice(0, -1) : u;
    const f = d((h = d(i)) == null ? void 0 : h[a]), m = G(f);
    Ge(f, m), p[Le] = m, Q(() => gt(s));
  }
  function z(r) {
    const s = r.item[Le];
    if (!ot(s)) {
      if (J(r.item), W(i)) {
        const a = [...d(i)];
        i.value = be(a, r.newDraggableIndex, s);
        return;
      }
      be(d(i), r.newDraggableIndex, s);
    }
  }
  function x(r) {
    const { from: s, item: a, oldIndex: p, oldDraggableIndex: u, pullMode: f, clone: m } = r;
    if (ye(s, a, p), f === "clone") {
      J(m);
      return;
    }
    if (W(i)) {
      const h = [...d(i)];
      i.value = he(h, u);
      return;
    }
    he(d(i), u);
  }
  function Ne(r) {
    if (E) {
      E(r);
      return;
    }
    const { from: s, item: a, oldIndex: p, oldDraggableIndex: u, newDraggableIndex: f } = r;
    if (J(a), ye(s, a, p), W(i)) {
      const m = [...d(i)];
      i.value = me(
        m,
        u,
        f
      );
      return;
    }
    me(d(i), u, f);
  }
  function Me(r) {
    const { newIndex: s, oldIndex: a, from: p, to: u } = r;
    let f = null;
    const m = s === a && p === u;
    try {
      if (m) {
        let h = null;
        n == null || n.some((I, O) => {
          if (h && (n == null ? void 0 : n.length) !== u.childNodes.length)
            return p.insertBefore(h, I.nextSibling), !0;
          const B = u.childNodes[O];
          h = u == null ? void 0 : u.replaceChild(I, B);
        });
      }
    } catch (h) {
      f = h;
    } finally {
      n = null;
    }
    Q(() => {
      if (Ge(), f)
        throw f;
    });
  }
  const xe = {
    onUpdate: Ne,
    onStart: k,
    onAdd: z,
    onRemove: x,
    onEnd: Me
  };
  function Be(r) {
    const s = d(o);
    return r || (r = rt(s) ? lt(s, t == null ? void 0 : t.$el) : s), r && !ut(r) && (r = r.$el), r || et("Root element not found"), r;
  }
  function ie() {
    var h;
    const I = (h = d(c)) != null ? h : {}, { immediate: r, clone: s } = I, a = q(I, ["immediate", "clone"]);
    ve(a, (O, B) => {
      ct(O) && (a[O] = (D, ...Ve) => {
        const Fe = At();
        return at(D, Fe), B(D, ...Ve);
      });
    });
    const p = a.onAdd;
    delete a.onAdd;
    const u = i === null ? {} : xe, f = st(u, a), m = u.onAdd;
    return (p || m) && (f.onAdd = function(O) {
      var D;
      if (((D = O.item) == null ? void 0 : D.style.display) === "none")
        return;
      (p == null ? void 0 : p.call(this, O)) !== !1 && (m == null || m.call(this, O));
    }), f;
  }
  const se = (r) => {
    r = Be(r), l && v.destroy(), l = new M(r, ie()), g = Ot(
      r,
      w,
      () => d(c)
    ), b = ft(
      r,
      () => {
        const s = d(c);
        return s != null && s.cloneGhostOnStart ? s.cloneGhost : void 0;
      }
    );
  };
  je(
    () => c,
    () => {
      l && ve(ie(), (r, s) => {
        l == null || l.option(r, s);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, s) => l == null ? void 0 : l.option(r, s),
    destroy: () => {
      g == null || g(), g = null, b == null || b(), b = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Re = () => v == null ? void 0 : v.option("disabled", !0), Pe = () => v == null ? void 0 : v.option("disabled", !1);
  return wt(() => {
    y && se();
  }), Lt(v.destroy), ge(C({
    start: se,
    pause: Re,
    resume: Pe
  }, v), {
    draggedData: _e,
    isDragOver: w
  });
}
const re = [
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
], Et = [
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
  ...re.map((e) => `on${e.replace(/^\S/, (t) => t.toUpperCase())}`)
], _t = qe({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: Et,
  emits: ["update:modelValue", ...re],
  setup(e, { slots: t, emit: n, expose: o, attrs: i }) {
    const c = re.reduce((y, G) => {
      const A = `on${G.replace(/^\S/, (S) => S.toUpperCase())}`;
      return y[A] = (...S) => n(G, ...S), y;
    }, {}), l = pe(() => {
      const S = We(e), { modelValue: y } = S, G = q(S, ["modelValue"]), A = Object.entries(G).reduce((E, [k, z]) => {
        const x = d(z);
        return x !== void 0 && (E[k] = x), E;
      }, {});
      return C(C({}, c), nt(C(C({}, i), A)));
    }), g = pe({
      get: () => e.modelValue,
      set: (y) => n("update:modelValue", y)
    }), b = Je(), w = Xe(
      He(e.target || b, g, l)
    );
    return o(w), () => {
      var y;
      return Ke(e.tag || "div", { ref: b }, (y = t == null ? void 0 : t.default) == null ? void 0 : y.call(t, w));
    };
  }
}), we = {
  mounted: "mounted",
  unmounted: "unmounted"
}, K = /* @__PURE__ */ new WeakMap(), Ht = {
  [we.mounted](e, t) {
    const n = Qe(t.value) ? [t.value] : t.value, [o, i] = n, c = He(e, o, i);
    K.set(e, c.destroy);
  },
  [we.unmounted](e) {
    var t;
    (t = K.get(e)) == null || t(), K.delete(e);
  }
};
export {
  _t as VueDraggable,
  He as useDraggable,
  Ht as vDraggable
};
