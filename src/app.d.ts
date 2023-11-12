declare global {
  namespace App {}
  namespace Lucia {
    type Auth = import("$lib/server/lucia").Auth;
    type DatabaseUserAttributes = { email?: string };
    type DatabaseSessionAttributes = Record<string, unknown>;
  }
}

export {};
