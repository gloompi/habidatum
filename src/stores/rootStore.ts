import TripStore from './tripStore';
import GoogleMapsStore from './googleMaps';

export class RootStore {
  public tripStore = new TripStore();
  public googleMapsStore = new GoogleMapsStore();
};

export default new RootStore();
