import { observable, computed, action } from 'mobx';

import config from 'config';
import fetch from 'services/customFetch';

export interface ITrip {
  tripduration: string;
  starttime: string;
  stoptime:	string;
  usertype:	string;
  gender:	string;
  bikeid:	string;
  "birth year": string;
  "start station id":	string;
  "start station name":	string;
  "start station latitude":	string;
  "start station longitude": string;
  "end station id":	string;
  "end station name":	string;
  "end station latitude":	string;
  "end station longitude":	string;
}

interface IResponse {
  data: ITrip[];
  length: number;
}

export class TripStore {
  @observable public data: ITrip[] = [];
  @observable public loaded: boolean = false;
  @observable public totalItems: number = 0;
  private _startPoint: number = 500;
  private _limit: number = 50;

  private get _endPoint(): number {
    return this._startPoint + this._limit;
  }

  @computed public get isNextPageActive(): boolean {
    return this._endPoint < this.totalItems;
  }

  @computed public get isPrevPageActive(): boolean {
    return this._startPoint > this._limit;
  }

  @computed public get paginationItems(): number[] {
    const pagesNumber = Math.ceil(this.totalItems / this._limit);
    const result = [];

    for (let i = 0; i < pagesNumber; i++) {
      result.push(i);
    }

    return result;
  }

  @action public nextPage = (): void => {
    this._startPoint += this._limit;
  }

  @action public prevPage = (): void => {
    this._startPoint -= this._limit;
  }

  @action public fetchData = async (): Promise<ITrip[]> => {
    this.setLoaded(false);

    const url = `${config.apiUrl}/${this._startPoint}-${this._endPoint}`;

    const { data, length } = await fetch<IResponse>(url);

    this.data = data;
    this.totalItems = length;
    this.setLoaded(true);

    return this.data;
  }

  @action public setLoaded = (value: boolean): void => {
    this.loaded = value;
  }
};

export default TripStore;
