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
      const site = new SvelteKitSite(stack, "site");
      stack.addOutputs({ url: site.url });
      new Cron(stack, "send-followup", {
        schedule: "rate(1 day)",
        job: "services/src/send-followup.handler",
        enabled: !app.local,
      });
    });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
