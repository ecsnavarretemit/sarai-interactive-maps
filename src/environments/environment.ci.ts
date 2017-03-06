export const environment = {
  production: false,
  app: {
    global: {
      app_title: 'SARAI Interactive Maps - Project SARAI',
      default_lang: 'en',
      lang_cookie_name: 'app_lang',
      geoserver: {
        baseUrl: 'http://demo.opengeo.org/geoserver',
        restApiEndpoint: 'http://demo.opengeo.org/geoserver/rest'
      },
      translations: {
        static: {
          prefix: '/assets/i18n/',
          ext: '.json'
        }
      }
    },
    map: {
      crop_production_area_maps: {
        wms: {
          workspace: 'sarai-crop-production-area-20161024',
          tiled: true
        }
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
      },
      ndvi_maps: {
        eeApiEndpoint: 'http://localhost:5000/ndvi',
        eeApiEndpointMethod: 'GET'
      },
      rainfall_maps: {
        eeApiEndpoint: 'http://localhost:5000/chirps',
        eeApiEndpointMethod: 'GET'
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
      }
    }
  }
};


