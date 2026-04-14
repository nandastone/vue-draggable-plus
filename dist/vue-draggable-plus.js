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
var $ = (e, n) => {
  var t = {};
  for (var o in e)
    ne.call(e, o) && n.indexOf(o) < 0 && (t[o] = e[o]);
  if (e != null && H)
    for (var o of H(e))
      n.indexOf(o) < 0 && te.call(e, o) && (t[o] = e[o]);
  return t;
};
import { shallowRef as me, getCurrentInstance as J, unref as d, watch as Me, onUnmounted as Ne, onMounted as Be, nextTick as be, isRef as j, defineComponent as He, computed as re, toRefs as Re, ref as _e, reactive as Pe, h as Ve, isProxy as Ue } from "vue";
import X from "sortablejs";
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
function z(e) {
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
const Qe = Object.assign, k = Symbol("cloneGhostOriginalHtml"), E = Symbol("cloneGhostAppliedBy");
function C() {
  return X.dragged;
}
function I(e) {
  if (!e || !e[E])
    return;
  const n = e[k];
  typeof n == "string" && (e.innerHTML = n), e[k] = void 0, e[E] = void 0;
}
function Ze(e, n, t) {
  const o = n();
  o && (e[k] = e.innerHTML, e.innerHTML = typeof o == "string" ? o : o.innerHTML, e[E] = t);
}
function _() {
}
_.prototype = {
  dragOverValid(e) {
    if (e.isOwner)
      return;
    const n = e.sortable.options.cloneGhost;
    if (!n)
      return;
    const t = C();
    t && t[E] !== e.sortable.el && (t[E] && I(t), Ze(t, n, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && I(C());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = C();
    I(e), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    I(C());
  },
  nullingGlobal() {
    I(C());
  }
};
_.pluginName = "cloneGhost";
_.initializeByDefault = !0;
const R = /* @__PURE__ */ new Map();
let T = null;
function en(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function nn() {
  if (T)
    return;
  const e = (n) => {
    const t = C();
    R.forEach(({ isDragOver: o, getOptions: i }, m) => {
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
  R.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function rn(e, n, t) {
  return R.set(e, { isDragOver: n, getOptions: t }), () => {
    R.delete(e);
  };
}
function P() {
}
P.prototype = {
  dragStartGlobal() {
    nn();
  },
  nullingGlobal() {
    tn(), on();
    const e = C();
    e && e.style.display === "none" && (e.style.display = "");
  }
};
P.pluginName = "dragStateTracker";
P.initializeByDefault = !0;
const ce = "sortable-dragging";
function V() {
}
V.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ce);
  },
  nullingGlobal() {
    document.body.classList.remove(ce);
  }
};
V.pluginName = "bodyClass";
V.initializeByDefault = !0;
let de = !1;
function ln() {
  de || (de = !0, X.mount(
    _,
    P,
    V
  ));
}
ln();
function un(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function sn(e) {
  J() && Ne(e);
}
function an(e) {
  J() ? Be(e) : be(e);
}
let he = null, ve = null;
const Se = me(null);
function fe(e = null, n = null) {
  he = e, ve = n, Se.value = n;
}
function cn() {
  return {
    data: he,
    clonedData: ve
  };
}
const ge = Symbol("cloneElement");
function Oe(...e) {
  var Q, Z;
  const n = (Q = J()) == null ? void 0 : Q.proxy;
  let t = null;
  const o = e[0];
  let [, i, m] = e;
  Array.isArray(d(i)) || (m = i, i = null);
  let l = null, b = null;
  const D = me(!1), {
    immediate: x = !0,
    clone: y = un,
    forceFallback: A,
    fallbackOnBody: L,
    customUpdate: h
  } = (Z = d(m)) != null ? Z : {};
  function M(r) {
    var p;
    const { from: u, oldIndex: a, item: f } = r, s = Array.from(u.childNodes);
    t = A && !L ? s.slice(0, -1) : s;
    const c = d((p = d(i)) == null ? void 0 : p[a]), g = y(c);
    fe(c, g), f[ge] = g;
  }
  function U(r) {
    const u = r.item[ge];
    if (!Ye(u)) {
      if (z(r.item), j(i)) {
        const a = [...d(i)];
        i.value = ue(a, r.newDraggableIndex, u);
        return;
      }
      ue(d(i), r.newDraggableIndex, u);
    }
  }
  function F(r) {
    const { from: u, item: a, oldIndex: f, oldDraggableIndex: s, pullMode: c, clone: g } = r;
    if (se(u, a, f), c === "clone") {
      z(g);
      return;
    }
    if (j(i)) {
      const p = [...d(i)];
      i.value = ie(p, s);
      return;
    }
    ie(d(i), s);
  }
  function N(r) {
    if (h) {
      h(r);
      return;
    }
    const { from: u, item: a, oldIndex: f, oldDraggableIndex: s, newDraggableIndex: c } = r;
    if (z(a), se(u, a, f), j(i)) {
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
        t == null || t.some((w, S) => {
          if (p && (t == null ? void 0 : t.length) !== s.childNodes.length)
            return f.insertBefore(p, w.nextSibling), !0;
          const B = s.childNodes[S];
          p = s == null ? void 0 : s.replaceChild(w, B);
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
  const Ae = {
    onUpdate: N,
    onStart: M,
    onAdd: U,
    onRemove: F,
    onEnd: Ce
  };
  function De(r) {
    const u = d(o);
    return r || (r = ke(u) ? qe(u, n == null ? void 0 : n.$el) : u), r && !Ke(r) && (r = r.$el), r || $e("Root element not found"), r;
  }
  function K() {
    var p;
    const w = (p = d(m)) != null ? p : {}, { immediate: r, clone: u } = w, a = $(w, ["immediate", "clone"]);
    ae(a, (S, B) => {
      We(S) && (a[S] = (G, ...Ge) => {
        const Ie = cn();
        return Qe(G, Ie), B(G, ...Ge);
      });
    });
    const f = a.onAdd;
    delete a.onAdd;
    const s = i === null ? {} : Ae, c = Xe(s, a), g = s.onAdd;
    return (f || g) && (c.onAdd = function(S) {
      var G;
      if (((G = S.item) == null ? void 0 : G.style.display) === "none")
        return;
      (f == null ? void 0 : f.call(this, S)) !== !1 && (g == null || g.call(this, S));
    }), c;
  }
  const W = (r) => {
    r = De(r), l && v.destroy(), l = new X(r, K()), b = rn(
      r,
      D,
      () => d(m)
    );
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
  return an(() => {
    x && W();
  }), sn(v.destroy), oe(O({
    start: W,
    pause: Le,
    resume: we
  }, v), {
    draggedData: Se,
    isDragOver: D
  });
}
const q = [
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
], dn = [
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
  ...q.map((e) => `on${e.replace(/^\S/, (n) => n.toUpperCase())}`)
], mn = He({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: dn,
  emits: ["update:modelValue", ...q],
  setup(e, { slots: n, emit: t, expose: o, attrs: i }) {
    const m = q.reduce((y, A) => {
      const L = `on${A.replace(/^\S/, (h) => h.toUpperCase())}`;
      return y[L] = (...h) => t(A, ...h), y;
    }, {}), l = re(() => {
      const h = Re(e), { modelValue: y } = h, A = $(h, ["modelValue"]), L = Object.entries(A).reduce((M, [U, F]) => {
        const N = d(F);
        return N !== void 0 && (M[U] = N), M;
      }, {});
      return O(O({}, m), ze(O(O({}, i), L)));
    }), b = re({
      get: () => e.modelValue,
      set: (y) => t("update:modelValue", y)
    }), D = _e(), x = Pe(
      Oe(e.target || D, b, l)
    );
    return o(x), () => {
      var y;
      return Ve(e.tag || "div", { ref: D }, (y = n == null ? void 0 : n.default) == null ? void 0 : y.call(n, x));
    };
  }
}), pe = {
  mounted: "mounted",
  unmounted: "unmounted"
}, Y = /* @__PURE__ */ new WeakMap(), bn = {
  [pe.mounted](e, n) {
    const t = Ue(n.value) ? [n.value] : n.value, [o, i] = t, m = Oe(e, o, i);
    Y.set(e, m.destroy);
  },
  [pe.unmounted](e) {
    var n;
    (n = Y.get(e)) == null || n(), Y.delete(e);
  }
};
export {
  mn as VueDraggable,
  Oe as useDraggable,
  bn as vDraggable
};
