'use client';

import { useState } from 'react';
import styles from './ChangeActiveAddress.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';

interface Address {
  id: string;
  address: string;
  name: string;
  phoneNumber: string;
  location: string;
  selected: boolean;
}

interface Props {
  addresses: Address[];
  selectedAddressId: string | null;
  onClose: () => void;
  onChangeActive: (id: string) => void;
}

const ChangeActiveAddress = ({
  addresses,
  selectedAddressId,
  onClose,
  onChangeActive,
}: Props) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    try {
      await api.put(`/api/Cart/select-address`, null, {
        params: { addressID: id },
      });
      onChangeActive(id);
    } catch (err) {
      console.error('Error selecting address:', err);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.popupWrapper} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>შეცვალე მისამართი</h2>
          <button onClick={onClose}>
            <Image src="/greenDeleteIcon.svg" alt="Close" width={30} height={30} />
          </button>
        </div>

        <div className={styles.addressesItemsWrapper}>
          {addresses.map((addr) => (
            <div key={addr.id} className={styles.addressItem}>
              <div className={styles.left}>
                <input
                  type="radio"
                  className={styles.radio}
                  checked={selectedAddressId === addr.id}
                  onChange={() => handleSelect(addr.id)}
                />
                <span>{addr.location}</span>
              </div>

              {openDropdown === addr.id && (
                <div className={styles.dropdownContent}>
                  <p>{addr.name}</p>
                  <p>{addr.location}</p>
                  <p>{addr.phoneNumber}</p>
                </div>
              )}

              <div className={styles.right} onClick={() => toggleDropdown(addr.id)}>
                <Image
                  src="/dropDownArrow.svg"
                  alt="Dropdown"
                  width={16}
                  height={16}
                  style={{
                    cursor: 'pointer',
                    transform: openDropdown === addr.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeActiveAddress;
