export const environment = {
  production: false,
  ga: {
    code: ''
  },
  sarai_map_config: {
    app_title: 'SARAI Interactive Maps - Project SARAI',
    geoserver: {
      baseUrl: 'http://demo.opengeo.org/geoserver',
      restApiEndpoint: 'http://demo.opengeo.org/geoserver/rest'
    },
    translations: {
      static: {
        prefix: '/assets/i18n',
        ext: '.json'
      }
    },
    suitability_maps: {
      countrLevelLayerSuffix: '_country_suffix',
      municipalLevelLayerSuffix: '_minicipal_suffix',
      propertyFilterName: 'GRIDCODE',
      cropsApiEndpoint: 'http://localhost:3000/crops/',
      cropsApiEndpointMethod: 'GET',
      imageRootPath: 'http://localhost:4200/assets/docs/crops',
      wms: {
        workspace: 'sarai-20161024',
        tiled: true
      }
    },
    crop_production_area_maps: {
      wms: {
        workspace: 'sarai-crop-production-area-20161024',
        tiled: true
      }
    },
    ndvi_maps: {
      eeApiEndpoint: 'http://localhost:5000/ndvi',
      eeApiEndpointMethod: 'GET'
    },
    rainfall_maps: {
      eeApiEndpoint: 'http://localhost:5000/chirps',
      eeApiEndpointMethod: 'GET'
    },
    location_api: {
      region: {
        endpoint: 'http://localhost:3000/regions/',
        method: 'GET'
      },

      province: {
        endpoint: 'http://localhost:3000/provinces/',
        method: 'GET'
      }
    }
  }
};


