import { Route as rootRoute } from './routes/__root';
import { Route as r1 } from './routes/index';
import { Route as r2 } from './routes/pitch';
import { Route as r3 } from './routes/pricing';
import { Route as r4 } from './routes/products';
import { Route as r5 } from './routes/downloads';
import { Route as r6 } from './routes/developers';
import { Route as r7 } from './routes/docs';
import { Route as r8 } from './routes/docs.$';
import { Route as r9 } from './routes/designs';
import { Route as r10 } from './routes/designs.$slug';
import { Route as r11 } from './routes/logo';
import { Route as r12 } from './routes/u.$username';
import { Route as r13 } from './routes/$alias.$';
import { Route as r14 } from './routes/i.$';

export const routeTree = rootRoute.addChildren([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]);
