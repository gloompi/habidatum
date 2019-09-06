interface IMapOptins {
  center: { lat: number, lng: number },
  zoom: number
}

interface IMapConstruct {
  new (elem: HTMLElement | null, options: IMapOptins): HTMLElement;
}

interface IGoogleAPI {
  maps: {
    Map: IMapConstruct;
    Marker: IMarker;
    places: {
      PlacesService: {
        new (elem: HTMLElement): IPlacesService;
      };
    }
  };
}

interface IMarkerOptions {
  map?: HTMLElement;
  position?: { lat: number, lng: number },
  icon?: string;
  label?: string;
  title?: string;
}

export interface IMarker {
  new (options: IMarkerOptions): any;
}

interface IMarkerCluster {
  new (map: HTMLElement, markers: IMarker[], options: { imagePath: string }): any;
}

enum PlacesServiceStatus {
  INVALID_REQUEST = 'INVALID_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  OK = 'OK',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ZERO_RESULTS = 'ZERO_RESULTS',
}

interface PlaceDetailsRequest {
  fields: string[];
  placeId: string;
}

interface PlaceResult {
  id: string;
  name: string;
  place_id: string;
}

interface IPlacesService {
  getDetails(
    request: PlaceDetailsRequest,
    callback: (result: PlaceResult, status: PlacesServiceStatus) => void
  ): void;
}

const getApi = (() => {
  const cachedApis: {[apiKey: string]: IGoogleAPI} = {};

  return (apiKey: string) =>
    new Promise<IGoogleAPI>((resolve, reject) => {
      if (cachedApis[apiKey]) {
        resolve(cachedApis[apiKey]);
        return;
      }

      const script = document.createElement('script');

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

      script.onload = () => {
        cachedApis[apiKey] = (window as any).google;
        resolve(cachedApis[apiKey]);
      };

      script.onerror = err => {
        reject(err);
      };

      document.body.appendChild(script);
    });
})();

const getMarkerCluster = (): Promise<IMarkerCluster> => (
  new Promise<IMarkerCluster>((resolve, reject) => {
    const script = document.createElement('script');

    script.src = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

    script.onload = () => {
      const cluster = (window as any).MarkerClusterer;
      resolve(cluster);
    };

    script.onerror = err => {
      reject(err);
    };

    document.body.appendChild(script);
  })
)

export class GoogleMapsSession {
  public map: HTMLElement | null = null;
  private _google: IGoogleAPI;
  private _placesService: IPlacesService | null = null;

  get Map(): IMapConstruct {
    return this._google.maps.Map;
  }

  get places(): IPlacesService | null {
    return this._placesService;
  }

  get Marker(): IMarker {
    return this._google.maps.Marker;
  }

  constructor(google: IGoogleAPI) {
    this._google = google;
  }

  setPlacesService = (map: HTMLElement): Promise<void> => (
    new Promise((resolve, _reject) => {
      this._placesService = new this._google.maps.places.PlacesService(map);
      resolve();
    })
  )

  setMapElement = async (map: HTMLElement): Promise<void> => {
    this.map = map;

    await this.setPlacesService(map);
  }

  getDetails = (placeId: string): Promise<PlaceResult | null> => (
    new Promise<PlaceResult>((resolve, reject) => {
      const request: PlaceDetailsRequest = {
        fields: ['id', 'name', 'place_id'],
        placeId,
      };

      if (this._placesService === null) {
        return null;
      }

      this._placesService.getDetails(request, (result, status) => {
        if (status !== PlacesServiceStatus.OK) {
          reject(status);
        } else {
          resolve(result);
        }
      });
    })
  )
}

export default class GoogleMapsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async startSession() {
    const google = await getApi(this.apiKey);
    const session = new GoogleMapsSession(google);

    return session;
  }
}
