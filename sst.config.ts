import type { SSTConfig } from "sst";
import { SvelteKitSite } from "sst/constructs";

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
        customDomain: {
          domainName:
            stack.stage === "prod"
              ? "corporate.internal.icssc.club"
              : `${stack.stage}-corporate.internal.icssc.club`,
          hostedZone: "icssc.club",
        },
      });
      stack.addOutputs({ url: site.url });
    });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
