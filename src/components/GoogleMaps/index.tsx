import React, {
  FC,
  useEffect,
} from 'react';

import './style.css';

import { IMarker } from 'services/GoogleMapsService';
import { useGoogleSession } from 'services/GoogleMapsService/googleContext';
import { useStore } from 'stores/storeContext';
import Loader from 'components/Loader';

const GoogleMaps: FC = () => {
  const { tripStore, googleMapsStore } = useStore();
  const googleSession = useGoogleSession();
  const markers: IMarker[] = [];

  useEffect(() => {
    const lat = parseInt(tripStore.data[0]["start station latitude"], 10);
    const lng = parseInt(tripStore.data[0]["start station longitude"], 10);
    const map = new googleSession.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 12
    });
    
    const init = async () => {
      await googleSession.setMapElement(map);
      googleMapsStore.setLoaded(true);
      
      tripStore.data.forEach((trip, idx) => {
        markers.push(new googleSession.Marker({
          position: {
            lat: parseInt(trip["end station latitude"], 10),
            lng: parseInt(trip["end station longitude"], 10)
          },
          icon: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m1.png',
          map,
        }));
        markers.push(new googleSession.Marker({
          position: {
            lat: parseInt(trip["start station latitude"], 10),
            lng: parseInt(trip["start station longitude"], 10)
          },
          icon: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m2.png',
          map,
        }));
      });
    };

    init();
  }, [
    googleSession.Map,
    tripStore.data,
    googleMapsStore,
    googleSession,
    markers,
  ]);

  if (!tripStore.loaded) return <Loader />;

  return (
    <div className="map__container">
      <div id="map" className="map" />
    </div>
  );
};

export default GoogleMaps;
