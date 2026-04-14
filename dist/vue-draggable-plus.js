var Te = Object.defineProperty, Ee = Object.defineProperties;
var xe = Object.getOwnPropertyDescriptors;
var H = Object.getOwnPropertySymbols;
var ne = Object.prototype.hasOwnProperty, te = Object.prototype.propertyIsEnumerable;
var ee = (e, n, t) => n in e ? Te(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t, O = (e, n) => {
  for (var t in n || (n = {}))
    ne.call(n, t) && ee(e, t, n[t]);
  if (H)
    for (var t of H(n))
      te.call(n, t) && ee(e, t, n[t]);
  return e;
}, oe = (e, n) => Ee(e, xe(n));
var j = (e, n) => {
  var t = {};
  for (var o in e)
    ne.call(e, o) && n.indexOf(o) < 0 && (t[o] = e[o]);
  if (e != null && H)
    for (var o of H(e))
      n.indexOf(o) < 0 && te.call(e, o) && (t[o] = e[o]);
  return t;
};
import { shallowRef as me, getCurrentInstance as X, unref as d, watch as Me, onUnmounted as Ne, onMounted as Be, nextTick as be, isRef as z, defineComponent as Re, computed as re, toRefs as He, ref as _e, reactive as Pe, h as Ve, isProxy as Ue } from "vue";
import x from "sortablejs";
const ye = "[vue-draggable-plus]: ";
function Fe(e) {
  console.warn(ye + e);
}
function $e(e) {
  console.error(ye + e);
}
function le(e, n, t) {
  return t >= 0 && t < e.length && e.splice(t, 0, e.splice(n, 1)[0]), e;
}
function je(e) {
  return e.replace(/-(\w)/g, (n, t) => t ? t.toUpperCase() : "");
}
function ze(e) {
  return Object.keys(e).reduce((n, t) => (typeof e[t] != "undefined" && (n[je(t)] = e[t]), n), {});
}
function ie(e, n) {
  return Array.isArray(e) && e.splice(n, 1), e;
}
function ue(e, n, t) {
  return Array.isArray(e) && e.splice(n, 0, t), e;
}
function Ye(e) {
  return typeof e == "undefined";
}
function ke(e) {
  return typeof e == "string";
}
function se(e, n, t) {
  const o = e.children[t];
  e.insertBefore(n, o);
}
function Y(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function qe(e, n = document) {
  var o;
  let t = null;
  return typeof (n == null ? void 0 : n.querySelector) == "function" ? t = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, e) : t = document.querySelector(e), t || Fe(`Element not found: ${e}`), t;
}
function Je(e, n, t = null) {
  return function(...o) {
    return e.apply(t, o), n.apply(t, o);
  };
}
function Xe(e, n) {
  const t = O({}, e);
  return Object.keys(n).forEach((o) => {
    t[o] ? t[o] = Je(e[o], n[o]) : t[o] = n[o];
  }), t;
}
function Ke(e) {
  return e instanceof HTMLElement;
}
function ae(e, n) {
  Object.keys(e).forEach((t) => {
    n(t, e[t]);
  });
}
function We(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const Qe = Object.assign, q = Symbol("cloneGhostOriginalHtml"), E = Symbol("cloneGhostAppliedBy");
function G() {
  return x.dragged;
}
function I(e) {
  if (!e || !e[E])
    return;
  const n = e[q];
  typeof n == "string" && (e.innerHTML = n), e[q] = void 0, e[E] = void 0;
}
function Ze(e, n, t) {
  const o = n();
  o && (e[q] = e.innerHTML, e.innerHTML = typeof o == "string" ? o : o.innerHTML, e[E] = t);
}
function P() {
}
P.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const n = e.sortable.options.cloneGhost;
    if (!n)
      return;
    const t = G();
    t && t[E] !== e.sortable.el && (t[E] && I(t), Ze(t, n, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && I(G());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = G();
    I(e), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    I(G());
  },
  nullingGlobal() {
    I(G());
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const _ = /* @__PURE__ */ new Map();
let T = null;
function en(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function nn() {
  if (T)
    return;
  const e = (n) => {
    const t = x.dragged;
    _.forEach(({ isDragOver: o, getOptions: i }, m) => {
      var b;
      const l = en(
        n.clientX,
        n.clientY,
        m.getBoundingClientRect()
      );
      o.value !== l && (o.value = l, t && t.parentNode === m && ((b = i()) != null && b.hideOnLeave) && (t.style.display = l ? "" : "none"));
    });
  };
  document.addEventListener("pointermove", e), T = e;
}
function tn() {
  T && (document.removeEventListener("pointermove", T), T = null);
}
function on() {
  _.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function rn(e, n, t) {
  return _.set(e, { isDragOver: n, getOptions: t }), {
    dispose: () => {
      _.delete(e);
    }
  };
}
function ln() {
  return me(!1);
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    nn();
  },
  nullingGlobal() {
    tn(), on();
    const e = x.dragged;
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "dragStateTracker";
V.initializeByDefault = !0;
const ce = "sortable-dragging";
function U() {
}
U.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ce);
  },
  nullingGlobal() {
    document.body.classList.remove(ce);
  }
};
U.pluginName = "bodyClass";
U.initializeByDefault = !0;
let de = !1;
function un() {
  de || (de = !0, x.mount(
    P,
    V,
    U
  ));
}
un();
function sn(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function an(e) {
  X() && Ne(e);
}
function cn(e) {
  X() ? Be(e) : be(e);
}
let he = null, ve = null;
const Se = me(null);
function fe(e = null, n = null) {
  he = e, ve = n, Se.value = n;
}
function dn() {
  return {
    data: he,
    clonedData: ve
  };
}
const ge = Symbol("cloneElement");
function Oe(...e) {
  var Q, Z;
  const n = (Q = X()) == null ? void 0 : Q.proxy;
  let t = null;
  const o = e[0];
  let [, i, m] = e;
  Array.isArray(d(i)) || (m = i, i = null);
  let l = null, b = null;
  const D = ln(), {
    immediate: M = !0,
    clone: y = sn,
    forceFallback: C,
    fallbackOnBody: A,
    customUpdate: h
  } = (Z = d(m)) != null ? Z : {};
  function N(r) {
    var p;
    const { from: u, oldIndex: a, item: f } = r, s = Array.from(u.childNodes);
    t = C && !A ? s.slice(0, -1) : s;
    const c = d((p = d(i)) == null ? void 0 : p[a]), g = y(c);
    fe(c, g), f[ge] = g;
  }
  function F(r) {
    const u = r.item[ge];
    if (!Ye(u)) {
      if (Y(r.item), z(i)) {
        const a = [...d(i)];
        i.value = ue(a, r.newDraggableIndex, u);
        return;
      }
      ue(d(i), r.newDraggableIndex, u);
    }
  }
  function $(r) {
    const { from: u, item: a, oldIndex: f, oldDraggableIndex: s, pullMode: c, clone: g } = r;
    if (se(u, a, f), c === "clone") {
      Y(g);
      return;
    }
    if (z(i)) {
      const p = [...d(i)];
      i.value = ie(p, s);
      return;
    }
    ie(d(i), s);
  }
  function B(r) {
    if (h) {
      h(r);
      return;
    }
    const { from: u, item: a, oldIndex: f, oldDraggableIndex: s, newDraggableIndex: c } = r;
    if (Y(a), se(u, a, f), z(i)) {
      const g = [...d(i)];
      i.value = le(
        g,
        s,
        c
      );
      return;
    }
    le(d(i), s, c);
  }
  function Ce(r) {
    const { newIndex: u, oldIndex: a, from: f, to: s } = r;
    let c = null;
    const g = u === a && f === s;
    try {
      if (g) {
        let p = null;
        t == null || t.some((L, S) => {
          if (p && (t == null ? void 0 : t.length) !== s.childNodes.length)
            return f.insertBefore(p, L.nextSibling), !0;
          const R = s.childNodes[S];
          p = s == null ? void 0 : s.replaceChild(L, R);
        });
      }
    } catch (p) {
      c = p;
    } finally {
      t = null;
    }
    be(() => {
      if (fe(), c)
        throw c;
    });
  }
  const De = {
    onUpdate: B,
    onStart: N,
    onAdd: F,
    onRemove: $,
    onEnd: Ce
  };
  function Ae(r) {
    const u = d(o);
    return r || (r = ke(u) ? qe(u, n == null ? void 0 : n.$el) : u), r && !Ke(r) && (r = r.$el), r || $e("Root element not found"), r;
  }
  function K() {
    var p;
    const L = (p = d(m)) != null ? p : {}, { immediate: r, clone: u } = L, a = j(L, ["immediate", "clone"]);
    ae(a, (S, R) => {
      We(S) && (a[S] = (w, ...Ge) => {
        const Ie = dn();
        return Qe(w, Ie), R(w, ...Ge);
      });
    });
    const f = a.onAdd;
    delete a.onAdd;
    const s = i === null ? {} : De, c = Xe(s, a), g = s.onAdd;
    return (f || g) && (c.onAdd = function(S) {
      var w;
      if (((w = S.item) == null ? void 0 : w.style.display) === "none")
        return;
      (f == null ? void 0 : f.call(this, S)) !== !1 && (g == null || g.call(this, S));
    }), c;
  }
  const W = (r) => {
    r = Ae(r), l && v.destroy(), l = new x(r, K()), b = rn(
      r,
      D,
      () => d(m)
    ).dispose;
  };
  Me(
    () => m,
    () => {
      l && ae(K(), (r, u) => {
        l == null || l.option(r, u);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, u) => l == null ? void 0 : l.option(r, u),
    destroy: () => {
      b == null || b(), b = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Le = () => v == null ? void 0 : v.option("disabled", !0), we = () => v == null ? void 0 : v.option("disabled", !1);
  return cn(() => {
    M && W();
  }), an(v.destroy), oe(O({
    start: W,
    pause: Le,
    resume: we
  }, v), {
    draggedData: Se,
    isDragOver: D
  });
}
const J = [
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
], fn = [
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
  ...J.map((e) => `on${e.replace(/^\S/, (n) => n.toUpperCase())}`)
], bn = Re({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: fn,
  emits: ["update:modelValue", ...J],
  setup(e, { slots: n, emit: t, expose: o, attrs: i }) {
    const m = J.reduce((y, C) => {
      const A = `on${C.replace(/^\S/, (h) => h.toUpperCase())}`;
      return y[A] = (...h) => t(C, ...h), y;
    }, {}), l = re(() => {
      const h = He(e), { modelValue: y } = h, C = j(h, ["modelValue"]), A = Object.entries(C).reduce((N, [F, $]) => {
        const B = d($);
        return B !== void 0 && (N[F] = B), N;
      }, {});
      return O(O({}, m), ze(O(O({}, i), A)));
    }), b = re({
      get: () => e.modelValue,
      set: (y) => t("update:modelValue", y)
    }), D = _e(), M = Pe(
      Oe(e.target || D, b, l)
    );
    return o(M), () => {
      var y;
      return Ve(e.tag || "div", { ref: D }, (y = n == null ? void 0 : n.default) == null ? void 0 : y.call(n, M));
    };
  }
}), pe = {
  mounted: "mounted",
  unmounted: "unmounted"
}, k = /* @__PURE__ */ new WeakMap(), yn = {
  [pe.mounted](e, n) {
    const t = Ue(n.value) ? [n.value] : n.value, [o, i] = t, m = Oe(e, o, i);
    k.set(e, m.destroy);
  },
  [pe.unmounted](e) {
    var n;
    (n = k.get(e)) == null || n(), k.delete(e);
  }
};
export {
  bn as VueDraggable,
  Oe as useDraggable,
  yn as vDraggable
};
