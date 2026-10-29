// apps/server/src/types/express.d.ts
//
// FIX: routes/recipes.ts, middleware/audit.ts, and middleware/license.ts
// all read req.user, but Express's Request type has no such property.
// Under `strict` this fails to compile. This augmentation adds it.
//
// Make sure tsconfig.json's "include" covers this file (e.g. "src/**/*.d.ts")
// so the compiler picks it up.

import { UserLicense } from '../../../web/src/types'; // adjust path to wherever
                                                        // your shared UserLicense
                                                        // type actually lives if
                                                        // you don't share types
                                                        // across apps/

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        orgId?: string;
        role: 'student' | 'teacher' | 'admin';
        license: UserLicense;
      };
    }
  }
}
