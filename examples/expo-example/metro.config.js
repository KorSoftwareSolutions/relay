const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Force Metro to resolve from node_modules without hierarchical lookup
config.resolver.disableHierarchicalLookup = false;

// Fix for Zod v4 + Fast Refresh incompatibility
// Override the getTransformOptions to exclude zod from Fast Refresh
const originalGetTransformOptions = config.transformer.getTransformOptions;
config.transformer.getTransformOptions = async (entryPoints, options, getDependenciesOf) => {
  const transformOptions = originalGetTransformOptions
    ? await originalGetTransformOptions(entryPoints, options, getDependenciesOf)
    : {};

  return {
    ...transformOptions,
    transform: {
      ...transformOptions.transform,
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  };
};

module.exports = config;
