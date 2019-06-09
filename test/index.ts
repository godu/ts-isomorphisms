import {
    prodIdent, prodAssoc, prodComm, prodZeroZero, coprodIdent, coprodAssoc,
    coprodComm, distribute, onePlusOption, onePlusOneIsTwo, expProdSum,
    expExpProd, expOne, expZero,

    absurd,
    AbsurdError
} from '../src/index';
import { deepEqual, throws } from 'assert';
import { Tuple } from 'fp-ts/lib/Tuple';
import { Right, Left, Either } from 'fp-ts/lib/Either';
import { Some } from 'fp-ts/lib/Option';

const compose = <A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
): ((a: A) => C) =>
    a => g(f(a));

deepEqual(compose(prodIdent.from, prodIdent.to)(42), 42);
deepEqual(compose(prodIdent.to, prodIdent.from)(new Tuple(undefined, 42)), new Tuple(undefined, 42));

deepEqual(
    compose(prodAssoc.from, prodAssoc.to)(new Tuple(new Tuple("foo", 42), true)),
    new Tuple(new Tuple("foo", 42), true)
);
deepEqual(
    compose(prodAssoc.to, prodAssoc.from)(new Tuple("foo", new Tuple(42, true))),
    new Tuple("foo", new Tuple(42, true))
);

deepEqual(compose(prodComm.from, prodComm.to)(new Tuple("foo", 42)), new Tuple("foo", 42));
deepEqual(compose(prodComm.to, prodComm.from)(new Tuple(42, "foo")), new Tuple(42, "foo"));

// @ts-ignore
throws(compose(prodZeroZero.from, prodZeroZero.to), new AbsurdError());
// @ts-ignore
throws(() => compose(prodZeroZero.to, prodZeroZero.from)(new Tuple(undefined, 42)), new AbsurdError());

throws(() => compose(coprodIdent.from, coprodIdent.to)(42), new AbsurdError());
throws(() => compose(coprodIdent.to, coprodIdent.from)(new Right(42)), new AbsurdError());

deepEqual(
    compose(coprodAssoc.from, coprodAssoc.to)(new Left<Either<string, number>, boolean>(new Right(42))),
    new Left<Either<string, number>, boolean>(new Right(42))
);
deepEqual(
    compose(coprodAssoc.to, coprodAssoc.from)(new Right<string, Either<number, boolean>>(new Left(42))),
    new Right<string, Either<number, boolean>>(new Left(42))
);

deepEqual(compose(coprodComm.from, coprodComm.to)(new Left<number, boolean>(42)), new Left<number, boolean>(42));
deepEqual(compose(coprodComm.to, coprodComm.from)(new Right<boolean, number>(42)), new Right<boolean, number>(42));

deepEqual(
    compose(distribute.from, distribute.to)(new Left<Tuple<number, string>, Tuple<number, boolean>>(new Tuple(42, "foo"))),
    new Left<Tuple<number, string>, Tuple<number, boolean>>(new Tuple(42, "foo"))
);
deepEqual(
    compose(distribute.to, distribute.from)(new Tuple<number, Either<string, boolean>>(42, new Left("foo"))),
    new Tuple<number, Either<string, boolean>>(42, new Left("foo"))
);

deepEqual(compose(onePlusOption.from, onePlusOption.to)(new Some(42)), new Some(42));
deepEqual(compose(onePlusOption.to, onePlusOption.from)(new Right(42)), new Right(42));

deepEqual(compose(onePlusOneIsTwo.from, onePlusOneIsTwo.to)(false), false);
deepEqual(compose(onePlusOneIsTwo.to, onePlusOneIsTwo.from)(new Left<void, void>(undefined)), new Left<void, void>(undefined));

const expProdSumEitherLength = compose(expProdSum.from, expProdSum.to)((e: Either<string[], string>) => e.fold<number>(l => l.length, r => r.length))
deepEqual(expProdSumEitherLength(new Left(['', ''])), 2);
deepEqual(expProdSumEitherLength(new Right('foo')), 3);
const expProdSumTupleLength = compose(expProdSum.to, expProdSum.from)(new Tuple((ss: string[]) => ss.length, (s: string) => s.length));
deepEqual(expProdSumTupleLength.bimap<number, number>(f => f(['', '']), g => g('foo')), new Tuple(2, 3));

const expExpProdCurry = compose(expExpProd.from, expExpProd.to)((a: number) => (b: boolean) => b ? a.toString() : (-a).toString());
deepEqual(expExpProdCurry(42)(true), '42');
deepEqual(expExpProdCurry(42)(false), '-42');
const expExpProdTupple = compose(expExpProd.to, expExpProd.from)((t: Tuple<number, boolean>) => t.snd ? t.fst.toString() : (-t.fst).toString());
deepEqual(expExpProdTupple(new Tuple(42, true)), '42');
deepEqual(expExpProdTupple(new Tuple(42, false)), '-42');

deepEqual(compose(expOne.from, expOne.to)(42), 42);
deepEqual(compose(expOne.to, expOne.from)(() => 42)(), 42);

deepEqual(compose(expZero.from, expZero.to)(undefined), undefined);
deepEqual(compose(expZero.to, expZero.from)(absurd), absurd);
