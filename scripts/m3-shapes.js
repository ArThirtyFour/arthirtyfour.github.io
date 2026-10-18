(() => {
  var Bt = Object.defineProperty;
  var Nt = (r, t, e) =>
    t in r
      ? Bt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (r[t] = e);
  var h = (r, t, e) => Nt(r, typeof t != "symbol" ? t + "" : t, e);
  function Xt(r, t, e) {
    return r + (t - r) * e;
  }
  var b = class r {
    constructor(t, e) {
      h(this, "x");
      h(this, "y");
      ((this.x = t), (this.y = e));
    }
    static interpolate(t, e, n) {
      return new r(Xt(t.x, e.x, n), Xt(t.y, e.y, n));
    }
    copy(t = this.x, e = this.y) {
      return new r(t, e);
    }
    getDistance() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    getDistanceSquared() {
      return this.x * this.x + this.y * this.y;
    }
    dotProduct(t, e) {
      return t instanceof r
        ? this.x * t.x + this.y * t.y
        : this.x * t + this.y * e;
    }
    clockwise(t) {
      return this.x * t.y - this.y * t.x > 0;
    }
    getDirection() {
      let t = this.getDistance();
      if (t <= 0)
        throw new Error("Can't get the direction of a 0-length vector");
      return this.div(t);
    }
    unaryMinus() {
      return new r(-this.x, -this.y);
    }
    minus(t) {
      return new r(this.x - t.x, this.y - t.y);
    }
    plus(t) {
      return new r(this.x + t.x, this.y + t.y);
    }
    times(t) {
      return new r(this.x * t, this.y * t);
    }
    div(t) {
      return new r(this.x / t, this.y / t);
    }
    rem(t) {
      return new r(this.x % t, this.y % t);
    }
    transformed(t) {
      let e = t.transform(this.x, this.y);
      return new r(e.first, e.second);
    }
    rotate90() {
      return new r(-this.y, this.x);
    }
  };
  function J(r, t) {
    return Math.sqrt(r * r + t * t);
  }
  function U(r, t) {
    if (t !== void 0) {
      let e = J(r, t);
      if (e <= 0) throw new Error("Required distance greater than zero");
      return new b(r / e, t / e);
    } else return new b(Math.cos(r), Math.sin(r));
  }
  function L(r, t, e = new b(0, 0)) {
    return U(t).times(r).plus(e);
  }
  var Y = 1e-4,
    gt = 1e-6;
  var he = new b(0, 0),
    A = Math.PI,
    St = 2 * Math.PI;
  function nt(r) {
    return r * r;
  }
  function _(r, t, e) {
    return (1 - e) * r + e * t;
  }
  function k(r, t) {
    return ((r % t) + t) % t;
  }
  function st(r, t, e) {
    return t.minus(r).clockwise(e.minus(t));
  }
  var rt = !1;
  function M(r, t) {
    rt && console.log(`${r}: ${t()}`);
  }
  var R = class r {
      constructor(t = [0, 0, 0, 0, 0, 0, 0, 0]) {
        h(this, "points");
        if (((this.points = t), t.length !== 8))
          throw new Error("Points array size should be 8");
      }
      get anchor0X() {
        return this.points[0];
      }
      get anchor0Y() {
        return this.points[1];
      }
      get control0X() {
        return this.points[2];
      }
      get control0Y() {
        return this.points[3];
      }
      get control1X() {
        return this.points[4];
      }
      get control1Y() {
        return this.points[5];
      }
      get anchor1X() {
        return this.points[6];
      }
      get anchor1Y() {
        return this.points[7];
      }
      static fromPoints(t, e, n, s) {
        return new r([t.x, t.y, e.x, e.y, n.x, n.y, s.x, s.y]);
      }
      pointOnCurve(t) {
        let e = 1 - t;
        return new b(
          this.anchor0X * (e * e * e) +
            this.control0X * (3 * t * e * e) +
            this.control1X * (3 * t * t * e) +
            this.anchor1X * (t * t * t),
          this.anchor0Y * (e * e * e) +
            this.control0Y * (3 * t * e * e) +
            this.control1Y * (3 * t * t * e) +
            this.anchor1Y * (t * t * t),
        );
      }
      zeroLength() {
        return (
          Math.abs(this.anchor0X - this.anchor1X) < Y &&
          Math.abs(this.anchor0Y - this.anchor1Y) < Y
        );
      }
      convexTo(t) {
        let e = new b(this.anchor0X, this.anchor0Y),
          n = new b(this.anchor1X, this.anchor1Y),
          s = new b(t.anchor1X, t.anchor1Y);
        return st(e, n, s);
      }
      zeroIsh(t) {
        return Math.abs(t) < Y;
      }
      calculateBounds(t = [0, 0, 0, 0], e = !1) {
        if (this.zeroLength()) {
          ((t[0] = this.anchor0X),
            (t[1] = this.anchor0Y),
            (t[2] = this.anchor0X),
            (t[3] = this.anchor0Y));
          return;
        }
        let n = Math.min(this.anchor0X, this.anchor1X),
          s = Math.min(this.anchor0Y, this.anchor1Y),
          o = Math.max(this.anchor0X, this.anchor1X),
          i = Math.max(this.anchor0Y, this.anchor1Y);
        if (e) {
          ((t[0] = Math.min(n, this.control0X, this.control1X)),
            (t[1] = Math.min(s, this.control0Y, this.control1Y)),
            (t[2] = Math.max(o, this.control0X, this.control1X)),
            (t[3] = Math.max(i, this.control0Y, this.control1Y)));
          return;
        }
        let c =
            -this.anchor0X +
            3 * this.control0X -
            3 * this.control1X +
            this.anchor1X,
          f = 2 * this.anchor0X - 4 * this.control0X + 2 * this.control1X,
          d = -this.anchor0X + this.control0X;
        if (this.zeroIsh(c)) {
          if (f !== 0) {
            let m = (2 * d) / (-2 * f);
            if (m >= 0 && m <= 1) {
              let p = this.pointOnCurve(m).x;
              ((n = Math.min(n, p)), (o = Math.max(o, p)));
            }
          }
        } else {
          let m = f * f - 4 * c * d;
          if (m >= 0) {
            let p = Math.sqrt(m),
              P = (-f + p) / (2 * c);
            if (P >= 0 && P <= 1) {
              let C = this.pointOnCurve(P).x;
              ((n = Math.min(n, C)), (o = Math.max(o, C)));
            }
            let v = (-f - p) / (2 * c);
            if (v >= 0 && v <= 1) {
              let C = this.pointOnCurve(v).x;
              ((n = Math.min(n, C)), (o = Math.max(o, C)));
            }
          }
        }
        let a =
            -this.anchor0Y +
            3 * this.control0Y -
            3 * this.control1Y +
            this.anchor1Y,
          g = 2 * this.anchor0Y - 4 * this.control0Y + 2 * this.control1Y,
          x = -this.anchor0Y + this.control0Y;
        if (this.zeroIsh(a)) {
          if (g !== 0) {
            let m = (2 * x) / (-2 * g);
            if (m >= 0 && m <= 1) {
              let p = this.pointOnCurve(m).y;
              ((s = Math.min(s, p)), (i = Math.max(i, p)));
            }
          }
        } else {
          let m = g * g - 4 * a * x;
          if (m >= 0) {
            let p = Math.sqrt(m),
              P = (-g + p) / (2 * a);
            if (P >= 0 && P <= 1) {
              let C = this.pointOnCurve(P).y;
              ((s = Math.min(s, C)), (i = Math.max(i, C)));
            }
            let v = (-g - p) / (2 * a);
            if (v >= 0 && v <= 1) {
              let C = this.pointOnCurve(v).y;
              ((s = Math.min(s, C)), (i = Math.max(i, C)));
            }
          }
        }
        ((t[0] = n), (t[1] = s), (t[2] = o), (t[3] = i));
      }
      split(t) {
        let e = 1 - t,
          n = this.pointOnCurve(t),
          s = new r([
            this.anchor0X,
            this.anchor0Y,
            this.anchor0X * e + this.control0X * t,
            this.anchor0Y * e + this.control0Y * t,
            this.anchor0X * (e * e) +
              this.control0X * (2 * e * t) +
              this.control1X * (t * t),
            this.anchor0Y * (e * e) +
              this.control0Y * (2 * e * t) +
              this.control1Y * (t * t),
            n.x,
            n.y,
          ]),
          o = new r([
            n.x,
            n.y,
            this.control0X * (e * e) +
              this.control1X * (2 * e * t) +
              this.anchor1X * (t * t),
            this.control0Y * (e * e) +
              this.control1Y * (2 * e * t) +
              this.anchor1Y * (t * t),
            this.control1X * e + this.anchor1X * t,
            this.control1Y * e + this.anchor1Y * t,
            this.anchor1X,
            this.anchor1Y,
          ]);
        return [s, o];
      }
      reverse() {
        return new r([
          this.anchor1X,
          this.anchor1Y,
          this.control1X,
          this.control1Y,
          this.control0X,
          this.control0Y,
          this.anchor0X,
          this.anchor0Y,
        ]);
      }
      plus(t) {
        return new r(this.points.map((e, n) => e + t.points[n]));
      }
      times(t) {
        return new r(this.points.map((e) => e * t));
      }
      div(t) {
        return this.times(1 / t);
      }
      toString() {
        return `anchor0: (${this.anchor0X}, ${this.anchor0Y}) control0: (${this.control0X}, ${this.control0Y}), control1: (${this.control1X}, ${this.control1Y}), anchor1: (${this.anchor1X}, ${this.anchor1Y})`;
      }
      equals(t) {
        return this === t
          ? !0
          : t instanceof r
            ? this.points.every((e, n) => e === t.points[n])
            : !1;
      }
      transformed(t) {
        let e = new K();
        return ((e.points = [...this.points]), e.transform(t), e);
      }
      static straightLine(t, e, n, s) {
        return new r([
          t,
          e,
          _(t, n, 1 / 3),
          _(e, s, 1 / 3),
          _(t, n, 2 / 3),
          _(e, s, 2 / 3),
          n,
          s,
        ]);
      }
      static circularArc(t, e, n, s, o, i) {
        let c = U(n - t, s - e),
          f = U(o - t, i - e),
          d = c.rotate90(),
          a = f.rotate90(),
          g = d.dotProduct(o - t, i - e) >= 0,
          x = c.dotProduct(f);
        if (x > 0.999) return r.straightLine(n, s, o, i);
        let m =
          ((((J(n - t, s - e) * 4) / 3) *
            (Math.sqrt(2 * (1 - x)) - Math.sqrt(1 - x * x))) /
            (1 - x)) *
          (g ? 1 : -1);
        return new r([
          n,
          s,
          n + d.x * m,
          s + d.y * m,
          o - a.x * m,
          i - a.y * m,
          o,
          i,
        ]);
      }
      static empty(t, e) {
        return new r([t, e, t, e, t, e, t, e]);
      }
      static extend(t, e) {
        return t.zeroLength()
          ? new r([
              t.anchor0X,
              t.anchor0Y,
              e.control0X,
              e.control0Y,
              e.control1X,
              e.control1Y,
              e.anchor1X,
              e.anchor1Y,
            ])
          : new r([
              t.anchor0X,
              t.anchor0Y,
              t.control0X,
              t.control0Y,
              t.control1X,
              t.control1Y,
              e.anchor1X,
              e.anchor1Y,
            ]);
      }
    },
    K = class extends R {
      transformOnePoint(t, e) {
        let n = t.transform(this.points[e], this.points[e + 1]);
        ((this.points[e] = n.first), (this.points[e + 1] = n.second));
      }
      transform(t) {
        (this.transformOnePoint(t, 0),
          this.transformOnePoint(t, 2),
          this.transformOnePoint(t, 4),
          this.transformOnePoint(t, 6));
      }
      interpolate(t, e, n) {
        for (let s = 0; s < 8; s++)
          this.points[s] = _(t.points[s], e.points[s], n);
      }
    };
  var ot = class r {
      constructor(t) {
        h(this, "cubics");
        this.cubics = t;
      }
      static buildIgnorableFeature(t) {
        return r.validated(new H(t));
      }
      static buildEdge(t) {
        return new H([t]);
      }
      static buildConvexCorner(t) {
        return r.validated(new F(t, !0));
      }
      static buildConcaveCorner(t) {
        return r.validated(new F(t, !1));
      }
      static validated(t) {
        if (t.cubics.length === 0)
          throw new Error("Features need at least one cubic.");
        if (!r.isContinuous(t))
          throw new Error(
            "Feature must be continuous, with the anchor points of all cubics matching the anchor points of the preceding and succeeding cubics",
          );
        return t;
      }
      static isContinuous(t) {
        let e = t.cubics[0];
        for (let n = 1; n < t.cubics.length; n++) {
          let s = t.cubics[n];
          if (
            Math.abs(s.anchor0X - e.anchor1X) > Y ||
            Math.abs(s.anchor0Y - e.anchor1Y) > Y
          )
            return !1;
          e = s;
        }
        return !0;
      }
    },
    H = class r extends ot {
      constructor(t) {
        super(t);
      }
      transformed(t) {
        return new r(this.cubics.map((e) => e.transformed(t)));
      }
      reversed() {
        return new r(this.cubics.map((t) => t.reverse()).reverse());
      }
      equals(t) {
        return this === t
          ? !0
          : !(t instanceof r) || this.cubics.length !== t.cubics.length
            ? !1
            : this.cubics.every((e, n) => e.equals(t.cubics[n]));
      }
      get isIgnorableFeature() {
        return !0;
      }
      get isEdge() {
        return !0;
      }
      get isConvexCorner() {
        return !1;
      }
      get isConcaveCorner() {
        return !1;
      }
      toString() {
        return "Edge";
      }
    },
    F = class r extends ot {
      constructor(e, n = !0) {
        super(e);
        h(this, "convex");
        this.convex = n;
      }
      transformed(e) {
        return new r(
          this.cubics.map((n) => n.transformed(e)),
          this.convex,
        );
      }
      reversed() {
        return new r(
          this.cubics.map((e) => e.reverse()).reverse(),
          !this.convex,
        );
      }
      equals(e) {
        return this === e
          ? !0
          : !(e instanceof r) ||
              this.convex !== e.convex ||
              this.cubics.length !== e.cubics.length
            ? !1
            : this.cubics.every((n, s) => n.equals(e.cubics[s]));
      }
      get isIgnorableFeature() {
        return !1;
      }
      get isEdge() {
        return !1;
      }
      get isConvexCorner() {
        return this.convex;
      }
      get isConcaveCorner() {
        return !this.convex;
      }
      toString() {
        return `Corner: cubics=${this.cubics.map((e) => `[${e}]`).join(", ")} convex=${this.convex}`;
      }
    };
  function Z(r, t = 3) {
    return r.toFixed(t);
  }
  function Lt(r, t, e) {
    return e >= t ? r >= t && r <= e : r >= t || r <= e;
  }
  function pt(r, t, e) {
    if (e < 0 || e > 1) throw new Error(`Invalid progress: ${e}`);
    let n = r.findIndex((f, d) => Lt(e, r[d], r[(d + 1) % r.length]));
    if (n === -1)
      throw new Error(
        `No segment found in linearMap for x=${e} over ${r.join(", ")}`,
      );
    let s = (n + 1) % r.length,
      o = k(r[s] - r[n], 1),
      i = k(t[s] - t[n], 1),
      c = o < 0.001 ? 0.5 : k(e - r[n], 1) / o;
    return k(t[n] + i * c, 1);
  }
  function xt(r) {
    let t = r[r.length - 1],
      e = 0;
    for (let n = 0; n < r.length; n++) {
      let s = r[n];
      if (s < 0 || s >= 1)
        throw new Error(
          `FloatMapping - Progress outside of range: ${r.join(", ")}`,
        );
      if (qt(s, t) <= Y)
        throw new Error(
          `FloatMapping - Progress repeats a value: ${r.join(", ")}`,
        );
      if (s < t && (e++, e > 1))
        throw new Error(
          `FloatMapping - Progress wraps more than once: ${r.join(", ")}`,
        );
      t = s;
    }
  }
  function qt(r, t) {
    let e = Math.abs(r - t);
    return Math.min(e, 1 - e);
  }
  var ct = class ct {
    constructor(t) {
      h(this, "sourceValues");
      h(this, "targetValues");
      ((this.sourceValues = t.map((e) => e[0])),
        (this.targetValues = t.map((e) => e[1])),
        xt(this.sourceValues),
        xt(this.targetValues));
    }
    map(t) {
      return pt(this.sourceValues, this.targetValues, t);
    }
    mapBack(t) {
      return pt(this.targetValues, this.sourceValues, t);
    }
  };
  h(
    ct,
    "Identity",
    new ct([
      [0, 0],
      [0.5, 0.5],
    ]),
  );
  var it = ct;
  var tt = "FeatureMapping";
  function Rt(r, t) {
    let e = r.filter((i) => i.feature instanceof F),
      n = t.filter((i) => i.feature instanceof F),
      s = Vt(e, n);
    M(tt, () => s.map(([i, c]) => `${i} -> ${c}`).join(" "));
    let o = new it(s);
    return (
      M(tt, () => {
        let c = Array.from({ length: 11 }, (d, a) => Z(o.map(a / 10))).join(
            " ",
          ),
          f = Array.from({ length: 11 }, (d, a) => Z(o.mapBack(a / 10))).join(
            " ",
          );
        return `Map: ${c}
Mb : ${f}`;
      }),
      o
    );
  }
  function Vt(r, t) {
    (M(tt, () => `Shape1 progresses: ${r.map((s) => s.progress).join(" ")}`),
      M(tt, () => `Shape2 progresses: ${t.map((s) => s.progress).join(" ")}`));
    let e = r
      .flatMap((s) =>
        t.map((o) => {
          let i = Gt(s.feature, o.feature);
          return i !== 1 / 0 ? { distance: i, f1: s, f2: o } : null;
        }),
      )
      .filter((s) => s !== null)
      .sort((s, o) => s.distance - o.distance);
    if (e.length === 0)
      return [
        [0, 0],
        [0.5, 0.5],
      ];
    if (e.length === 1) {
      let { f1: s, f2: o } = e[0];
      return [
        [s.progress, o.progress],
        [(s.progress + 0.5) % 1, (o.progress + 0.5) % 1],
      ];
    }
    let n = new yt();
    return (e.forEach(({ f1: s, f2: o }) => n.addMapping(s, o)), n.mapping);
  }
  var yt = class {
    constructor() {
      h(this, "mapping", []);
      h(this, "usedF1", new Set());
      h(this, "usedF2", new Set());
    }
    addMapping(t, e) {
      if (this.usedF1.has(t) || this.usedF2.has(e)) return;
      let n = this.mapping.findIndex(([i, c]) => i > t.progress),
        s = n === -1 ? this.mapping.length : n,
        o = this.mapping.length;
      if (o >= 1) {
        let [i, c] = this.mapping[(s + o - 1) % o],
          [f, d] = this.mapping[s % o];
        if (
          at(t.progress, i) < Y ||
          at(t.progress, f) < Y ||
          at(e.progress, c) < Y ||
          at(e.progress, d) < Y ||
          (o > 1 && !jt(e.progress, c, d))
        )
          return;
      }
      (this.mapping.splice(s, 0, [t.progress, e.progress]),
        this.usedF1.add(t),
        this.usedF2.add(e));
    }
  };
  function at(r, t) {
    let e = Math.abs(r - t);
    return Math.min(e, 1 - e);
  }
  function jt(r, t, e) {
    return e >= t ? r >= t && r <= e : r >= t || r <= e;
  }
  function Gt(r, t) {
    if (r instanceof F && t instanceof F && r.convex !== t.convex)
      return (
        M(
          tt,
          () => "*** Feature distance \u221E for convex-vs-concave corners",
        ),
        1 / 0
      );
    let e = $t(r),
      n = $t(t);
    return e.minus(n).getDistanceSquared();
  }
  function $t(r) {
    let t = r.cubics[0],
      e = r.cubics[r.cubics.length - 1],
      n = (t.anchor0X + e.anchor1X) / 2,
      s = (t.anchor0Y + e.anchor1Y) / 2;
    return new b(n, s);
  }
  var W = "PolygonMeasure",
    Et = !1,
    G = class r extends Array {
      constructor(e, n, s, o) {
        super();
        h(this, "measurer");
        h(this, "features");
        if (
          ((this.measurer = e), (this.features = n), o.length !== s.length + 1)
        )
          throw new Error(
            "Outline progress size is expected to be the cubics size + 1",
          );
        if (o[0] !== 0)
          throw new Error(
            "First outline progress value is expected to be zero",
          );
        if (o[o.length - 1] !== 1)
          throw new Error("Last outline progress value is expected to be one");
        Et &&
          M(
            W,
            () => `CTOR: cubics = ${s.join()}
CTOR: op = ${o.join()}`,
          );
        let i = 0;
        for (let c = 0; c < s.length; c++)
          o[c + 1] - o[c] > Y &&
            (this.push(new r.MeasuredCubic(this.measurer, s[c], i, o[c + 1])),
            (i = o[c + 1]));
        this[this.length - 1].updateProgressRange(void 0, 1);
      }
      cutAndShift(e) {
        if (e < 0 || e > 1)
          throw new Error("Cutting point is expected to be between 0 and 1");
        if (e < Y) return this;
        let n = this.findIndex(
            (a) => e >= a.startOutlineProgress && e <= a.endOutlineProgress,
          ),
          s = this[n];
        Et &&
          (this.forEach((a, g) =>
            M(W, () => `cut&Shift | cubic #${g} : ${a} `),
          ),
          M(W, () => `cut&Shift, cuttingPoint = ${e}, target = (${n}) ${s}`));
        let [o, i] = s.cutAtProgress(e);
        M(W, () => `Split | ${s} -> ${o} & ${i}`);
        let c = [i.cubic];
        for (let a = 1; a < this.length; a++)
          c.push(this[(a + n) % this.length].cubic);
        c.push(o.cubic);
        let f = [0];
        for (let a = 0; a < this.length; a++) {
          let g = (n + a) % this.length;
          f.push(k(this[g].endOutlineProgress - e, 1));
        }
        f.push(1);
        let d = this.features.map((a) => ({
          progress: k(a.progress - e, 1),
          feature: a.feature,
        }));
        return new r(this.measurer, d, c, f);
      }
      static measurePolygon(e, n) {
        let s = [],
          o = [];
        for (let a of n.features)
          for (let g = 0; g < a.cubics.length; g++)
            (a instanceof F &&
              g === Math.floor(a.cubics.length / 2) &&
              o.push([a, s.length]),
              s.push(a.cubics[g]));
        let i = s.reduce(
            (a, g) => {
              let x = e.measureCubic(g);
              if (x < 0)
                throw new Error(
                  "Measured cubic is expected to be greater or equal to zero",
                );
              return (a.push(a[a.length - 1] + x), a);
            },
            [0],
          ),
          c = i[i.length - 1],
          f = i.map((a) => a / c);
        M(W, () => `Total size: ${c}`);
        let d = o.map(([a, g]) => ({
          progress: k((f[g] + f[g + 1]) / 2, 1),
          feature: a,
        }));
        return new r(e, d, s, f);
      }
    };
  (function (r) {
    class t {
      constructor(n, s, o, i) {
        h(this, "measurer");
        h(this, "cubic");
        h(this, "startOutlineProgress");
        h(this, "endOutlineProgress");
        h(this, "measuredSize");
        if (
          ((this.measurer = n),
          (this.cubic = s),
          (this.startOutlineProgress = o),
          (this.endOutlineProgress = i),
          i < o)
        )
          throw new Error(
            "endOutlineProgress is expected to be equal or greater than startOutlineProgress",
          );
        this.measuredSize = n.measureCubic(s);
      }
      updateProgressRange(
        n = this.startOutlineProgress,
        s = this.endOutlineProgress,
      ) {
        if (s < n)
          throw new Error(
            "endOutlineProgress is expected to be equal or greater than startOutlineProgress",
          );
        ((this.startOutlineProgress = n), (this.endOutlineProgress = s));
      }
      cutAtProgress(n) {
        let s = Math.max(
            this.startOutlineProgress,
            Math.min(n, this.endOutlineProgress),
          ),
          o = this.endOutlineProgress - this.startOutlineProgress,
          i = s - this.startOutlineProgress,
          c = i / o,
          f = this.measurer.findCubicCutPoint(
            this.cubic,
            c * this.measuredSize,
          );
        if (f < 0 || f > 1)
          throw new Error("Cubic cut point is expected to be between 0 and 1");
        M(
          W,
          () =>
            `cutAtProgress: progress = ${s} / this = [${this.startOutlineProgress} .. ${this.endOutlineProgress}] / ps = ${i} / rp = ${c} / t = ${f}`,
        );
        let [d, a] = this.cubic.split(f);
        return [
          new t(this.measurer, d, this.startOutlineProgress, s),
          new t(this.measurer, a, s, this.endOutlineProgress),
        ];
      }
      toString() {
        return `MeasuredCubic(outlineProgress=[${this.startOutlineProgress} .. ${this.endOutlineProgress}], size=${this.measuredSize}, cubic=${this.cubic})`;
      }
    }
    r.MeasuredCubic = t;
  })(G || (G = {}));
  var et = class {
    constructor() {
      h(this, "segments", 3);
    }
    measureCubic(t) {
      return this.closestProgressTo(t, 1 / 0)[1];
    }
    findCubicCutPoint(t, e) {
      return this.closestProgressTo(t, e)[0];
    }
    closestProgressTo(t, e) {
      let n = 0,
        s = e,
        o = new b(t.anchor0X, t.anchor0Y);
      for (let i = 1; i <= this.segments; i++) {
        let c = i / this.segments,
          f = t.pointOnCurve(c),
          d = f.minus(o).getDistance();
        if (d >= s) return [c - (1 - s / d) / this.segments, e];
        ((s -= d), (n += d), (o = f));
      }
      return [1, n];
    }
  };
  var q = "Morph",
    ht = class r {
      constructor(t, e) {
        h(this, "start");
        h(this, "end");
        h(this, "morphMatch");
        ((this.start = t), (this.end = e), (this.morphMatch = r.match(t, e)));
      }
      calculateBounds(t = [0, 0, 0, 0], e = !0) {
        this.start.calculateBounds(t, e);
        let [n, s, o, i] = t;
        return (
          this.end.calculateBounds(t, e),
          (t[0] = Math.min(n, t[0])),
          (t[1] = Math.min(s, t[1])),
          (t[2] = Math.max(o, t[2])),
          (t[3] = Math.max(i, t[3])),
          t
        );
      }
      calculateMaxBounds(t = [0, 0, 0, 0]) {
        this.start.calculateMaxBounds(t);
        let [e, n, s, o] = t;
        return (
          this.end.calculateMaxBounds(t),
          (t[0] = Math.min(e, t[0])),
          (t[1] = Math.min(n, t[1])),
          (t[2] = Math.max(s, t[2])),
          (t[3] = Math.max(o, t[3])),
          t
        );
      }
      asCubics(t) {
        let e = [],
          n = null,
          s = null;
        for (let [o, i] of this.morphMatch) {
          let c = o.points.map((d, a) => _(d, i.points[a], t)),
            f = new R(c);
          (n || (n = f), s && e.push(s), (s = f));
        }
        return (
          s &&
            n &&
            e.push(
              new R([
                s.anchor0X,
                s.anchor0Y,
                s.control0X,
                s.control0Y,
                s.control1X,
                s.control1Y,
                n.anchor0X,
                n.anchor0Y,
              ]),
            ),
          e
        );
      }
      forEachCubic(t, e = new K(), n) {
        for (let [s, o] of this.morphMatch) (e.interpolate(s, o, t), n(e));
      }
      static match(t, e) {
        let n = G.measurePolygon(new et(), t),
          s = G.measurePolygon(new et(), e),
          o = n.features,
          i = s.features,
          c = Rt(o, i),
          f = c.map(0);
        M(q, () => `polygon2CutPoint = ${f}`);
        let d = n,
          a = s.cutAndShift(f);
        rt &&
          (d.forEach((v, C) => M(q, () => `start ${C}: ${v}`)),
          a.forEach((v, C) => M(q, () => `End ${C}: ${v}`)));
        let g = [],
          x = 0,
          m = 0,
          p = x < d.length ? d[x++] : null,
          P = m < a.length ? a[m++] : null;
        for (; p && P;) {
          let v = x === d.length ? 1 : p.endOutlineProgress,
            C = m === a.length ? 1 : c.mapBack(k(P.endOutlineProgress + f, 1)),
            S = Math.min(v, C);
          M(q, () => `${v} ${C} | ${S}`);
          let $, E;
          v > S + gt
            ? (M(q, () => "Cut 1"), ([$, E] = p.cutAtProgress(S)))
            : (($ = p), (E = x < d.length ? d[x++] : null));
          let X, Q;
          (C > S + gt
            ? (M(q, () => "Cut 2"),
              ([X, Q] = P.cutAtProgress(k(c.map(S) - f, 1))))
            : ((X = P), (Q = m < a.length ? a[m++] : null)),
            M(q, () => `Match: ${$} -> ${X}`),
            g.push([$.cubic, X.cubic]),
            (p = E),
            (P = Q));
        }
        if (p || P)
          throw new Error("Expected both Polygon's Cubic to be fully matched");
        if (rt) {
          let v = (C) => `${Z(C.x * 100)} ${Z(C.y * 100)}`;
          for (let C = 0; C < 2; C++) {
            let S = g.map((X) => (C === 0 ? X[0] : X[1])),
              $ = S[0],
              E =
                `M ${v(new b($.anchor0X, $.anchor0Y))} ` +
                S.map(
                  (X) =>
                    `C ${v(new b(X.control0X, X.control0Y))}, ${v(new b(X.control1X, X.control1Y))}, ${v(new b(X.anchor1X, X.anchor1Y))}`,
                ).join(" ") +
                " Z";
            M(q, () => E);
          }
        }
        return g;
      }
    };
  var ut = class ut {
    constructor(t = 0, e = 0) {
      h(this, "radius");
      h(this, "smoothing");
      ((this.radius = t), (this.smoothing = e));
    }
  };
  h(ut, "Unrounded", new ut());
  var w = ut;
  var O = class r {
    constructor(t, e) {
      h(this, "features");
      h(this, "center");
      h(this, "cubics");
      ((this.features = t),
        (this.center = e),
        (this.cubics = this.calculateCubics()),
        this.validate());
    }
    get centerX() {
      return this.center.x;
    }
    get centerY() {
      return this.center.y;
    }
    calculateCubics() {
      let t = [],
        e = null,
        n = null,
        s = null,
        o = null;
      if (this.features.length > 0 && this.features[0].cubics.length === 3) {
        let i = this.features[0].cubics[1],
          [c, f] = i.split(0.5);
        ((s = [this.features[0].cubics[0], c]),
          (o = [f, this.features[0].cubics[2]]));
      }
      for (let i = 0; i <= this.features.length; i++) {
        let c;
        if (i === 0 && o != null) c = o;
        else if (i === this.features.length)
          if (s != null) c = s;
          else break;
        else c = this.features[i].cubics;
        for (let f of c)
          if (!f.zeroLength())
            (n != null && t.push(n), (n = f), e == null && (e = f));
          else if (n != null) {
            let d = [...n.points];
            ((d[6] = f.anchor1X), (d[7] = f.anchor1Y), (n = new R(d)));
          }
      }
      return (
        n != null && e != null
          ? t.push(
              new R([
                n.anchor0X,
                n.anchor0Y,
                n.control0X,
                n.control0Y,
                n.control1X,
                n.control1Y,
                e.anchor0X,
                e.anchor0Y,
              ]),
            )
          : t.push(
              new R([
                this.centerX,
                this.centerY,
                this.centerX,
                this.centerY,
                this.centerX,
                this.centerY,
                this.centerX,
                this.centerY,
              ]),
            ),
        t
      );
    }
    validate() {
      if (this.cubics.length === 0) return;
      let t = this.cubics[this.cubics.length - 1];
      M("RoundedPolygon", () => `Cubic-1 = ${t}`);
      for (let e = 0; e < this.cubics.length; e++) {
        let n = this.cubics[e];
        if (
          (M("RoundedPolygon", () => `Cubic = ${n}`),
          Math.abs(n.anchor0X - t.anchor1X) > Y ||
            Math.abs(n.anchor0Y - t.anchor1Y) > Y)
        )
          throw (
            M(
              "RoundedPolygon",
              () => `Ix: ${e} | (${n.anchor0X},${n.anchor0Y}) vs ${t}`,
            ),
            new Error(
              "RoundedPolygon must be contiguous, with the anchor points of all curves matching the anchor points of the preceding and succeeding cubics",
            )
          );
        t = n;
      }
    }
    transformed(t) {
      let e = this.center.transformed(t),
        n = this.features.map((s) => s.transformed(t));
      return new r(n, e);
    }
    normalized() {
      let t = this.calculateBounds(),
        e = t[2] - t[0],
        n = t[3] - t[1],
        s = Math.max(e, n),
        o = (s - e) / 2 - t[0],
        i = (s - n) / 2 - t[1];
      return this.transformed({
        transform(c, f) {
          return { first: (c + o) / s, second: (f + i) / s };
        },
      });
    }
    toString() {
      return (
        "[RoundedPolygon. Cubics = " +
        this.cubics.join(", ") +
        " || Features = " +
        this.features.join(", ") +
        " || Center = (" +
        this.centerX +
        ", " +
        this.centerY +
        ")]"
      );
    }
    calculateMaxBounds(t = [0, 0, 0, 0]) {
      if (t.length < 4) throw new Error("Required bounds size of 4");
      let e = 0;
      for (let s of this.cubics) {
        let o = s.anchor0X - this.centerX,
          i = s.anchor0Y - this.centerY,
          c = o * o + i * i,
          f = s.pointOnCurve(0.5),
          d = f.x - this.centerX,
          a = f.y - this.centerY,
          g = d * d + a * a;
        e = Math.max(e, c, g);
      }
      let n = Math.sqrt(e);
      return (
        (t[0] = this.centerX - n),
        (t[1] = this.centerY - n),
        (t[2] = this.centerX + n),
        (t[3] = this.centerY + n),
        t
      );
    }
    calculateBounds(t = [0, 0, 0, 0], e = !0) {
      if (t.length < 4) throw new Error("Required bounds size of 4");
      let n = 1 / 0,
        s = 1 / 0,
        o = -1 / 0,
        i = -1 / 0,
        c = [0, 0, 0, 0];
      for (let f of this.cubics)
        (f.calculateBounds(c, e),
          (n = Math.min(n, c[0])),
          (s = Math.min(s, c[1])),
          (o = Math.max(o, c[2])),
          (i = Math.max(i, c[3])));
      return ((t[0] = n), (t[1] = s), (t[2] = o), (t[3] = i), t);
    }
    equals(t) {
      if (this === t) return !0;
      if (!(t instanceof r) || this.features.length !== t.features.length)
        return !1;
      for (let e = 0; e < this.features.length; e++)
        if (!this.features[e].equals(t.features[e])) return !1;
      return !0;
    }
    static create(t, e, n, s, o, i) {
      if (typeof t == "number") {
        let c = t,
          f = e ?? 1,
          d = n ?? 0,
          a = s ?? 0,
          g = o ?? w.Unrounded,
          x = i ?? void 0;
        return r.createFromNumVertices(c, f, d, a, g, x);
      } else if (
        Array.isArray(t) &&
        (t.length === 0 || typeof t[0] == "number")
      ) {
        let c = t,
          f = e ?? w.Unrounded,
          d = n ?? void 0,
          a = s ?? -1 / 0,
          g = o ?? -1 / 0;
        return r.createFromVertices(c, f, d, a, g);
      } else if (Array.isArray(t)) {
        let c = t,
          f = e ?? NaN,
          d = n ?? NaN;
        return r.createFromFeatures(c, f, d);
      } else {
        let c = t;
        return new r(c.features, c.center);
      }
    }
    static createFromNumVertices(t, e = 1, n = 0, s = 0, o = w.Unrounded, i) {
      if (t < 3) throw new Error("Polygons must have at least 3 vertices");
      let c = Ht(t, e, n, s);
      return r.createFromVertices(c, o, i, n, s);
    }
    static createFromVertices(t, e = w.Unrounded, n, s = -1 / 0, o = -1 / 0) {
      if (t.length < 6)
        throw new Error("Polygons must have at least 3 vertices");
      if (t.length % 2 === 1)
        throw new Error("The vertices array should have even size");
      let i = t.length / 2;
      if (n && n.length !== i)
        throw new Error(
          "perVertexRounding list should be either null or the same size as the number of vertices (vertices.size / 2)",
        );
      let c = [];
      for (let m = 0; m < i; m++) {
        let p = n?.[m] ?? e,
          P = ((m + i - 1) % i) * 2,
          v = ((m + 1) % i) * 2;
        c.push(
          new bt(
            new b(t[P], t[P + 1]),
            new b(t[m * 2], t[m * 2 + 1]),
            new b(t[v], t[v + 1]),
            p,
          ),
        );
      }
      let f = Array.from({ length: i }, (m, p) => {
          let P = c[p].expectedRoundCut + c[(p + 1) % i].expectedRoundCut,
            v = c[p].expectedCut + c[(p + 1) % i].expectedCut,
            C = t[p * 2],
            S = t[p * 2 + 1],
            $ = t[((p + 1) % i) * 2],
            E = t[((p + 1) % i) * 2 + 1],
            X = J(C - $, S - E);
          return P > X
            ? { roundCutRatio: X / P, cutRatio: 0 }
            : v > X
              ? { roundCutRatio: 1, cutRatio: (X - P) / (v - P) }
              : { roundCutRatio: 1, cutRatio: 1 };
        }),
        d = [];
      for (let m = 0; m < i; m++) {
        let p = [];
        for (let P = 0; P <= 1; P++) {
          let { roundCutRatio: v, cutRatio: C } = f[(m + i - 1 + P) % i];
          p.push(
            c[m].expectedRoundCut * v +
              (c[m].expectedCut - c[m].expectedRoundCut) * C,
          );
        }
        d.push(c[m].getCubics(p[0], p[1]));
      }
      let a = [];
      for (let m = 0; m < i; m++) {
        let p = (m + i - 1) % i,
          P = (m + 1) % i,
          v = new b(t[m * 2], t[m * 2 + 1]),
          C = new b(t[p * 2], t[p * 2 + 1]),
          S = new b(t[P * 2], t[P * 2 + 1]),
          $ = st(C, v, S);
        a.push(new F(d[m], $));
        let E = d[m][d[m].length - 1],
          X = d[(m + 1) % i][0];
        a.push(
          new H([
            R.straightLine(E.anchor1X, E.anchor1Y, X.anchor0X, X.anchor0Y),
          ]),
        );
      }
      let g, x;
      if (s === -1 / 0 || o === -1 / 0) {
        let m = At(t);
        ((g = m.x), (x = m.y));
      } else ((g = s), (x = o));
      return new r(a, new b(g, x));
    }
    static createFromFeatures(t, e = NaN, n = NaN) {
      if (t.length < 2)
        throw new Error("Polygons must have at least 2 features");
      let s = [];
      for (let f of t) for (let d of f.cubics) s.push(d.anchor0X, d.anchor0Y);
      let o = At(s),
        i = isNaN(e) ? o.x : e,
        c = isNaN(n) ? o.y : n;
      return new r(t, new b(i, c));
    }
  };
  function At(r) {
    let t = 0,
      e = 0;
    for (let n = 0; n < r.length; n += 2) ((t += r[n]), (e += r[n + 1]));
    return new b(t / (r.length / 2), e / (r.length / 2));
  }
  var bt = class {
    constructor(t, e, n, s = null) {
      h(this, "p0");
      h(this, "p1");
      h(this, "p2");
      h(this, "rounding");
      h(this, "d1");
      h(this, "d2");
      h(this, "cornerRadius");
      h(this, "smoothing");
      h(this, "cosAngle");
      h(this, "sinAngle");
      h(this, "expectedRoundCut");
      h(this, "center", new b(0, 0));
      ((this.p0 = t), (this.p1 = e), (this.p2 = n), (this.rounding = s));
      let o = t.minus(e),
        i = n.minus(e),
        c = o.getDistance(),
        f = i.getDistance();
      c > 0 && f > 0
        ? ((this.d1 = o.div(c)),
          (this.d2 = i.div(f)),
          (this.cornerRadius = s?.radius ?? 0),
          (this.smoothing = s?.smoothing ?? 0),
          (this.cosAngle = this.d1.dotProduct(this.d2)),
          (this.sinAngle = Math.sqrt(1 - nt(this.cosAngle))),
          (this.expectedRoundCut =
            this.sinAngle > 0.001
              ? (this.cornerRadius * (this.cosAngle + 1)) / this.sinAngle
              : 0))
        : ((this.d1 = new b(0, 0)),
          (this.d2 = new b(0, 0)),
          (this.cornerRadius = 0),
          (this.smoothing = 0),
          (this.cosAngle = 0),
          (this.sinAngle = 0),
          (this.expectedRoundCut = 0));
    }
    get expectedCut() {
      return (1 + this.smoothing) * this.expectedRoundCut;
    }
    getCubics(t, e = t) {
      let n = Math.min(t, e);
      if (this.expectedRoundCut < Y || n < Y || this.cornerRadius < Y)
        return (
          (this.center = this.p1),
          [R.straightLine(this.p1.x, this.p1.y, this.p1.x, this.p1.y)]
        );
      let s = Math.min(n, this.expectedRoundCut),
        o = this.calculateActualSmoothingValue(t),
        i = this.calculateActualSmoothingValue(e),
        c = (this.cornerRadius * s) / this.expectedRoundCut,
        f = Math.sqrt(nt(c) + nt(s));
      this.center = this.p1.plus(
        this.d1.plus(this.d2).div(2).getDirection().times(f),
      );
      let d = this.p1.plus(this.d1.times(s)),
        a = this.p1.plus(this.d2.times(s)),
        g = this.computeFlankingCurve(
          s,
          o,
          this.p1,
          this.p0,
          d,
          a,
          this.center,
          c,
        ),
        x = this.computeFlankingCurve(
          s,
          i,
          this.p1,
          this.p2,
          a,
          d,
          this.center,
          c,
        ).reverse();
      return [
        g,
        R.circularArc(
          this.center.x,
          this.center.y,
          g.anchor1X,
          g.anchor1Y,
          x.anchor0X,
          x.anchor0Y,
        ),
        x,
      ];
    }
    calculateActualSmoothingValue(t) {
      return t > this.expectedCut
        ? this.smoothing
        : t > this.expectedRoundCut
          ? (this.smoothing * (t - this.expectedRoundCut)) /
            (this.expectedCut - this.expectedRoundCut)
          : 0;
    }
    computeFlankingCurve(t, e, n, s, o, i, c, f) {
      let d = s.minus(n).getDirection(),
        a = n.plus(d.times(t * (1 + e))),
        g = b.interpolate(o, o.plus(i).div(2), e),
        x = c.plus(U(g.x - c.x, g.y - c.y).times(f)),
        m = x.minus(c).rotate90(),
        p = Ut(s, d, x, m) ?? o,
        P = a.plus(p.times(2)).div(3);
      return R.fromPoints(a, P, p, x);
    }
  };
  function Ut(r, t, e, n) {
    let s = n.rotate90(),
      o = t.dotProduct(s);
    if (Math.abs(o) < Y) return null;
    let i = e.minus(r).dotProduct(s);
    if (Math.abs(o) < Y * Math.abs(i)) return null;
    let c = i / o;
    return r.plus(t.times(c));
  }
  function Ht(r, t, e, n) {
    let s = [];
    for (let o = 0; o < r; o++) {
      let i = L(t, (A / r) * 2 * o).plus(new b(e, n));
      s.push(i.x, i.y);
    }
    return s;
  }
  var I = class {
    static circle(t = 8, e = 1, n = 0, s = 0) {
      if (t < 3) throw new Error("Circle must have at least three vertices");
      let o = A / t,
        i = e / Math.cos(o);
      return O.createFromNumVertices(t, i, n, s, new w(e));
    }
    static rectangle(t = 2, e = 2, n = w.Unrounded, s, o = 0, i = 0) {
      let c = o - t / 2,
        f = i - e / 2,
        d = o + t / 2,
        a = i + e / 2;
      return O.createFromVertices([d, a, c, a, c, f, d, f], n, s, o, i);
    }
    static star(t, e = 1, n = 0.5, s = w.Unrounded, o, i, c = 0, f = 0) {
      if (e <= 0 || n <= 0)
        throw new Error("Star radii must both be greater than 0");
      if (n >= e) throw new Error("innerRadius must be less than radius");
      let d = i;
      return (
        !d && o && (d = Array.from({ length: t }).flatMap(() => [s, o])),
        O.createFromVertices(Zt(t, e, n, c, f), s, d, c, f)
      );
    }
    static pill(t = 2, e = 1, n = 0, s = 0, o = 0) {
      if (t <= 0 || e <= 0)
        throw new Error("Pill shapes must have positive width and height");
      let i = t / 2,
        c = e / 2;
      return O.createFromVertices(
        [i + s, c + o, -i + s, c + o, -i + s, -c + o, i + s, -c + o],
        new w(Math.min(i, c), n),
        void 0,
        s,
        o,
      );
    }
    static pillStar(
      t = 2,
      e = 1,
      n = 8,
      s = 0.5,
      o = w.Unrounded,
      i,
      c,
      f = 0.5,
      d = 0,
      a = 0,
      g = 0,
    ) {
      if (t <= 0 || e <= 0)
        throw new Error("Pill shapes must have positive width and height");
      if (s <= 0 || s > 1)
        throw new Error("innerRadius must be between 0 and 1");
      let x = c;
      return (
        !x && i && (x = Array.from({ length: n }).flatMap(() => [o, i])),
        O.createFromVertices(Wt(n, t, e, s, f, d, a, g), o, x, a, g)
      );
    }
  };
  function Zt(r, t, e, n, s) {
    let o = [];
    for (let i = 0; i < r; i++) {
      let c = L(t, (A / r) * 2 * i);
      (o.push(c.x + n, c.y + s),
        (c = L(e, (A / r) * (2 * i + 1))),
        o.push(c.x + n, c.y + s));
    }
    return o;
  }
  function Wt(r, t, e, n, s, o, i, c) {
    let f = Math.min(t, e),
      d = Math.max(0, e - t),
      a = Math.max(0, t - e),
      g = d / 2,
      x = a / 2,
      m = St * f * _(n, 1, s),
      p = 2 * a + 2 * d + m,
      P = [
        0,
        d / 2,
        d / 2 + m / 4,
        d / 2 + m / 4 + a,
        d / 2 + m / 4 + a + m / 4,
        d / 2 + m / 4 + a + m / 4 + d,
        d / 2 + m / 4 + a + m / 4 + d + m / 4,
        d / 2 + m / 4 + a + m / 4 + d + m / 4 + a,
        d / 2 + m / 4 + a + m / 4 + d + m / 4 + a + m / 4,
        d / 2 + m / 4 + a + m / 4 + d + m / 4 + a + m / 4 + d / 2,
        p,
      ],
      v = p / (2 * r),
      C = !1,
      S = 0,
      $ = o * p,
      E = [],
      X = new b(x, g),
      Q = new b(-x, g),
      _t = new b(-x, -g),
      Tt = new b(x, -g);
    for (let Mt = 0; Mt < r * 2; Mt++) {
      let wt = $ % p;
      for (wt < P[S] && (S = 0); wt >= P[S + 1];) S++;
      let Yt = P[S],
        Dt = P[S + 1],
        B = (wt - Yt) / (Dt - Yt),
        N = C ? f * n : f,
        z;
      switch (S) {
        case 0:
          z = new b(N, B * g);
          break;
        case 1:
          z = L(N, (B * A) / 2).plus(X);
          break;
        case 2:
          z = new b(x - B * a, N);
          break;
        case 3:
          z = L(N, A / 2 + (B * A) / 2).plus(Q);
          break;
        case 4:
          z = new b(-N, g - B * d);
          break;
        case 5:
          z = L(N, A + (B * A) / 2).plus(_t);
          break;
        case 6:
          z = new b(-x + B * a, -N);
          break;
        case 7:
          z = L(N, A * 1.5 + (B * A) / 2).plus(Tt);
          break;
        default:
          z = new b(N, -g + B * g);
          break;
      }
      (E.push(z.x + i, z.y + c), ($ += v), (C = !C));
    }
    return E;
  }
  function T(r) {
    if (!Number.isFinite(r)) return "0";
    let t = Math.round(r * 1e5) / 1e5;
    return (Object.is(t, -0) && (t = 0), String(t));
  }
  var lt = class {
    constructor() {
      h(this, "pathData", "");
    }
    moveTo(t, e) {
      this.pathData += `M${T(t)} ${T(e)}`;
    }
    lineTo(t, e) {
      this.pathData += `L${T(t)} ${T(e)}`;
    }
    cubicTo(t, e, n, s, o, i) {
      this.pathData += `C${T(t)} ${T(e)} ${T(n)} ${T(s)} ${T(o)} ${T(i)}`;
    }
    close() {
      this.pathData += "Z";
    }
    rewind() {
      this.pathData = "";
    }
    toSvgPathData() {
      return this.pathData;
    }
    toString() {
      return this.pathData;
    }
  };
  var V = class {
    constructor() {
      h(this, "matrix");
      this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    rotateZ(t) {
      let e = (t * Math.PI) / 180,
        n = Math.cos(e),
        s = Math.sin(e),
        o = [n, -s, 0, s, n, 0, 0, 0, 1];
      return (this.multiply(o), this);
    }
    scale(t, e) {
      let n = [t, 0, 0, 0, e, 0, 0, 0, 1];
      return (this.multiply(n), this);
    }
    transform(t, e) {
      let n = this.matrix[0] * t + this.matrix[1] * e + this.matrix[2],
        s = this.matrix[3] * t + this.matrix[4] * e + this.matrix[5];
      return { first: n, second: s };
    }
    multiply(t) {
      let e = [0, 0, 0, 0, 0, 0, 0, 0, 1];
      for (let n = 0; n < 3; n++)
        for (let s = 0; s < 3; s++) {
          let o = 0;
          for (let i = 0; i < 3; i++)
            o += this.matrix[n * 3 + i] * t[i * 3 + s];
          e[n * 3 + s] = o;
        }
      this.matrix = e;
    }
  };
  var u = class {
    constructor(t, e) {
      h(this, "x");
      h(this, "y");
      ((this.x = t), (this.y = e));
    }
  };
  function Qt(r, t) {
    t.moveTo(r[0].anchor0X, r[0].anchor0Y);
    for (let e of r)
      t.cubicTo(
        e.control0X,
        e.control0Y,
        e.control1X,
        e.control1Y,
        e.anchor1X,
        e.anchor1Y,
      );
    return (t.close(), t);
  }
  function Ft(r, t, e = new lt()) {
    return Qt(r.asCubics(t), e);
  }
  var l = class {
      constructor(t, e = w.Unrounded) {
        h(this, "o");
        h(this, "r");
        ((this.o = t), (this.r = e));
      }
    },
    y = class y {
      static get Circle() {
        return (
          this._circle || (this._circle = I.circle().normalized()),
          this._circle
        );
      }
      static get Square() {
        return (
          this._square || (this._square = this.square().normalized()),
          this._square
        );
      }
      static get Slanted() {
        return (
          this._slanted || (this._slanted = this.slanted().normalized()),
          this._slanted
        );
      }
      static get Arch() {
        return (
          this._arch || (this._arch = this.arch().normalized()),
          this._arch
        );
      }
      static get Fan() {
        return (this._fan || (this._fan = this.fan().normalized()), this._fan);
      }
      static get Arrow() {
        return (
          this._arrow || (this._arrow = this.arrow().normalized()),
          this._arrow
        );
      }
      static get SemiCircle() {
        return (
          this._semiCircle ||
            (this._semiCircle = this.semiCircle().normalized()),
          this._semiCircle
        );
      }
      static get Oval() {
        return (
          this._oval || (this._oval = this.oval().normalized()),
          this._oval
        );
      }
      static get Pill() {
        return (
          this._pill || (this._pill = this.pill().normalized()),
          this._pill
        );
      }
      static get Triangle() {
        return (
          this._triangle || (this._triangle = this.triangle().normalized()),
          this._triangle
        );
      }
      static get Diamond() {
        return (
          this._diamond || (this._diamond = this.diamond().normalized()),
          this._diamond
        );
      }
      static get ClamShell() {
        return (
          this._clamShell || (this._clamShell = this.clamShell().normalized()),
          this._clamShell
        );
      }
      static get Pentagon() {
        return (
          this._pentagon || (this._pentagon = this.pentagon().normalized()),
          this._pentagon
        );
      }
      static get Gem() {
        return (this._gem || (this._gem = this.gem().normalized()), this._gem);
      }
      static get Sunny() {
        return (
          this._sunny || (this._sunny = this.sunny().normalized()),
          this._sunny
        );
      }
      static get VerySunny() {
        return (
          this._verySunny || (this._verySunny = this.verySunny().normalized()),
          this._verySunny
        );
      }
      static get Cookie4Sided() {
        return (
          this._cookie4Sided ||
            (this._cookie4Sided = this.cookie4().normalized()),
          this._cookie4Sided
        );
      }
      static get Cookie6Sided() {
        return (
          this._cookie6Sided ||
            (this._cookie6Sided = this.cookie6().normalized()),
          this._cookie6Sided
        );
      }
      static get Cookie7Sided() {
        return (
          this._cookie7Sided ||
            (this._cookie7Sided = this.cookie7().normalized()),
          this._cookie7Sided
        );
      }
      static get Cookie9Sided() {
        return (
          this._cookie9Sided ||
            (this._cookie9Sided = this.cookie9().normalized()),
          this._cookie9Sided
        );
      }
      static get Cookie12Sided() {
        return (
          this._cookie12Sided ||
            (this._cookie12Sided = this.cookie12().normalized()),
          this._cookie12Sided
        );
      }
      static get Ghostish() {
        return (
          this._ghostish || (this._ghostish = this.ghostish().normalized()),
          this._ghostish
        );
      }
      static get Clover4Leaf() {
        return (
          this._clover4Leaf ||
            (this._clover4Leaf = this.clover4().normalized()),
          this._clover4Leaf
        );
      }
      static get Clover8Leaf() {
        return (
          this._clover8Leaf ||
            (this._clover8Leaf = this.clover8().normalized()),
          this._clover8Leaf
        );
      }
      static get Burst() {
        return (
          this._burst || (this._burst = this.burst().normalized()),
          this._burst
        );
      }
      static get SoftBurst() {
        return (
          this._softBurst || (this._softBurst = this.softBurst().normalized()),
          this._softBurst
        );
      }
      static get Boom() {
        return (
          this._boom || (this._boom = this.boom().normalized()),
          this._boom
        );
      }
      static get SoftBoom() {
        return (
          this._softBoom || (this._softBoom = this.softBoom().normalized()),
          this._softBoom
        );
      }
      static get Flower() {
        return (
          this._flower || (this._flower = this.flower().normalized()),
          this._flower
        );
      }
      static get Puffy() {
        return (
          this._puffy || (this._puffy = this.puffy().normalized()),
          this._puffy
        );
      }
      static get PuffyDiamond() {
        return (
          this._puffyDiamond ||
            (this._puffyDiamond = this.puffyDiamond().normalized()),
          this._puffyDiamond
        );
      }
      static get PixelCircle() {
        return (
          this._pixelCircle ||
            (this._pixelCircle = this.pixelCircle().normalized()),
          this._pixelCircle
        );
      }
      static get PixelTriangle() {
        return (
          this._pixelTriangle ||
            (this._pixelTriangle = this.pixelTriangle().normalized()),
          this._pixelTriangle
        );
      }
      static get Bun() {
        return (this._bun || (this._bun = this.bun().normalized()), this._bun);
      }
      static get Heart() {
        return (
          this._heart || (this._heart = this.heart().normalized()),
          this._heart
        );
      }
      static byName(t) {
        return this[t];
      }
      static all() {
        return y.names.map((t) => ({ name: t, polygon: y.byName(t) }));
      }
      static square() {
        return I.rectangle(1, 1, this.cornerRound30);
      }
      static slanted() {
        return this.customPolygon(
          [
            new l(new u(0.926, 0.97), new w(0.189, 0.811)),
            new l(new u(-0.021, 0.967), new w(0.187, 0.057)),
          ],
          2,
        );
      }
      static arch() {
        return O.createFromNumVertices(4, 1, 0, 0, w.Unrounded, [
          this.cornerRound100,
          this.cornerRound100,
          this.cornerRound20,
          this.cornerRound20,
        ]).transformed(this.rotateNeg135);
      }
      static fan() {
        return this.customPolygon(
          [
            new l(new u(1.004, 1), new w(0.148, 0.417)),
            new l(new u(0, 1), new w(0.151)),
            new l(new u(0, -0.003), new w(0.148)),
            new l(new u(0.978, 0.02), new w(0.803)),
          ],
          1,
        );
      }
      static arrow() {
        return this.customPolygon(
          [
            new l(new u(0.5, 0.892), new w(0.313)),
            new l(new u(-0.216, 1.05), new w(0.207)),
            new l(new u(0.499, -0.16), new w(0.215, 1)),
            new l(new u(1.225, 1.06), new w(0.211)),
          ],
          1,
        );
      }
      static semiCircle() {
        return I.rectangle(1.6, 1, void 0, [
          this.cornerRound20,
          this.cornerRound20,
          this.cornerRound100,
          this.cornerRound100,
        ]);
      }
      static oval() {
        let t = new V().scale(1, 0.64);
        return I.circle().transformed(t).transformed(this.rotateNeg45);
      }
      static pill() {
        return this.customPolygon(
          [
            new l(new u(0.961, 0.039), new w(0.426)),
            new l(new u(1.001, 0.428)),
            new l(new u(1, 0.609), new w(1)),
          ],
          2,
          !0,
        );
      }
      static triangle() {
        return O.createFromNumVertices(
          3,
          1,
          0,
          0,
          this.cornerRound20,
        ).transformed(this.rotateNeg90);
      }
      static diamond() {
        return this.customPolygon(
          [
            new l(new u(0.5, 1.096), new w(0.151, 0.524)),
            new l(new u(0.04, 0.5), new w(0.159)),
          ],
          2,
        );
      }
      static clamShell() {
        return this.customPolygon(
          [
            new l(new u(0.171, 0.841), new w(0.159)),
            new l(new u(-0.02, 0.5), new w(0.14)),
            new l(new u(0.17, 0.159), new w(0.159)),
          ],
          2,
        );
      }
      static pentagon() {
        return this.customPolygon(
          [
            new l(new u(0.5, -0.009), new w(0.172)),
            new l(new u(1.03, 0.365), new w(0.164)),
            new l(new u(0.828, 0.97), new w(0.169)),
          ],
          1,
          !0,
        );
      }
      static gem() {
        return this.customPolygon(
          [
            new l(new u(0.499, 1.023), new w(0.241, 0.778)),
            new l(new u(-0.005, 0.792), new w(0.208)),
            new l(new u(0.073, 0.258), new w(0.228)),
            new l(new u(0.433, -0), new w(0.491)),
          ],
          1,
          !0,
        );
      }
      static sunny() {
        return I.star(8, void 0, 0.8, this.cornerRound15);
      }
      static verySunny() {
        return this.customPolygon(
          [
            new l(new u(0.5, 1.08), new w(0.085)),
            new l(new u(0.358, 0.843), new w(0.085)),
          ],
          8,
        );
      }
      static cookie4() {
        return this.customPolygon(
          [
            new l(new u(1.237, 1.236), new w(0.258)),
            new l(new u(0.5, 0.918), new w(0.233)),
          ],
          4,
        );
      }
      static cookie6() {
        return this.customPolygon(
          [
            new l(new u(0.723, 0.884), new w(0.394)),
            new l(new u(0.5, 1.099), new w(0.398)),
          ],
          6,
        );
      }
      static cookie7() {
        return I.star(7, void 0, 0.75, this.cornerRound50).transformed(
          this.rotateNeg90,
        );
      }
      static cookie9() {
        return I.star(9, void 0, 0.8, this.cornerRound50).transformed(
          this.rotateNeg90,
        );
      }
      static cookie12() {
        return I.star(12, void 0, 0.8, this.cornerRound50).transformed(
          this.rotateNeg90,
        );
      }
      static ghostish() {
        return this.customPolygon(
          [
            new l(new u(0.5, 0), new w(1)),
            new l(new u(1, 0), new w(1)),
            new l(new u(1, 1.14), new w(0.254, 0.106)),
            new l(new u(0.575, 0.906), new w(0.253)),
          ],
          1,
          !0,
        );
      }
      static clover4() {
        return this.customPolygon(
          [new l(new u(0.5, 0.074)), new l(new u(0.725, -0.099), new w(0.476))],
          4,
          !0,
        );
      }
      static clover8() {
        return this.customPolygon(
          [new l(new u(0.5, 0.036)), new l(new u(0.758, -0.101), new w(0.209))],
          8,
        );
      }
      static burst() {
        return this.customPolygon(
          [
            new l(new u(0.5, -0.006), new w(0.006)),
            new l(new u(0.592, 0.158), new w(0.006)),
          ],
          12,
        );
      }
      static softBurst() {
        return this.customPolygon(
          [
            new l(new u(0.193, 0.277), new w(0.053)),
            new l(new u(0.176, 0.055), new w(0.053)),
          ],
          10,
        );
      }
      static boom() {
        return this.customPolygon(
          [
            new l(new u(0.457, 0.296), new w(0.007)),
            new l(new u(0.5, -0.051), new w(0.007)),
          ],
          15,
        );
      }
      static softBoom() {
        return this.customPolygon(
          [
            new l(new u(0.733, 0.454)),
            new l(new u(0.839, 0.437), new w(0.532)),
            new l(new u(0.949, 0.449), new w(0.439, 1)),
            new l(new u(0.998, 0.478), new w(0.174)),
          ],
          16,
          !0,
        );
      }
      static flower() {
        return this.customPolygon(
          [
            new l(new u(0.37, 0.187)),
            new l(new u(0.416, 0.049), new w(0.381)),
            new l(new u(0.479, 0.001), new w(0.095)),
          ],
          8,
          !0,
        );
      }
      static puffy() {
        let t = new V().scale(1, 0.742);
        return this.customPolygon(
          [
            new l(new u(0.5, 0.053)),
            new l(new u(0.545, -0.04), new w(0.405)),
            new l(new u(0.67, -0.035), new w(0.426)),
            new l(new u(0.717, 0.066), new w(0.574)),
            new l(new u(0.722, 0.128)),
            new l(new u(0.777, 0.002), new w(0.36)),
            new l(new u(0.914, 0.149), new w(0.66)),
            new l(new u(0.926, 0.289), new w(0.66)),
            new l(new u(0.881, 0.346)),
            new l(new u(0.94, 0.344), new w(0.126)),
            new l(new u(1.003, 0.437), new w(0.255)),
          ],
          2,
          !0,
        ).transformed(t);
      }
      static puffyDiamond() {
        return this.customPolygon(
          [
            new l(new u(0.87, 0.13), new w(0.146)),
            new l(new u(0.818, 0.357)),
            new l(new u(1, 0.332), new w(0.853)),
          ],
          4,
          !0,
        );
      }
      static pixelCircle() {
        return this.customPolygon(
          [
            new l(new u(0.5, 0)),
            new l(new u(0.704, 0)),
            new l(new u(0.704, 0.065)),
            new l(new u(0.843, 0.065)),
            new l(new u(0.843, 0.148)),
            new l(new u(0.926, 0.148)),
            new l(new u(0.926, 0.296)),
            new l(new u(1, 0.296)),
          ],
          2,
          !0,
        );
      }
      static pixelTriangle() {
        return this.customPolygon(
          [
            new l(new u(0.11, 0.5)),
            new l(new u(0.113, 0)),
            new l(new u(0.287, 0)),
            new l(new u(0.287, 0.087)),
            new l(new u(0.421, 0.087)),
            new l(new u(0.421, 0.17)),
            new l(new u(0.56, 0.17)),
            new l(new u(0.56, 0.265)),
            new l(new u(0.674, 0.265)),
            new l(new u(0.675, 0.344)),
            new l(new u(0.789, 0.344)),
            new l(new u(0.789, 0.439)),
            new l(new u(0.888, 0.439)),
          ],
          1,
          !0,
        );
      }
      static bun() {
        return this.customPolygon(
          [
            new l(new u(0.796, 0.5)),
            new l(new u(0.853, 0.518), new w(1)),
            new l(new u(0.992, 0.631), new w(1)),
            new l(new u(0.968, 1), new w(1)),
          ],
          2,
          !0,
        );
      }
      static heart() {
        return this.customPolygon(
          [
            new l(new u(0.5, 0.268), new w(0.016)),
            new l(new u(0.792, -0.066), new w(0.958)),
            new l(new u(1.064, 0.276), new w(1)),
            new l(new u(0.501, 0.946), new w(0.129)),
          ],
          1,
          !0,
        );
      }
      static customPolygon(t, e, n = !1, s = new u(0.5, 0.5)) {
        let o = this.doRepeat(t, e, s, n),
          i = o.flatMap((f) => [f.o.x, f.o.y]),
          c = o.map((f) => f.r);
        return O.createFromVertices(i, void 0, c, s.x, s.y);
      }
      static doRepeat(t, e, n, s) {
        if (s) {
          let o = t.map((a) => Math.atan2(a.o.y - n.y, a.o.x - n.x)),
            i = t.map((a) =>
              Math.sqrt(Math.pow(a.o.x - n.x, 2) + Math.pow(a.o.y - n.y, 2)),
            ),
            c = e * 2,
            f = (2 * Math.PI) / c,
            d = [];
          for (let a = 0; a < c; a++)
            t.forEach((g, x) => {
              let m = a % 2 === 0 ? x : t.length - 1 - x;
              if (m > 0 || a % 2 === 0) {
                let p = f * a + (a % 2 === 0 ? o[m] : f - o[m] + 2 * o[0]),
                  P = new u(Math.cos(p) * i[m] + n.x, Math.sin(p) * i[m] + n.y);
                d.push(new l(P, t[m].r));
              }
            });
          return d;
        } else
          return Array.from({ length: t.length * e }, (o, i) => {
            let c = Math.floor(i / t.length),
              f = this.rotatePoint(t[i % t.length].o, (c * 360) / e, n);
            return new l(f, t[i % t.length].r);
          });
      }
      static rotatePoint(t, e, n) {
        let s = (e * Math.PI) / 180,
          o = t.x - n.x,
          i = t.y - n.y;
        return new u(
          o * Math.cos(s) - i * Math.sin(s) + n.x,
          o * Math.sin(s) + i * Math.cos(s) + n.y,
        );
      }
    };
  (h(y, "cornerRound15", new w(0.15)),
    h(y, "cornerRound20", new w(0.2)),
    h(y, "cornerRound30", new w(0.3)),
    h(y, "cornerRound50", new w(0.5)),
    h(y, "cornerRound100", new w(1)),
    h(y, "rotateNeg45", new V().rotateZ(-45)),
    h(y, "rotateNeg90", new V().rotateZ(-90)),
    h(y, "rotateNeg135", new V().rotateZ(-135)),
    h(y, "_circle"),
    h(y, "_square"),
    h(y, "_slanted"),
    h(y, "_arch"),
    h(y, "_fan"),
    h(y, "_arrow"),
    h(y, "_semiCircle"),
    h(y, "_oval"),
    h(y, "_pill"),
    h(y, "_triangle"),
    h(y, "_diamond"),
    h(y, "_clamShell"),
    h(y, "_pentagon"),
    h(y, "_gem"),
    h(y, "_verySunny"),
    h(y, "_sunny"),
    h(y, "_cookie4Sided"),
    h(y, "_cookie6Sided"),
    h(y, "_cookie7Sided"),
    h(y, "_cookie9Sided"),
    h(y, "_cookie12Sided"),
    h(y, "_ghostish"),
    h(y, "_clover4Leaf"),
    h(y, "_clover8Leaf"),
    h(y, "_burst"),
    h(y, "_softBurst"),
    h(y, "_boom"),
    h(y, "_softBoom"),
    h(y, "_flower"),
    h(y, "_puffy"),
    h(y, "_puffyDiamond"),
    h(y, "_pixelCircle"),
    h(y, "_pixelTriangle"),
    h(y, "_bun"),
    h(y, "_heart"),
    h(y, "names", [
      "Circle",
      "Square",
      "Slanted",
      "Arch",
      "SemiCircle",
      "Oval",
      "Pill",
      "Triangle",
      "Arrow",
      "Fan",
      "Diamond",
      "ClamShell",
      "Pentagon",
      "Gem",
      "VerySunny",
      "Sunny",
      "Cookie4Sided",
      "Cookie6Sided",
      "Cookie7Sided",
      "Cookie9Sided",
      "Cookie12Sided",
      "Clover4Leaf",
      "Clover8Leaf",
      "Burst",
      "SoftBurst",
      "Boom",
      "SoftBoom",
      "Flower",
      "Puffy",
      "PuffyDiamond",
      "Ghostish",
      "PixelCircle",
      "PixelTriangle",
      "Bun",
      "Heart",
    ]));
  var D = y;
  var j = 48,
    Jt = 38,
    Kt = Jt / j,
    dt = 1,
    kt = 650 / dt,
    Ot = 4666 / dt,
    Ct = 90,
    zt = 360,
    ft = [
      D.SoftBurst,
      D.Cookie9Sided,
      D.Pentagon,
      D.Pill,
      D.Sunny,
      D.Cookie4Sided,
      D.Oval,
    ].map((r) => r.normalized()),
    It = ft.map((r, t) => new ht(r, ft[(t + 1) % ft.length]));
  function te(r) {
    let t = 1;
    for (let e of r) {
      let n = e.calculateBounds(),
        s = e.calculateMaxBounds(),
        o = (n[2] - n[0]) / (s[2] - s[0]),
        i = (n[3] - n[1]) / (s[3] - s[1]);
      t = Math.min(t, Math.max(o, i));
    }
    return t;
  }
  var ee = te(ft) * Kt,
    mt = 0.6,
    vt = Math.sqrt(200 * dt * dt),
    Pt = vt * Math.sqrt(1 - mt * mt);
  function ne(r) {
    return (
      1 -
      Math.exp(-mt * vt * r) *
        (Math.cos(Pt * r) + ((mt * vt) / Pt) * Math.sin(Pt * r))
    );
  }
  function se(r) {
    let t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    (t.setAttribute("viewBox", `0 0 ${j} ${j}`),
      t.setAttribute("aria-hidden", "true"));
    let e = document.createElementNS("http://www.w3.org/2000/svg", "path");
    (e.setAttribute("fill", "currentColor"),
      (e.style.visibility = "hidden"),
      t.appendChild(e),
      r.appendChild(t));
    let n = matchMedia("(prefers-reduced-motion: reduce)").matches,
      s = null,
      o = 0,
      i = Ct,
      c = 0;
    function f(d) {
      s === null && (s = d);
      let a = d - s,
        g = Math.floor(a / kt);
      g !== f._cycle &&
        (f._cycle !== void 0 &&
          ((o = (o + 1) % It.length), (i = (i + Ct) % zt)),
        (f._cycle = g));
      let x = ne((a % kt) / 1e3),
        m = Math.min(1, Math.max(0, x)),
        p = n ? 0 : ((a % Ot) / Ot) * zt,
        P = n ? 0 : x * Ct + i + p;
      e.setAttribute("d", Ft(It[o], m).toString());
      let v = j * ee,
        C = e.getBBox();
      if (C.width > 0 && C.height > 0) {
        let S = j / 2 - (C.x + C.width / 2) * v,
          $ = j / 2 - (C.y + C.height / 2) * v;
        (e.setAttribute(
          "transform",
          `rotate(${P.toFixed(2)} ${j / 2} ${j / 2}) translate(${S.toFixed(3)} ${$.toFixed(3)}) scale(${v.toFixed(4)})`,
        ),
          (e.style.visibility = "visible"));
      } else e.removeAttribute("d");
      c = requestAnimationFrame(f);
    }
    return ((c = requestAnimationFrame(f)), () => cancelAnimationFrame(c));
  }
  window.mountLoadingIndicator = se;
  window.M3Shapes = { shapes: D, Morph: ht, toPath: Ft };
})();
