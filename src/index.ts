import { Either, Left, Right } from 'fp-ts/lib/Either';
import { Tuple } from 'fp-ts/lib/Tuple';
import { Option, Some, none } from 'fp-ts/lib/Option';

export type Void = never;
export type Unit = void;
export const unit: Unit = undefined;
export type Absurd = () => never;
export class AbsurdError extends Error {
  public constructor() {
    super('Absurd function')
  }
};
export const absurd: Absurd = () => { throw new AbsurdError() };

export const prodIdent: {
  to: <A>(t: Tuple<Unit, A>) => A;
  from: <A>(a: A) => Tuple<Unit, A>;
} = {
  to: t => t.snd,
  from: a => new Tuple(unit, a)
};

export const prodAssoc: {
  to: <A, B, C>(t: Tuple<A, Tuple<B, C>>) => Tuple<Tuple<A, B>, C>;
  from: <A, B, C>(t: Tuple<Tuple<A, B>, C>) => Tuple<A, Tuple<B, C>>;
} = {
  to: t => new Tuple(new Tuple(t.fst, t.snd.fst), t.snd.snd),
  from: t => new Tuple(t.fst.fst, new Tuple(t.fst.snd, t.snd))
};

export const prodComm: {
  to: <A, B>(t: Tuple<A, B>) => Tuple<B, A>;
  from: <A, B>(t: Tuple<B, A>) => Tuple<A, B>;
} = {
  to: t => new Tuple(t.snd, t.fst),
  from: t => new Tuple(t.snd, t.fst)
};

export const prodZeroZero: {
  to: <A>(t: Tuple<Void, A>) => Void;
  from: <A>() => Tuple<Void, A>;
} = {
  to: t => t.fst,
  from: absurd
};


export const coprodIdent: {
  to: <A>(e: Either<Void, A>) => A;
  from: <A>(a: A) => Either<Void, A>;
} = {
  to: absurd,
  from: absurd
};

export const coprodAssoc: {
  to: <A, B, C>(e: Either<A, Either<B, C>>) => Either<Either<A, B>, C>;
  from: <A, B, C>(e: Either<Either<A, B>, C>) => Either<A, Either<B, C>>;
} = {
  to: <A, B, C>(e: Either<A, Either<B, C>>) => e.fold<Either<Either<A, B>, C>>(
    a => new Left(new Left(a)),
    ee => ee.fold<Either<Either<A, B>, C>>(b => new Left(new Right(b)), c => new Right(c))
  ),
  from: <A, B, C>(e: Either<Either<A, B>, C>) => e.fold<Either<A, Either<B, C>>>(
    ee => ee.fold<Either<A, Either<B, C>>>(a => new Left(a), b => new Right(new Left(b))),
    c => new Right(new Right(c)),
  )
};

export const coprodComm: {
  to: <A, B>(e: Either<A, B>) => Either<B, A>;
  from: <A, B>(e: Either<B, A>) => Either<A, B>;
} = {
  to: <A, B>(e: Either<A, B>) => e.fold<Either<B, A>>(a => new Right(a), b => new Left(b)),
  from: <A, B>(e: Either<B, A>) => e.fold<Either<A, B>>(a => new Right(a), b => new Left(b))
};

export const distribute: {
  to: <A, B, C>(t: Tuple<A, Either<B, C>>) => Either<Tuple<A, B>, Tuple<A, C>>;
  from: <A, B, C>(e: Either<Tuple<A, B>, Tuple<A, C>>) => Tuple<A, Either<B, C>>;
} = {
  to: <A, B, C>(t: Tuple<A, Either<B, C>>) =>
    t.snd.fold<Either<Tuple<A, B>, Tuple<A, C>>>(
      b => new Left(new Tuple(t.fst, b)),
      c => new Right(new Tuple(t.fst, c))
    ),
  from: <A, B, C>(e: Either<Tuple<A, B>, Tuple<A, C>>) =>
    e.fold<Tuple<A, Either<B, C>>>(l => new Tuple(l.fst, new Left(l.snd)), r => new Tuple(r.fst, new Right(r.snd)))
};

export const onePlusOption: {
  to: <A>(e: Either<Unit, A>) => Option<A>;
  from: <A>(o: Option<A>) => Either<Unit, A>;
} = {
  to: <A>(e: Either<Unit, A>) =>
    e.fold<Option<A>>(() => none, (r) => new Some(r)),
  from: <A>(o: Option<A>) =>
    o.fold<Either<Unit, A>>(new Left(unit), a => new Right(a))
};

export const onePlusOneIsTwo: {
  to: (e: Either<Unit, Unit>) => boolean;
  from: (b: boolean) => Either<Unit, Unit>;
} = {
  to: e => e.fold(() => false, () => true),
  from: b => b ? new Right(unit) : new Left(unit)
};

export const expProdSum: {
  to: <A, B, C>(t: Tuple<(b: B) => A, (c: C) => A>) => (e: Either<B, C>) => A;
  from: <A, B, C>(f: (e: Either<B, C>) => A) => Tuple<(b: B) => A, (c: C) => A>;
} = {
  to: t => e => e.fold(t.fst, t.snd),
  from: f => new Tuple(a => f(new Left(a)), b => f(new Right(b)))
};

export const expExpProd: {
  to: <A, B, C>(f: (t: Tuple<A, B>) => C) => (a: A) => (b: B) => C
  from: <A, B, C>(f: ((a: A) => (b: B) => C)) => (t: Tuple<A, B>) => C
} = {
  to: f => a => b => f(new Tuple(a, b)),
  from: f => t => f(t.fst)(t.snd)
};

export const expOne: {
  to: <A>(f: () => A) => A;
  from: <A>(a: A) => () => A
} = {
  to: f => f(),
  from: a => () => a
};

export const expZero: {
  to: <A>(f: (v: Void) => A) => Unit;
  from: <A>(u: Unit) => (v: Void) => A;
} = {
  to: _ => unit,
  from: _ => absurd
};
