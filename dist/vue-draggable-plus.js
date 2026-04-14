var Ie = Object.defineProperty, Ee = Object.defineProperties;
var xe = Object.getOwnPropertyDescriptors;
var _ = Object.getOwnPropertySymbols;
var ne = Object.prototype.hasOwnProperty, te = Object.prototype.propertyIsEnumerable;
var ee = (e, n, t) => n in e ? Ie(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t, O = (e, n) => {
  for (var t in n || (n = {}))
    ne.call(n, t) && ee(e, t, n[t]);
  if (_)
    for (var t of _(n))
      te.call(n, t) && ee(e, t, n[t]);
  return e;
}, oe = (e, n) => Ee(e, xe(n));
var F = (e, n) => {
  var t = {};
  for (var o in e)
    ne.call(e, o) && n.indexOf(o) < 0 && (t[o] = e[o]);
  if (e != null && _)
    for (var o of _(e))
      n.indexOf(o) < 0 && te.call(e, o) && (t[o] = e[o]);
  return t;
};
import { shallowRef as me, getCurrentInstance as X, unref as d, watch as Me, onUnmounted as Ne, onMounted as Be, nextTick as be, isRef as $, defineComponent as Re, computed as re, toRefs as He, ref as _e, reactive as Pe, h as Ve, isProxy as Ue } from "vue";
import M from "sortablejs";
const ye = "[vue-draggable-plus]: ";
function ke(e) {
  console.warn(ye + e);
}
function ze(e) {
  console.error(ye + e);
}
function le(e, n, t) {
  return t >= 0 && t < e.length && e.splice(t, 0, e.splice(n, 1)[0]), e;
}
function Fe(e) {
  return e.replace(/-(\w)/g, (n, t) => t ? t.toUpperCase() : "");
}
function $e(e) {
  return Object.keys(e).reduce((n, t) => (typeof e[t] != "undefined" && (n[Fe(t)] = e[t]), n), {});
}
function ie(e, n) {
  return Array.isArray(e) && e.splice(n, 1), e;
}
function se(e, n, t) {
  return Array.isArray(e) && e.splice(n, 0, t), e;
}
function je(e) {
  return typeof e == "undefined";
}
function Ye(e) {
  return typeof e == "string";
}
function ue(e, n, t) {
  const o = e.children[t];
  e.insertBefore(n, o);
}
function j(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function qe(e, n = document) {
  var o;
  let t = null;
  return typeof (n == null ? void 0 : n.querySelector) == "function" ? t = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, e) : t = document.querySelector(e), t || ke(`Element not found: ${e}`), t;
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
function T() {
  return M.dragged;
}
function G(e) {
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
    const t = T();
    t && t[E] !== e.sortable.el && (t[E] && G(t), Ze(t, n, e.sortable.el));
  },
  dragOverGlobal(e) {
    e.isOwner && G(T());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const e = T();
    G(e), e && e.style.display === "none" && (e.style.display = "");
  },
  dropGlobal() {
    G(T());
  },
  nullingGlobal() {
    G(T());
  }
};
P.pluginName = "cloneGhost";
P.initializeByDefault = !0;
const x = /* @__PURE__ */ new Map();
let I = null;
function en(e, n, t) {
  return e >= t.left && e <= t.right && n >= t.top && n <= t.bottom;
}
function nn() {
  if (I)
    return;
  console.log(
    "[dragStateTracker] listener installed, registrations:",
    x.size
  );
  const e = (n) => {
    const t = M.dragged;
    x.forEach(({ isDragOver: o, getOptions: i }, f) => {
      var b;
      const l = en(
        n.clientX,
        n.clientY,
        f.getBoundingClientRect()
      );
      o.value !== l && (console.log("[dragStateTracker]", f, "→", l), o.value = l, t && t.parentNode === f && ((b = i()) != null && b.hideOnLeave) && (t.style.display = l ? "" : "none"));
    });
  };
  document.addEventListener("pointermove", e), I = e;
}
function tn() {
  I && (document.removeEventListener("pointermove", I), I = null);
}
function on() {
  x.forEach(({ isDragOver: e }) => {
    e.value && (e.value = !1);
  });
}
function rn(e, n, t) {
  return x.set(e, { isDragOver: n, getOptions: t }), {
    dispose: () => {
      x.delete(e);
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
    const e = M.dragged;
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
function sn() {
  de || (de = !0, M.mount(
    P,
    V,
    U
  ));
}
sn();
function un(e) {
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
  let [, i, f] = e;
  Array.isArray(d(i)) || (f = i, i = null);
  let l = null, b = null;
  const D = ln(), {
    immediate: N = !0,
    clone: y = un,
    forceFallback: C,
    fallbackOnBody: A,
    customUpdate: h
  } = (Z = d(f)) != null ? Z : {};
  function B(r) {
    var m;
    const { from: s, oldIndex: a, item: g } = r, u = Array.from(s.childNodes);
    t = C && !A ? u.slice(0, -1) : u;
    const c = d((m = d(i)) == null ? void 0 : m[a]), p = y(c);
    fe(c, p), g[ge] = p;
  }
  function k(r) {
    const s = r.item[ge];
    if (!je(s)) {
      if (j(r.item), $(i)) {
        const a = [...d(i)];
        i.value = se(a, r.newDraggableIndex, s);
        return;
      }
      se(d(i), r.newDraggableIndex, s);
    }
  }
  function z(r) {
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, pullMode: c, clone: p } = r;
    if (ue(s, a, g), c === "clone") {
      j(p);
      return;
    }
    if ($(i)) {
      const m = [...d(i)];
      i.value = ie(m, u);
      return;
    }
    ie(d(i), u);
  }
  function R(r) {
    if (h) {
      h(r);
      return;
    }
    const { from: s, item: a, oldIndex: g, oldDraggableIndex: u, newDraggableIndex: c } = r;
    if (j(a), ue(s, a, g), $(i)) {
      const p = [...d(i)];
      i.value = le(
        p,
        u,
        c
      );
      return;
    }
    le(d(i), u, c);
  }
  function Ce(r) {
    const { newIndex: s, oldIndex: a, from: g, to: u } = r;
    let c = null;
    const p = s === a && g === u;
    try {
      if (p) {
        let m = null;
        t == null || t.some((L, S) => {
          if (m && (t == null ? void 0 : t.length) !== u.childNodes.length)
            return g.insertBefore(m, L.nextSibling), !0;
          const H = u.childNodes[S];
          m = u == null ? void 0 : u.replaceChild(L, H);
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
  const De = {
    onUpdate: R,
    onStart: B,
    onAdd: k,
    onRemove: z,
    onEnd: Ce
  };
  function Ae(r) {
    const s = d(o);
    return r || (r = Ye(s) ? qe(s, n == null ? void 0 : n.$el) : s), r && !Ke(r) && (r = r.$el), r || ze("Root element not found"), r;
  }
  function K() {
    var m;
    const L = (m = d(f)) != null ? m : {}, { immediate: r, clone: s } = L, a = F(L, ["immediate", "clone"]);
    ae(a, (S, H) => {
      We(S) && (a[S] = (w, ...Te) => {
        const Ge = dn();
        return Qe(w, Ge), H(w, ...Te);
      });
    });
    const g = a.onAdd;
    delete a.onAdd;
    const u = i === null ? {} : De, c = Xe(u, a), p = u.onAdd;
    return (g || p) && (c.onAdd = function(S) {
      var w;
      if (((w = S.item) == null ? void 0 : w.style.display) === "none")
        return;
      (g == null ? void 0 : g.call(this, S)) !== !1 && (p == null || p.call(this, S));
    }), c;
  }
  const W = (r) => {
    r = Ae(r), l && v.destroy(), l = new M(r, K()), b = rn(
      r,
      D,
      () => d(f)
    ).dispose;
  };
  Me(
    () => f,
    () => {
      l && ae(K(), (r, s) => {
        l == null || l.option(r, s);
      });
    },
    { deep: !0 }
  );
  const v = {
    option: (r, s) => l == null ? void 0 : l.option(r, s),
    destroy: () => {
      b == null || b(), b = null, l == null || l.destroy(), l = null;
    },
    save: () => l == null ? void 0 : l.save(),
    toArray: () => l == null ? void 0 : l.toArray(),
    closest: (...r) => l == null ? void 0 : l.closest(...r)
  }, Le = () => v == null ? void 0 : v.option("disabled", !0), we = () => v == null ? void 0 : v.option("disabled", !1);
  return cn(() => {
    N && W();
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
    const f = J.reduce((y, C) => {
      const A = `on${C.replace(/^\S/, (h) => h.toUpperCase())}`;
      return y[A] = (...h) => t(C, ...h), y;
    }, {}), l = re(() => {
      const h = He(e), { modelValue: y } = h, C = F(h, ["modelValue"]), A = Object.entries(C).reduce((B, [k, z]) => {
        const R = d(z);
        return R !== void 0 && (B[k] = R), B;
      }, {});
      return O(O({}, f), $e(O(O({}, i), A)));
    }), b = re({
      get: () => e.modelValue,
      set: (y) => t("update:modelValue", y)
    }), D = _e(), N = Pe(
      Oe(e.target || D, b, l)
    );
    return o(N), () => {
      var y;
      return Ve(e.tag || "div", { ref: D }, (y = n == null ? void 0 : n.default) == null ? void 0 : y.call(n, N));
    };
  }
}), pe = {
  mounted: "mounted",
  unmounted: "unmounted"
}, Y = /* @__PURE__ */ new WeakMap(), yn = {
  [pe.mounted](e, n) {
    const t = Ue(n.value) ? [n.value] : n.value, [o, i] = t, f = Oe(e, o, i);
    Y.set(e, f.destroy);
  },
  [pe.unmounted](e) {
    var n;
    (n = Y.get(e)) == null || n(), Y.delete(e);
  }
};
export {
  bn as VueDraggable,
  Oe as useDraggable,
  yn as vDraggable
};
