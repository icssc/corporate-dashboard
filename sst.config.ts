import type { SSTConfig } from "sst";
import { Cron, SvelteKitSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "corporate-dashboard",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new SvelteKitSite(stack, "site", {
        customDomain:
          stack.stage === "prod"
            ? "corporate.internal.icssc.club"
            : `staging-${stack.stage}-corporate.internal.icssc.club`,
      });
      stack.addOutputs({ url: site.url });
      if (app.stage === "prod") {
        new Cron(stack, "send-followup", {
          schedule: "rate(1 day)",
          job: "services/src/send-followup.handler",
          enabled: !app.local,
        });
      }
    });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
