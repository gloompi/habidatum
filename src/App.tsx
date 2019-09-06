import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import 'antd/dist/antd.css';
import 'App.css';
import config from 'config';

import rootStore from 'stores/rootStore';
import { StoreProvider } from 'stores/storeContext';
import { GoogleProvider } from 'services/GoogleMapsService/googleContext';
import GoogleMapsService, { GoogleMapsSession } from 'services/GoogleMapsService';
import GoogleMaps from 'components/GoogleMaps';
import TripsList from 'components/TripsList';
import Loader from 'components/Loader';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [googleSession, setGoogleSession] = useState<GoogleMapsSession | null>(null);

  useEffect(() => {
    const init = async () => {
      await rootStore.tripStore.fetchData();
      const service = new GoogleMapsService(config.apiKey);
      const session = await service.startSession();

      setGoogleSession(session);
    }

    init();

    return () => {
      setGoogleSession(null);
    }
  }, []);

  if (googleSession === null) return <Loader />;

  return (
    <GoogleProvider google={googleSession}>
      <StoreProvider rootStore={rootStore}>
        <Layout>
          <Header className="header">
            Header
          </Header>
          <Layout>
            <Content className="main">
              <div className="trips__wrapper">
                <TripsList />
              </div>
              <div className="map__wrapper">
                <GoogleMaps />
              </div>
            </Content>
          </Layout>
          <Footer className="footer">
            Footer
          </Footer>
        </Layout>
      </StoreProvider>
    </GoogleProvider>
  );
};

export default App;
