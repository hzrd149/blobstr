import { lilconfig } from "lilconfig";
import yaml from "yaml";

export type Rule = { type?: string; pubkeys?: string[]; expiration: string };
export type Config = {
  publicDomain: string;
  discovery: {
    nostr: {
      enabled: boolean;
      relays: string[];
    };
    upstream: {
      enabled: boolean;
      domains: string[];
    };
  };
  cache: {
    rules: Rule[];
    backend: "local" | "s3";
    local?: {
      dir: string;
    };
    s3?: {
      endpoint: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      publicURL?: string;
    };
  };
  upload: {
    enabled: boolean;
    requireAuth: boolean;
    rules: Rule[];
  };
  list: {
    requireAuth: boolean;
  };
  tor: {
    enabled: boolean;
    proxy: string;
  };
};

function loadYaml(filepath: string, content: string) {
  return yaml.parse(content);
}
function loadJson(filepath: string, content: string) {
  return JSON.parse(content);
}

const result = await lilconfig("blossom", {
  searchPlaces: ["config.yaml", "config.yml", "config.json"],
  loaders: {
    ".yaml": loadYaml,
    ".yml": loadYaml,
    ".json": loadJson,
  },
}).search();

const config: Config = result?.config;

export { config };
