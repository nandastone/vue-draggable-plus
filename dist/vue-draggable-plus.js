var De = Object.defineProperty, we = Object.defineProperties;
var Ge = Object.getOwnPropertyDescriptors;
var _ = Object.getOwnPropertySymbols;
var ee = Object.prototype.hasOwnProperty, ne = Object.prototype.propertyIsEnumerable;
var Z = (e, n, t) => n in e ? De(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t, C = (e, n) => {
  for (var t in n || (n = {}))
    ee.call(n, t) && Z(e, t, n[t]);
  if (_)
    for (var t of _(n))
      ne.call(n, t) && Z(e, t, n[t]);
  return e;
}, te = (e, n) => we(e, Ge(n));
var $ = (e, n) => {
  var t = {};
  for (var o in e)
    ee.call(e, o) && n.indexOf(o) < 0 && (t[o] = e[o]);
  if (e != null && _)
    for (var o of _(e))
      n.indexOf(o) < 0 && ne.call(e, o) && (t[o] = e[o]);
  return t;
};
import { getCurrentInstance as X, unref as p, watch as Ie, onMounted as Te, nextTick as pe, onUnmounted as Ne, shallowRef as xe, isRef as j, defineComponent as Be, computed as oe, toRefs as Ee, ref as He, reactive as Me, h as _e, isProxy as Pe } from "vue";
import A from "sortablejs";
const me = "[vue-draggable-plus]: ";
function Ve(e) {
  console.warn(me + e);
}
function Re(e) {
  console.error(me + e);
}
function re(e, n, t) {
  return t >= 0 && t < e.length && e.splice(t, 0, e.splice(n, 1)[0]), e;
}
function Ue(e) {
  return e.replace(/-(\w)/g, (n, t) => t ? t.toUpperCase() : "");
}
function Fe(e) {
  return Object.keys(e).reduce(
    (n, t) => (typeof e[t] != "undefined" && (n[Ue(t)] = e[t]), n),
    {}
  );
}
function le(e, n) {
  return Array.isArray(e) && e.splice(n, 1), e;
}
function ie(e, n, t) {
  return Array.isArray(e) && e.splice(n, 0, t), e;
}
function $e(e) {
  return typeof e == "undefined";
}
function je(e) {
  return typeof e == "string";
}
function ue(e, n, t) {
  const o = e.children[t];
  e.insertBefore(n, o);
}
function z(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function ze(e, n = document) {
  var o;
  let t = null;
  return typeof (n == null ? void 0 : n.querySelector) == "function" ? t = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, e) : t = document.querySelector(e), t || Ve(`Element not found: ${e}`), t;
}
function Ye(e, n, t = null) {
  return function(...o) {
    return e.apply(t, o), n.apply(t, o);
  };
}
function qe(e, n) {
  const t = C({}, e);
  return Object.keys(n).forEach((o) => {
    t[o] ? t[o] = Ye(e[o], n[o]) : t[o] = n[o];
  }), t;
}
function Je(e) {
  return e instanceof HTMLElement;
}
function se(e, n) {
  Object.keys(e).forEach((t) => {
    n(t, e[t]);
  });
}
function Xe(e) {
  return e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
}
const ke = Object.assign, q = Symbol("cloneGhostOriginalHtml"), x = Symbol("cloneGhostAppliedBy");
function I() {
  return A.dragged;
}
function T(e) {
  if (!e || !e[x]) return;
  const n = e[q];
  typeof n == "string" && (e.innerHTML = n), e[q] = void 0, e[x] = void 0;
}
function Ke(e, n, t) {
  const o = n();
  o && (e[q] = e.innerHTML, e.innerHTML = typeof o == "string" ? o : o.innerHTML, e[x] = t);
}
function P() {
}
P.prototype = {
  dragOverValid(e) {
    if (e.isOwner) return;
    const n = e.sortable.options.cloneGhost;
    if (!n) return;
    const t = I();
    t && t[x] !== e.sortable.el && (t[x] && T(t), Ke(t, n, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && T(I());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream issue/PR: TODO (file against SortableJS/Sortable).
  revertGlobal() {
    const e = I();
    T(e), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    T(I());
  },
  nullingGlobal() {
    T(I());
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
let N = null;
function We(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function Qe() {
  if (N) return;
  let e = null;
  const n = (t) => {
    var L;
    const o = A.dragged;
    if (!o || !o.parentNode) {
      e = null;
      return;
    }
    const i = o.parentNode, m = A.get(i);
    if (!((L = m == null ? void 0 : m.options) == null ? void 0 : L.hideOnLeave)) {
      e = null;
      return;
    }
    const O = We(
      t.clientX,
      t.clientY,
      i.getBoundingClientRect()
    );
    O !== e && (o.style.display = O ? "" : "none", e = O);
  };
  document.addEventListener("pointermove", n), N = n;
}
function Ze() {
  N && (document.removeEventListener("pointermove", N), N = null);
}
function V() {
}
V.prototype = {
  dragStartGlobal() {
    Qe();
  },
  nullingGlobal() {
    Ze();
    const e = A.dragged;
    e && e.style.display === "none" && (e.style.display = "");
  }
};
V.pluginName = "hideOnLeave";
V.initializeByDefault = !0;
const ce = "sortable-dragging";
function R() {
}
R.prototype = {
  dragStartGlobal() {
    document.body.classList.add(ce);
  },
  nullingGlobal() {
    document.body.classList.remove(ce);
  }
};
R.pluginName = "bodyClass";
R.initializeByDefault = !0;
let ae = !1;
function en() {
  ae || (ae = !0, A.mount(
    P,
    V,
    R
  ));
}
en();
function nn(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function tn(e) {
  X() && Ne(e);
}
function on(e) {
  X() ? Te(e) : pe(e);
}
let be = null, ye = null;
const he = xe(null);
function de(e = null, n = null) {
  be = e, ye = n, he.value = n;
}
function rn() {
  return {
    data: be,
    clonedData: ye
  };
}
const fe = Symbol("cloneElement");
function ve(...e) {
  var W, Q;
  const n = (W = X()) == null ? void 0 : W.proxy;
  let t = null;
  const o = e[0];
  let [, i, m] = e;
  Array.isArray(p(i)) || (m = i, i = null);
  let l = null;
  const {
    immediate: O = !0,
    clone: L = nn,
    forceFallback: B,
    fallbackOnBody: b,
    customUpdate: S
  } = (Q = p(m)) != null ? Q : {};
  function D(r) {
    var g;
    const { from: u, oldIndex: c, item: d } = r, s = Array.from(u.childNodes);
    t = B && !b ? s.slice(0, -1) : s;
    const a = p((g = p(i)) == null ? void 0 : g[c]), f = L(a);
    de(a, f), d[fe] = f;
  }
  function h(r) {
    const u = r.item[fe];
    if (!$e(u)) {
      if (z(r.item), j(i)) {
        const c = [...p(i)];
        i.value = ie(c, r.newDraggableIndex, u);
        return;
      }
      ie(p(i), r.newDraggableIndex, u);
    }
  }
  function E(r) {
    const { from: u, item: c, oldIndex: d, oldDraggableIndex: s, pullMode: a, clone: f } = r;
    if (ue(u, c, d), a === "clone") {
      z(f);
      return;
    }
    if (j(i)) {
      const g = [...p(i)];
      i.value = le(g, s);
      return;
    }
    le(p(i), s);
  }
  function U(r) {
    if (S) {
      S(r);
      return;
    }
    const { from: u, item: c, oldIndex: d, oldDraggableIndex: s, newDraggableIndex: a } = r;
    if (z(c), ue(u, c, d), j(i)) {
      const f = [...p(i)];
      i.value = re(
        f,
        s,
        a
      );
      return;
    }
    re(p(i), s, a);
  }
  function F(r) {
    const { newIndex: u, oldIndex: c, from: d, to: s } = r;
    let a = null;
    const f = u === c && d === s;
    try {
      if (f) {
        let g = null;
        t == null || t.some((w, v) => {
          if (g && (t == null ? void 0 : t.length) !== s.childNodes.length)
            return d.insertBefore(g, w.nextSibling), !0;
          const M = s.childNodes[v];
          g = s == null ? void 0 : s.replaceChild(w, M);
        });
      }
    } catch (g) {
      a = g;
    } finally {
      t = null;
    }
    pe(() => {
      if (de(), a) throw a;
    });
  }
  const H = {
    onUpdate: U,
    onStart: D,
    onAdd: h,
    onRemove: E,
    onEnd: F
  };
  function Oe(r) {
    const u = p(o);
    return r || (r = je(u) ? ze(u, n == null ? void 0 : n.$el) : u), r && !Je(r) && (r = r.$el), r || Re("Root element not found"), r;
  }
  function k() {
    var g;
    const w = (g = p(m)) != null ? g : {}, { immediate: r, clone: u } = w, c = $(w, ["immediate", "clone"]);
    se(c, (v, M) => {
      Xe(v) && (c[v] = (G, ...Ce) => {
        const Ae = rn();
        return ke(G, Ae), M(G, ...Ce);
      });
    });
    const d = c.onAdd;
    delete c.onAdd;
    const s = i === null ? {} : H, a = qe(
      s,
      c
    ), f = s.onAdd;
    return (d || f) && (a.onAdd = function(v) {
      var G;
      if (((G = v.item) == null ? void 0 : G.style.display) === "none")
        return;
      (d == null ? void 0 : d.call(this, v)) !== !1 && (f == null || f.call(this, v));
    }), a;
  }
  const K = (r) => {
    r = Oe(r), l && y.destroy(), l = new A(r, k());
  };
  Ie(
    () => m,
    () => {
      l && se(k(), (r, u) => {
        l == null || l.option(r, u);
      });
    },
    { deep: !0 }
  );
  const y = {
    option: (r, u) => l == null ? void 0 : l.option(r, u),
    destroy: () => {
      l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Le = () => y == null ? void 0 : y.option("disabled", !0), Se = () => y == null ? void 0 : y.option("disabled", !1);
  return on(() => {
    O && K();
  }), tn(y.destroy), te(C({
    start: K,
    pause: Le,
    resume: Se
  }, y), {
    draggedData: he
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
  ...J.map((e) => `on${e.replace(/^\S/, (n) => n.toUpperCase())}`)
], an = Be({
  name: "VueDraggable",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: ln,
  emits: ["update:modelValue", ...J],
  setup(e, { slots: n, emit: t, expose: o, attrs: i }) {
    const m = J.reduce((b, S) => {
      const D = `on${S.replace(/^\S/, (h) => h.toUpperCase())}`;
      return b[D] = (...h) => t(S, ...h), b;
    }, {}), l = oe(() => {
      const h = Ee(e), { modelValue: b } = h, S = $(h, ["modelValue"]), D = Object.entries(S).reduce((E, [U, F]) => {
        const H = p(F);
        return H !== void 0 && (E[U] = H), E;
      }, {});
      return C(C({}, m), Fe(C(C({}, i), D)));
    }), O = oe({
      get: () => e.modelValue,
      set: (b) => t("update:modelValue", b)
    }), L = He(), B = Me(
      ve(e.target || L, O, l)
    );
    return o(B), () => {
      var b;
      return _e(e.tag || "div", { ref: L }, (b = n == null ? void 0 : n.default) == null ? void 0 : b.call(n, B));
    };
  }
}), ge = {
  mounted: "mounted",
  unmounted: "unmounted"
}, Y = /* @__PURE__ */ new WeakMap(), dn = {
  [ge.mounted](e, n) {
    const t = Pe(n.value) ? [n.value] : n.value, [o, i] = t, m = ve(e, o, i);
    Y.set(e, m.destroy);
  },
  [ge.unmounted](e) {
    var n;
    (n = Y.get(e)) == null || n(), Y.delete(e);
  }
};
export {
  an as VueDraggable,
  ve as useDraggable,
  dn as vDraggable
};
