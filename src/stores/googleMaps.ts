import { observable, action } from 'mobx';

export class GoogleMaps {
  @observable loaded: boolean = false;

  @action setLoaded = (value: boolean): void => {
    this.loaded = value;
  }
}

export default GoogleMaps;
