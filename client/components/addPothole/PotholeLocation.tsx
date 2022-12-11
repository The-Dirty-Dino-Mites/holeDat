import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AddressAutofill } from '@mapbox/search-js-react';
import PropTypes from 'prop-types';
import { InputGroup } from 'react-bootstrap';

const mapbox_token =
  'pk.eyJ1IjoiemFjaG1hcnVsbG8iLCJhIjoiY2xhazZ5aGxyMDQ3bzNwbzZ2Z3N0b3lpMyJ9.65G-mwqhbWFy77O_I0LkOg';

const PotholeLocation = ({ handleLocation }) => {
  const [location, setLocation] = useState<string>('');
  const [buttonMessage, setButtonMessage] = useState<string>('Add Approximate Address');

  const updateLatLon = () => {
    const formattedLocation = location.split(' ').join('%20');
    const mapAPI2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedLocation}.json?language=en&limit=5&proximity=-121.90662,37.42827&country=US&access_token=${mapbox_token}`;

    axios
      .get(mapAPI2)
      .then((data) =>
        handleLocation(data.data.features[0].center[1], data.data.features[0].center[0])
      )
      .catch((err) => console.log(err));
  };

  return (
    <Form.Group className='mb-5'>
      <Form.Label>Where Dat Pothole At?</Form.Label>
      <InputGroup id='addPotLocation'>
        <AddressAutofill accessToken={mapbox_token} browserAutofillEnabled={true}>
          <Form.Control
            id='mapfill'
            name='address'
            placeholder='Address'
            type='text'
            autoComplete='street-address'
            onChange={(e) => setLocation(e.target.value)}
          />
        </AddressAutofill>
        <div>
          <Button
            variant='flat'
            onClick={(e) => {
              if (location) {
                e.currentTarget.disabled = true;
                setButtonMessage('Address Added');
                updateLatLon();
              }
            }}
          >
            {buttonMessage}
          </Button>
        </div>
      </InputGroup>
    </Form.Group>
  );
};

PotholeLocation.propTypes = {
  handleLocation: PropTypes.func.isRequired,
};

export default PotholeLocation;
