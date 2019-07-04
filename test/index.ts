import {
    prodIdent, prodAssoc, prodComm, prodZeroZero, coprodIdent, coprodAssoc,
    coprodComm, distribute, onePlusOption, onePlusOneIsTwo, expProdSum,
    expExpProd, expOne, expZero,

    Tuple,
    absurd,
    AbsurdError
} from '../src/index';
import { deepEqual, throws } from 'assert';
import { right, left, Either, fold as efold } from 'fp-ts/lib/Either';
import { some } from 'fp-ts/lib/Option';
import { fst, snd, bimap } from 'fp-ts/lib/Tuple';

const compose = <A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
): ((a: A) => C) =>
    a => g(f(a));

deepEqual(compose(prodIdent.from, prodIdent.to)(42), 42);
deepEqual(compose(prodIdent.to, prodIdent.from)([undefined, 42]), [undefined, 42]);

deepEqual(
    compose(prodAssoc.from, prodAssoc.to)([["foo", 42], true]),
    [["foo", 42], true]
);
deepEqual(
    compose(prodAssoc.to, prodAssoc.from)(["foo", [42, true]]),
    ["foo", [42, true]]
);

deepEqual(compose(prodComm.from, prodComm.to)(["foo", 42]), ["foo", 42]);
deepEqual(compose(prodComm.to, prodComm.from)([42, "foo"]), [42, "foo"]);

// @ts-ignore
throws(compose(prodZeroZero.from, prodZeroZero.to), new AbsurdError());
// @ts-ignore
throws(() => compose(prodZeroZero.to, prodZeroZero.from)([undefined, 42]), new AbsurdError());

throws(() => compose(coprodIdent.from, coprodIdent.to)(42), new AbsurdError());
throws(() => compose(coprodIdent.to, coprodIdent.from)(right(42)), new AbsurdError());

deepEqual(
    compose(coprodAssoc.from, coprodAssoc.to)(left<Either<string, number>, boolean>(right(42))),
    left<Either<string, number>, boolean>(right(42))
);
deepEqual(
    compose(coprodAssoc.to, coprodAssoc.from)(right<string, Either<number, boolean>>(left(42))),
    right<string, Either<number, boolean>>(left(42))
);

deepEqual(compose(coprodComm.from, coprodComm.to)(left<number, boolean>(42)), left<number, boolean>(42));
deepEqual(compose(coprodComm.to, coprodComm.from)(right<boolean, number>(42)), right<boolean, number>(42));

deepEqual(
    compose(distribute.from, distribute.to)(left<Tuple<number, string>, Tuple<number, boolean>>([42, "foo"])),
    left<Tuple<number, string>, Tuple<number, boolean>>([42, "foo"])
);
deepEqual(
    compose(distribute.to, distribute.from)([42, left("foo")]),
    [42, left("foo")]
);

deepEqual(compose(onePlusOption.from, onePlusOption.to)(some(42)), some(42));
deepEqual(compose(onePlusOption.to, onePlusOption.from)(right(42)), right(42));

deepEqual(compose(onePlusOneIsTwo.from, onePlusOneIsTwo.to)(false), false);
deepEqual(compose(onePlusOneIsTwo.to, onePlusOneIsTwo.from)(left<void, void>(undefined)), left<void, void>(undefined));

const expProdSumEitherLength = compose(expProdSum.from, expProdSum.to)((e: Either<string[], string>) => efold<string[], string, number>(l => l.length, r => r.length)(e))
deepEqual(expProdSumEitherLength(left(['', ''])), 2);
deepEqual(expProdSumEitherLength(right('foo')), 3);
const expProdSumTupleLength = compose(expProdSum.to, expProdSum.from)([(ss: string[]) => ss.length, (s: string) => s.length]);
deepEqual(bimap<(s: string) => number, number, (ss: string[]) => number, number>(g => g('foo'), f => f(['', '']))(expProdSumTupleLength), [2, 3]);

const expExpProdCurry = compose(expExpProd.from, expExpProd.to)((a: number) => (b: boolean) => b ? a.toString() : (-a).toString());
deepEqual(expExpProdCurry(42)(true), '42');
deepEqual(expExpProdCurry(42)(false), '-42');
const expExpProdTupple = compose(expExpProd.to, expExpProd.from)((t: Tuple<number, boolean>) => snd(t) ? fst(t).toString() : (-fst(t)).toString());
deepEqual(expExpProdTupple([42, true]), '42');
deepEqual(expExpProdTupple([42, false]), '-42');

deepEqual(compose(expOne.from, expOne.to)(42), 42);
deepEqual(compose(expOne.to, expOne.from)(() => 42)(), 42);

deepEqual(compose(expZero.from, expZero.to)(undefined), undefined);
deepEqual(compose(expZero.to, expZero.from)(absurd), absurd);
console.log("ok");