import { Either, left, right, fold as efold } from 'fp-ts/lib/Either';
import { Option, some, none, fold as ofold } from 'fp-ts/lib/Option';
import { fst, snd } from 'fp-ts/lib/tuple';

export type Tuple<A, B> = [A, B];
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
  to: snd,
  from: a => [unit, a]
};

export const prodAssoc: {
  to: <A, B, C>(t: Tuple<A, Tuple<B, C>>) => Tuple<Tuple<A, B>, C>;
  from: <A, B, C>(t: Tuple<Tuple<A, B>, C>) => Tuple<A, Tuple<B, C>>;
} = {
  to: t => [[fst(t), fst(snd(t))], snd(snd(t))],
  from: t => [fst(fst(t)), [snd(fst(t)), snd(t)]]
};

export const prodComm: {
  to: <A, B>(t: Tuple<A, B>) => Tuple<B, A>;
  from: <A, B>(t: Tuple<B, A>) => Tuple<A, B>;
} = {
  to: t => [snd(t), fst(t)],
  from: t => [snd(t), fst(t)]
};

export const prodZeroZero: {
  to: <A>(t: Tuple<Void, A>) => Void;
  from: <A>() => Tuple<Void, A>;
} = {
  to: t => fst(t),
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
  to: <A, B, C>(e: Either<A, Either<B, C>>) => efold<A, Either<B, C>, Either<Either<A, B>, C>>(
    a => left(left(a)),
    ee => efold<B, C, Either<Either<A, B>, C>>(b => left(right(b)), c => right(c))(ee)
  )(e),
  from: <A, B, C>(e: Either<Either<A, B>, C>) => efold<Either<A, B>, C, Either<A, Either<B, C>>>(
    ee => efold<A, B, Either<A, Either<B, C>>>(a => left(a), b => right(left(b)))(ee),
    c => right(right(c)),
  )(e)
};

export const coprodComm: {
  to: <A, B>(e: Either<A, B>) => Either<B, A>;
  from: <A, B>(e: Either<B, A>) => Either<A, B>;
} = {
  to: <A, B>(e: Either<A, B>) => efold<A, B, Either<B, A>>(a => right(a), b => left(b))(e),
  from: <A, B>(e: Either<B, A>) => efold<B, A, Either<A, B>>(a => right(a), b => left(b))(e)
};

export const distribute: {
  to: <A, B, C>(t: Tuple<A, Either<B, C>>) => Either<Tuple<A, B>, Tuple<A, C>>;
  from: <A, B, C>(e: Either<Tuple<A, B>, Tuple<A, C>>) => Tuple<A, Either<B, C>>;
} = {
  to: <A, B, C>(t: Tuple<A, Either<B, C>>) =>
    efold<B, C, Either<Tuple<A, B>, Tuple<A, C>>>(
      b => left([fst(t), b]),
      c => right([fst(t), c])
    )(snd(t)),
  from: <A, B, C>(e: Either<Tuple<A, B>, Tuple<A, C>>) =>
    efold<Tuple<A, B>, Tuple<A, C>, Tuple<A, Either<B, C>>>(
        l => [fst(l), left(snd(l))],
        r => [fst(r), right(snd(r))]
    )(e)
};

export const onePlusOption: {
  to: <A>(e: Either<Unit, A>) => Option<A>;
  from: <A>(o: Option<A>) => Either<Unit, A>;
} = {
  to: <A>(e: Either<Unit, A>) => efold<Unit, A, Option<A>>(() => none, (r) => some(r))(e),
  from: <A>(o: Option<A>) =>
    ofold<A, Either<Unit, A>>(() => left(unit), a => right(a))(o)
};

export const onePlusOneIsTwo: {
  to: (e: Either<Unit, Unit>) => boolean;
  from: (b: boolean) => Either<Unit, Unit>;
} = {
  to: efold(() => false, () => true),
  from: b => b ? right(unit) : left(unit)
};

export const expProdSum: {
  to: <A, B, C>(t: Tuple<(b: B) => A, (c: C) => A>) => (e: Either<B, C>) => A;
  from: <A, B, C>(f: (e: Either<B, C>) => A) => Tuple<(b: B) => A, (c: C) => A>;
} = {
  to: t => efold(fst(t), snd(t)),
  from: f => [a => f(left(a)), b => f(right(b))]
};

export const expExpProd: {
  to: <A, B, C>(f: (t: Tuple<A, B>) => C) => (a: A) => (b: B) => C
  from: <A, B, C>(f: ((a: A) => (b: B) => C)) => (t: Tuple<A, B>) => C
} = {
  to: f => a => b => f([a, b]),
  from: f => t => f(fst(t))(snd(t))
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