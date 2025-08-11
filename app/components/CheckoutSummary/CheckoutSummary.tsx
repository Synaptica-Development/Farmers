import { useEffect, useState } from 'react';
import styles from './CheckoutSummary.module.scss';
import api from '@/lib/axios';
import Image from 'next/image';
import AddAddressPop from '../AddAddressPop/AddAddressPopUp';

interface Props {
  totalOfCart: string;
}

interface Address {
  id: string;
  address: string;
}

const CheckoutSummary = ({ totalOfCart }: Props) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = () => {
    api
      .get<Address[]>('/api/Cart/getaddresses')
      .then((res) => {
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0].id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleDelete = (id: string) => {
    api
      .delete(`/api/Cart/delete-address?addressID=${id}`)
      .then(() => {
        console.log('წარმატებით წაიშალა');
        fetchAddresses();
      });
  };

    const handleCheckout = async () => {
    if (!selectedAddressId) return;

    try {
      setLoading(true);
      const response = await api.put<{ checkout_Url: string }>('/api/Cart/proceed-payment', {
        addressID: selectedAddressId, 
      });

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
    if (addresses.length === 0 || !selectedAddressId) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [addresses, selectedAddressId]);


  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.addressesWrapper}>
        <h2>მისამართი</h2>
        {addresses.length > 0 ? (
          <div className={styles.addressesItemsWrapper} role="radiogroup" aria-label="მისამართები">
            {addresses?.map((addr) => (
              <div key={addr.id} className={styles.addressItem}>
                <label className={styles.left}>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => handleSelect(addr.id)}
                    className={styles.radio}
                  />
                  <span className={styles.text}>{addr.address}</span>
                </label>

                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label="წაშლა"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr.id);
                  }}
                >
                  <Image src="/cardDeleteIcon.svg" alt="delete icon" width={20} height={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>მისამართი არ არის მიუთითებელი.</p>
        )}

        <p
          className={styles.addAddress}
          role="button"
          tabIndex={0}
          onClick={() => setShowAddPopup(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setShowAddPopup(true);
          }}
        >
          დაამატე მისამართი
        </p>
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
    </div>
  );
};

export default CheckoutSummary;
