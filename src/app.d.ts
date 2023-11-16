declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
    }
  }
  namespace Lucia {
    type Auth = import("$lib/server/lucia").Auth;
    type DatabaseUserAttributes = {
      role: "UNAUTHORIZED" | "MEMBER" | "ADMIN";
      name?: string;
      email?: string;
    };
    type DatabaseSessionAttributes = Record<string, unknown>;
  }
}

export {};
