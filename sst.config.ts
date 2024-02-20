import crypto from "node:crypto";

import { RemovalPolicy } from "aws-cdk-lib";
import { AssetHashType, IgnoreMode } from "aws-cdk-lib";
import { Code, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import type { SSTConfig } from "sst";
import { App } from "sst/constructs";
import { StackContext, SvelteKitSite } from "sst/constructs";
import { RUNTIME } from "stacks";

export class PrismaLayer extends LayerVersion {
  externalModules: string[];

  environment: Record<string, string>;

  constructor(scope: Construct, id: string, props: PrismaLayerProps = {}) {
    const { prismaVersion, prismaModules, ...rest } = props;
    const nodeModules = props.nodeModules || [];

    const app = App.of(scope) as App;

    const layerDir = "/asset-output/nodejs";
    const nm = `${layerDir}/node_modules`;
    const engineDir = `${nm}/@prisma/engines`;
    const internalsDir = `${nm}/@prisma/internals`;
    const clientDir = `${nm}/@prisma/client`;

    // what are we asking npm to install?
    // deps to npm install to the layer
    const modulesToInstall = prismaModules || ["@prisma/client", "@prisma/engines"];
    const modulesToInstallWithVersion = prismaVersion
      ? modulesToInstall.map((dep) => `${dep}@${prismaVersion}`)
      : modulesToInstall;
    const modulesToInstallArgs = modulesToInstallWithVersion.concat(nodeModules).join(" ");

    // delete engines not requested
    const allEngines: PrismaEngine[] = [
      "introspection-engine",
      "schema-engine",
      "libquery_engine",
      "prisma-fmt",
    ];
    const prismaEngines = props.prismaEngines || ["libquery_engine"];
    const deleteEngineCmds = allEngines
      .filter((e) => !prismaEngines.includes(e))
      .map((e) => `rm -f ${engineDir}/${e}*`);

    const createBundleCommand = [
      // create asset bundle in docker
      "bash",
      "-c",
      [
        `echo "Installing ${modulesToInstallArgs}"`,
        "mkdir -p /tmp/npm && pushd /tmp/npm && HOME=/tmp npm i --no-save --no-package-lock npm@latest && popd",
        `mkdir -p ${layerDir}`,
        // install PRISMA_DEPS
        `cd ${layerDir} && HOME=/tmp /tmp/npm/node_modules/.bin/npm install --omit dev --omit peer --omit optional ${modulesToInstallArgs}`,
        // delete unneeded engines
        ...deleteEngineCmds,
        // internals sux
        `rm -f ${internalsDir}/dist/libquery_engine*`,
        `rm -f ${internalsDir}/dist/get-generators/libquery_engine*`,
        `rm -rf ${internalsDir}/dist/get-generators/engines`,
        // get rid of some junk
        `rm -rf ${engineDir}/download`,
        `rm -rf ${clientDir}/generator-build`,
        `rm -rf ${nm}/@prisma/engine-core/node_modules/@prisma/engines`,
        `rm -rf ${nm}/prisma/build/public`,
        `rm -rf ${nm}/prisma/prisma-client/src/__tests__`,
        `rm -rf ${nm}/prisma/prisma-client/generator-build`,
        `rm -rf ${nm}/@types`,
        `rm -rf ${nm}/.prisma`,
      ].join(" && "),
    ];

    // hash our parameters so we know when we need to rebuild
    const bundleCommandHash = crypto.createHash("sha256");
    bundleCommandHash.update(JSON.stringify(createBundleCommand));
    const bundleCommandDigest = bundleCommandHash.digest("hex");

    // bundle
    const code = Code.fromAsset(".", {
      // don't send all our files to docker (slow)
      ignoreMode: IgnoreMode.GLOB,
      exclude: ["*"],

      // if our bundle commands (basically our "dockerfile") changes then rebuild the image
      assetHashType: AssetHashType.CUSTOM,
      assetHash: bundleCommandDigest,

      bundling: {
        image: RUNTIME.bundlingImage,
        command: createBundleCommand,
      },
    });

    super(scope, id, { ...rest, code });

    // hint for prisma to find the engine
    this.environment = app.local
      ? {}
      : {
          PRISMA_QUERY_ENGINE_LIBRARY:
            "/opt/nodejs/node_modules/@prisma/engines/libquery_engine-rhel-openssl-1.0.x.so.node",
        };
    // modules provided by layer
    this.externalModules = [...new Set([...PRISMA_LAYER_EXTERNAL, ...nodeModules])];
  }
}

export default {
  config(_input) {
    return {
      name: "corporate-dashboard",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app
      .stack(function Site({ stack }) {
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
      })
      .stack(function Layers({ stack, app }: StackContext) {
        // shared prisma lambda layer
        const prismaLayer = new PrismaLayer(stack, "PrismaLayer", {
          description: "Prisma engine and library",
          layerVersionName: app.logicalPrefixedName("prisma"),
          prismaVersion: PRISMA_VERSION,

          // retain for rollbacks
          removalPolicy: RemovalPolicy.RETAIN,

          prismaEngines: ["libquery_engine"],
        });

        app.addDefaultFunctionLayers([prismaLayer]);
        app.addDefaultFunctionEnv(prismaLayer.environment);
        app.setDefaultFunctionProps({
          copyFiles: [{ from: "prisma/schema.prisma", to: "src/schema.prisma" }],
          nodejs: {
            format: "esm",
            esbuild: {
              banner: { js: ESM_REQUIRE_SHIM },
              external: LAYER_MODULES.concat(prismaLayer.externalModules),
              sourcemap: true,
            },
          },
        });
      });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
