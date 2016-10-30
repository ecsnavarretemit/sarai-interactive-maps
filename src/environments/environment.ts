// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

const geoserverWorkspace = 'sarai-20161024';

export const environment = {
  production: false,
  sarai_map_config: {
    geoserver: {
      workspace: geoserverWorkspace,
      wmsTileLayerUrl: `http://202.92.144.40:8080/geoserver/${geoserverWorkspace}/wms?tiled=true`,
      restApiEndpoint: 'http://202.92.144.40:8080/geoserver/rest'
    },
    suitability_maps: {
      countrLevelLayerSuffix: '_simplified_gridcode_all',
      municipalLevelLayerSuffix: '_detailed_gridcode_all',
      propertyFilterName: 'GRIDCODE'
    },
    ndvi_maps: {
      eeApiEndpoint: 'http://localhost:5000/ndvi',
      eeApiEndpointMethod: 'GET'
    }
  }
};


