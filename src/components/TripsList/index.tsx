import React, { FC } from 'react';
import { List, Statistic, Row, Col } from 'antd';
import { observer } from 'mobx-react-lite';

import './style.css';

import { useStore } from 'stores/storeContext';

const TripsList: FC = () => {
  const { tripStore } = useStore();
  const imgs = [
    "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m3.png",
    "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m1.png",
    "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m2.png",
    "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m4.png",
    "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m5.png"
  ];

  return (
    <List className="trip__list">
      {tripStore.data.map((trip, idx) => {
        const startDate = new Date(trip.starttime);
        const endDate = new Date(trip.stoptime);
        const durationHours = Math.floor(parseInt(trip.tripduration, 10) / 60);
        const durationMinutes = parseInt(trip.tripduration, 10) % 60;
        const startTime = startDate.toTimeString();
        const endTime = endDate.toTimeString();

        return (
          <List.Item key={idx} className="trip__item">
            <Row>
              <Col>
                <Statistic
                  className="trip__card"
                  title="Start Station"
                  value={trip["start station name"]}
                />
              </Col>
              <Col>
                <Statistic
                  className="trip__card"
                  title="End Station"
                  value={trip["end station name"]}
                />
              </Col>
              <Col>
                <Statistic
                  className="trip__card"
                  title="Duration"
                  value={`${durationHours}h ${durationMinutes}m`}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Statistic
                  className="trip__card"
                  title="Start Date"
                  value={startDate.toDateString()}
                />
              </Col>
              <Col>
                <Statistic
                  className="trip__card"
                  title="End Date"
                  value={endDate.toDateString()}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Statistic
                  className="trip__card"
                  title="Start Time"
                  value={startTime.substring(0, startTime.indexOf(' '))}
                />
              </Col>
              <Col>
                <Statistic
                  className="trip__card"
                  title="End Time"
                  value={endTime.substring(0, endTime.indexOf(' '))}
                />
              </Col>
            </Row>
          </List.Item>
        )
      })}
    </List>
  );
};

export default observer(TripsList);
