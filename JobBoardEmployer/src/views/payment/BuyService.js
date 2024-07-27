import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
} from '@coreui/react';
import axios from 'axios';

import ReactImg from 'src/assets/images/react.png';

const BuyServices = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/api/payment/status', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSubscription(response.data);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
        }
      }
    };

    fetchSubscription();
  }, []);

  const handleBuyNow = async (total) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8080/api/payment/pay', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            total: total,
          },
        });
        console.log('Payment successful:', response.data);
        window.location.href = response.data;
      } catch (error) {
        console.error('Payment failed:', error);
        setLoading(false);
      }
    } else {
      console.error('Token not found. User not authenticated.');
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const renderPackageCard = (title, description, price) => (
    <CCol xs={12} md={4}>
      <CCard className="service-card">
        <CCardImage orientation="top" src={ReactImg} />
        <CCardBody>
          <CCardTitle>{title}</CCardTitle>
          <CCardText>{description}</CCardText>
          {subscription ? (
            <CButton color="secondary" disabled>
              You have already purchased this package. Please wait until it expires.
            </CButton>
          ) : (
            <CButton
              color="primary"
              onClick={() => handleBuyNow(price)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </CButton>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  );

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <p className="text-body-secondary small">
              Discover our comprehensive range of job posting packages tailored to meet your recruitment needs. Whether you're looking to fill a single role or expand your team, our packages offer flexible options designed to maximize visibility and attract top talent. Explore now and streamline your hiring process with ease.
            </p>

            <CRow>
              {renderPackageCard(
                'Package of 30 posts per month',
                'The price is only $10 but you can post 30 posts in 1 month, easy payment via PayPal.',
                10
              )}
              {renderPackageCard(
                'Package of 70 posts per month',
                'The price is only $20 but you can post 70 posts in 1 month, easy payment via PayPal.',
                20
              )}
              {renderPackageCard(
                'Package of 100 posts per month',
                'The price is only $29 but you can post 100 posts in 1 month, easy payment via PayPal.',
                29
              )}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BuyServices;

// Inline CSS
const style = document.createElement('style');
style.textContent = `
  .service-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
  }

  .service-card .CButton {
    margin-top: auto; /* Push button to the bottom of the card */
  }

  .service-card img {
    max-width: 100%;
    height: auto;
  }

  .text-body-secondary {
    margin-bottom: 2rem;
  }
`;
document.head.append(style);
