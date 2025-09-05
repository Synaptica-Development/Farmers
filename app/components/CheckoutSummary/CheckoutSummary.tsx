'use client';

import { useEffect, useState } from 'react';
import styles from './CheckoutSummary.module.scss';
import api from '@/lib/axios';
import AddAddressPop from '../AddAddressPop/AddAddressPopUp';
import ChangeActiveAddress from '../ChangeActiveAddress/ChangeActiveAddress';

interface Props {
  totalOfCart: string;
}

interface Address {
  id: string;
  address: string;
  name: string;
  phoneNumber: string;
  location: string;
  selected: boolean;
}

const CheckoutSummary = ({ totalOfCart }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeAddress, setActiveAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = () => {
    api
      .get<Address[]>('/api/Cart/getaddresses')
      .then((res) => {
        const data = res.data;
        setAddresses(data);

        const active = data.find((addr) => addr.selected) || null;
        setActiveAddress(active);
        setSelectedAddressId(active ? active.id : null);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) return;
    
    try {
      setLoading(true);
      const response = await api.post<{ checkout_Url: string }>(
        '/api/Cart/proceed-payment',
        { addressID: selectedAddressId }
      );

      if (response.data.checkout_Url) {
        window.open(response.data.checkout_Url, '_blank');
      }
    } catch (error) {
      console.error('Payment request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    setIsDisabled(!activeAddress || !selectedAddressId || !totalOfCart);
  }, [activeAddress, selectedAddressId]);

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.addressesWrapper}>
        <h2>მისამართი</h2>

        {activeAddress ? (
          <div className={styles.addressDetails}>
            <p>{activeAddress.name}</p>
            <p>{activeAddress.location}</p>
            <p>{activeAddress.address}</p>
            <p>{activeAddress.phoneNumber}</p>
          </div>
        ) : (
          <p>მისამართი არ არის მიუთითებელი.</p>
        )}

        <div className={styles.buttonsWrapper}>
          <p
            className={styles.button}
            role="button"
            tabIndex={0}
            onClick={() => setShowEditPopup(true)}
          >
            შეცვალე
          </p>

          <p
            className={styles.button}
            role="button"
            tabIndex={0}
            onClick={() => setShowAddPopup(true)}
          >
            ახალი მისამართი
          </p>
        </div>
      </div>

      <div className={styles.totalInfo}>
        <h2>კალათის ჯამი</h2>

        <div className={styles.totalDetails}>
          <div className={styles.totalDetailsPrice}>
            <h3>პროდუქტების ფასი</h3>
            <p>{totalOfCart}₾</p>
          </div>

          <div className={styles.totalDetailsTotal}>
            <h3>ჯამი</h3>
            <p>{totalOfCart}₾</p>
          </div>
        </div>

        <button
          className={`${styles.buttonGeneralStyles} ${isDisabled ? styles.buttonDesableStyles : ''}`}
          disabled={isDisabled || loading}
          onClick={handleCheckout}
        >
          {loading ? 'იტვირთება...' : 'შეკვეთა'}
        </button>
      </div>

      {showAddPopup && (
        <AddAddressPop
          onClose={() => {
            setShowAddPopup(false);
            fetchAddresses();
          }}
        />
      )}

      {showEditPopup && (
        <ChangeActiveAddress
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onClose={() => setShowEditPopup(false)}
          onChangeActive={(id) => {
            setSelectedAddressId(id);
            const updatedActive = addresses.find((addr) => addr.id === id) || null;
            setActiveAddress(updatedActive);
            setAddresses((prev) =>
              prev.map((addr) => ({ ...addr, selected: addr.id === id }))
            );
          }}
        />
      )}

    </div>
  );
};

export default CheckoutSummary;
