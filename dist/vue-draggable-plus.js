var Te = Object.defineProperty, Ee = Object.defineProperties;
var xe = Object.getOwnPropertyDescriptors;
var H = Object.getOwnPropertySymbols;
var ne = Object.prototype.hasOwnProperty, te = Object.prototype.propertyIsEnumerable;
var ee = (e, n, t) => n in e ? Te(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t, C = (e, n) => {
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
import { shallowRef as me, getCurrentInstance as X, unref as d, watch as Me, onUnmounted as Ne, onMounted as Be, nextTick as be, isRef as z, defineComponent as He, computed as re, toRefs as Re, ref as _e, reactive as Pe, h as Ve, isProxy as Ue } from "vue";
import _ from "sortablejs";
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
  const t = C({}, e);
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
function A() {
  return _.dragged;
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
    const t = A();
    t && t[E] !== e.sortable.el && (t[E] && I(t), Ze(t, n, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && I(A());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = A();
    I(e), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    I(A());
  },
  nullingGlobal() {
    I(A());
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const R = /* @__PURE__ */ new Map();
let T = null;
function en(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function nn() {
  if (T)
    return;
  const e = (n) => {
    const t = A();
    R.forEach(({ isDragOver: o, getOptions: i }, f) => {
      var b;
      const l = en(
        n.clientX,
        n.clientY,
        f.getBoundingClientRect()
      );
      if (o.value !== l) {
        o.value = l;
        const h = _.active;
        t && t.parentNode === f && (h == null ? void 0 : h.el) !== f && ((b = i()) != null && b.hideOnLeave) && (t.style.display = l ? "" : "none");
      }
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
function V() {
}
V.prototype = {
  dragStartGlobal() {
    nn();
  },
  nullingGlobal() {
    tn(), on();
    const e = A();
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
function ln() {
  de || (de = !0, _.mount(
    P,
    V,
    U
  ));
}
ln();
function un(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function sn(e) {
  X() && Ne(e);
}
function an(e) {
  X() ? Be(e) : be(e);
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
  const n = (Q = X()) == null ? void 0 : Q.proxy;
  let t = null;
  const o = e[0];
  let [, i, f] = e;
  Array.isArray(d(i)) || (f = i, i = null);
  let l = null, b = null;
  const h = me(!1), {
    immediate: x = !0,
    clone: y = un,
    forceFallback: D,
    fallbackOnBody: L,
    customUpdate: v
  } = (Z = d(f)) != null ? Z : {};
  function M(r) {
    var m;
    const { from: u, oldIndex: a, item: g } = r, s = Array.from(u.childNodes);
    t = D && !L ? s.slice(0, -1) : s;
    const c = d((m = d(i)) == null ? void 0 : m[a]), p = y(c);
    fe(c, p), g[ge] = p;
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
    const { from: u, item: a, oldIndex: g, oldDraggableIndex: s, pullMode: c, clone: p } = r;
    if (se(u, a, g), c === "clone") {
      Y(p);
      return;
    }
    if (z(i)) {
      const m = [...d(i)];
      i.value = ie(m, s);
      return;
    }
    ie(d(i), s);
  }
  function N(r) {
    if (v) {
      v(r);
      return;
    }
    const { from: u, item: a, oldIndex: g, oldDraggableIndex: s, newDraggableIndex: c } = r;
    if (Y(a), se(u, a, g), z(i)) {
      const p = [...d(i)];
      i.value = le(
        p,
        s,
        c
      );
      return;
    }
    le(d(i), s, c);
  }
  function Ce(r) {
    const { newIndex: u, oldIndex: a, from: g, to: s } = r;
    let c = null;
    const p = u === a && g === s;
    try {
      if (p) {
        let m = null;
        t == null || t.some((w, O) => {
          if (m && (t == null ? void 0 : t.length) !== s.childNodes.length)
            return g.insertBefore(m, w.nextSibling), !0;
          const B = s.childNodes[O];
          m = s == null ? void 0 : s.replaceChild(w, B);
        });
      }
    } catch (m) {
      c = m;
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
    onAdd: F,
    onRemove: $,
    onEnd: Ce
  };
  function De(r) {
    const u = d(o);
    return r || (r = ke(u) ? qe(u, n == null ? void 0 : n.$el) : u), r && !Ke(r) && (r = r.$el), r || $e("Root element not found"), r;
  }
  function K() {
    var m;
    const w = (m = d(f)) != null ? m : {}, { immediate: r, clone: u } = w, a = j(w, ["immediate", "clone"]);
    ae(a, (O, B) => {
      We(O) && (a[O] = (G, ...Ge) => {
        const Ie = cn();
        return Qe(G, Ie), B(G, ...Ge);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const s = i === null ? {} : Ae, c = Xe(s, a), p = s.onAdd;
    return (g || p) && (c.onAdd = function(O) {
      var G;
      if (((G = O.item) == null ? void 0 : G.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, O)) !== !1 && (p == null || p.call(this, O));
    }), c;
  }
  const W = (r) => {
    r = De(r), l && S.destroy(), l = new _(r, K()), b = rn(
      r,
      h,
      () => d(f)
    );
  };
  Me(
    () => f,
    () => {
      l && ae(K(), (r, u) => {
        l == null || l.option(r, u);
      });
    },
    { deep: !0 }
  );
  const S = {
    option: (r, u) => l == null ? void 0 : l.option(r, u),
    destroy: () => {
      b == null || b(), b = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Le = () => S == null ? void 0 : S.option("disabled", !0), we = () => S == null ? void 0 : S.option("disabled", !1);
  return an(() => {
    x && W();
  }), sn(S.destroy), oe(C({
    start: W,
    pause: Le,
    resume: we
  }, S), {
    draggedData: Se,
    isDragOver: h
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
  ...J.map((e) => `on${e.replace(/^\S/, (n) => n.toUpperCase())}`)
], mn = He({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: dn,
  emits: ["update:modelValue", ...J],
  setup(e, { slots: n, emit: t, expose: o, attrs: i }) {
    const f = J.reduce((y, D) => {
      const L = `on${D.replace(/^\S/, (v) => v.toUpperCase())}`;
      return y[L] = (...v) => t(D, ...v), y;
    }, {}), l = re(() => {
      const v = Re(e), { modelValue: y } = v, D = j(v, ["modelValue"]), L = Object.entries(D).reduce((M, [F, $]) => {
        const N = d($);
        return N !== void 0 && (M[F] = N), M;
      }, {});
      return C(C({}, f), ze(C(C({}, i), L)));
    }), b = re({
      get: () => e.modelValue,
      set: (y) => t("update:modelValue", y)
    }), h = _e(), x = Pe(
      Oe(e.target || h, b, l)
    );
    return o(x), () => {
      var y;
      return Ve(e.tag || "div", { ref: h }, (y = n == null ? void 0 : n.default) == null ? void 0 : y.call(n, x));
    };
  }
}), pe = {
  mounted: "mounted",
  unmounted: "unmounted"
}, k = /* @__PURE__ */ new WeakMap(), bn = {
  [pe.mounted](e, n) {
    const t = Ue(n.value) ? [n.value] : n.value, [o, i] = t, f = Oe(e, o, i);
    k.set(e, f.destroy);
  },
  [pe.unmounted](e) {
    var n;
    (n = k.get(e)) == null || n(), k.delete(e);
  }
};
export {
  mn as VueDraggable,
  Oe as useDraggable,
  bn as vDraggable
};
