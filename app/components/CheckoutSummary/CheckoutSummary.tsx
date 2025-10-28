'use client';
import React, { useEffect, useState } from 'react';
import styles from './CheckoutSummary.module.scss';
import api from '@/lib/axios';
import ChangeActiveAddress from '../ChangeActiveAddress/ChangeActiveAddress';
import AddAddressPop from '../AddAddressPop/AddAddressPopUp';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  totalPrice: number;
  totalPriceWithFee: number;
  transportFee: number;
  otherFee: number;
  cartMinimumPrice: string | number;
  refetchCartData: () => void;
}

interface Address {
  id: string;
  address: string;
  name: string;
  phoneNumber: string;
  location: string;
  selected: boolean;
}

const CheckoutSummary = ({ totalPrice, totalPriceWithFee, otherFee, cartMinimumPrice, refetchCartData }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeAddress, setActiveAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const minimumPrice = Number(cartMinimumPrice) || 0;

  const fetchAddresses = async () => {
    try {
      const res = await api.get<Address[]>('/api/Cart/getaddresses');
      const data = res.data;
      setAddresses(data);
      const active = data.find((addr) => addr.selected) || null;
      setActiveAddress(active);
      setSelectedAddressId(active ? active.id : null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    setIsDisabled(!activeAddress || !selectedAddressId || !totalPrice);
  }, [activeAddress, selectedAddressId, totalPrice]);

  const handleCheckout = async () => {
    if (totalPrice < minimumPrice) {
      toast.error(`შეკვეთა უნდა იყოს მინიმუმ ${minimumPrice} ლარის`);
      return;
    }
    if (!selectedAddressId) return;
    try {
      setLoading(true);
      const response = await api.post(`/api/Cart/proceed-payment?addressID=${selectedAddressId}`);
      if (response?.data?._links?.redirect?.href) {
        window.open(response.data._links.redirect.href, '_blank');
      }
      router.push('/');
      refetchCartData();
    } catch (error) {
      console.error('Payment request failed:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <p className={styles.noAddress}>მისამართი არ არის მიუთითებელი</p>
        )}
        <div className={styles.buttonsWrapper}>
          <p className={styles.button} role="button" tabIndex={0} onClick={() => setShowEditPopup(true)}>შეცვლა</p>
          <p className={styles.button} role="button" tabIndex={0} onClick={() => setShowAddPopup(true)}>ახალი მისამართი</p>
        </div>
      </div>
      <div className={styles.totalInfo}>
        <h2>კალათის ჯამი</h2>
        <div className={styles.totalDetails}>
          <div className={styles.totalDetailsPrice}>
            <h3>პროდუქტის ღირებულება</h3>
            <p>{totalPrice}₾</p>
          </div>
          <div className={styles.totalDetailsPrice}>
            <h3>მომსახურების საფასური</h3>
            <p>{otherFee}₾</p>
          </div>
          <div className={styles.totalDetailsPrice}>
            <h3>გადარიცხვის საკომისიო</h3>
            <p>2%</p>
          </div>
          <div className={styles.totalDetailsTotal}>
            <h3>ჯამი</h3>
            <p>{totalPriceWithFee}₾</p>
          </div>
        </div>
        <button className={`${styles.buttonGeneralStyles} ${isDisabled ? styles.buttonDesableStyles : ''}`} disabled={isDisabled || loading} onClick={handleCheckout}>
          {loading ? 'იტვირთება...' : 'გადახდა'}
        </button>
        {totalPrice > minimumPrice || <p className={styles.errorText}>შეკვეთა უნდა იყოს მინიმუმ {minimumPrice} ლარის</p>}
      </div>
      {showAddPopup && <AddAddressPop onClose={async () => { setShowAddPopup(false); await fetchAddresses(); }} />}
      {showEditPopup && (
        <ChangeActiveAddress
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onClose={() => setShowEditPopup(false)}
          onChangeActive={(id) => {
            setSelectedAddressId(id);
            const updatedActive = addresses.find((addr) => addr.id === id) || null;
            setActiveAddress(updatedActive);
            setAddresses((prev) => prev.map((addr) => ({ ...addr, selected: addr.id === id })));
          }}
          fetchAddresses={fetchAddresses}
        />
      )}
    </div>
  );
};

export default CheckoutSummary;
