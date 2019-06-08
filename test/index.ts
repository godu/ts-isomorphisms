import {
    prodIdent, prodAssoc, prodComm, prodZeroZero, coprodIdent, coprodAssoc,
    coprodComm, distribute, onePlusOption, onePlusOneIsTwo, expProdSum,
    expExpProd, expOne, expZero
} from '../src/index';
import { } from 'util';

const compose = <A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
): ((a: A) => C) =>
    a => g(f(a));

type Identity = <A>(a: A) => A;

compose(prodIdent.from, prodIdent.to);
compose(prodIdent.to, prodIdent.from);

compose(prodAssoc.from, prodAssoc.to);
compose(prodAssoc.to, prodAssoc.from);

compose(prodComm.from, prodComm.to);
compose(prodComm.to, prodComm.from);

compose(prodZeroZero.from, prodZeroZero.to);
compose(prodZeroZero.to, prodZeroZero.from);

compose(coprodIdent.from, coprodIdent.to);
compose(coprodIdent.to, coprodIdent.from);

compose(coprodAssoc.from, coprodAssoc.to);
compose(coprodAssoc.to, coprodAssoc.from);

compose(coprodComm.from, coprodComm.to);
compose(coprodComm.to, coprodComm.from);

compose(distribute.from, distribute.to);
compose(distribute.to, distribute.from);

compose(onePlusOption.from, onePlusOption.to);
compose(onePlusOption.to, onePlusOption.from);

compose(onePlusOneIsTwo.from, onePlusOneIsTwo.to);
compose(onePlusOneIsTwo.to, onePlusOneIsTwo.from);

compose(expProdSum.from, expProdSum.to);
compose(expProdSum.to, expProdSum.from);

compose(expExpProd.from, expExpProd.to);
compose(expExpProd.to, expExpProd.from);

compose(expOne.from, expOne.to);
compose(expOne.to, expOne.from);

compose(expZero.from, expZero.to);
compose(expZero.to, expZero.from);
