'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import api from '@/lib/axios';
import ReusableButton from '@/app/components/ReusableButton/ReusableButton';
import Image from 'next/image';

interface License {
  subCategory: string;
  category: string;
  subSubCategory: string;
  minimumPrice: string;
  minimumQuantity: string;
  status: number;
}

const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: 'უარყოფითი', className: styles.negative },
  1: { text: 'მოლოდინში', className: styles.waiting },
  2: { text: 'დადებითი', className: styles.positive },
  3: { text: 'უარყოფითი', className: styles.negative },
};

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    api
      .get(`/api/Farmer/licenses?page=${currentPage}&pageSize=5`)
      .then((res) => {
        setLicenses(res.data.licenses || []);
        setMaxPage(res.data.maxPageCount || 1);
      })
      .catch((err) => {
        console.error('Error fetching licenses:', err);
      });
  }, [currentPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push('...');
      }
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(maxPage, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < maxPage - delta) {
      if (currentPage < maxPage - delta - 1) {
        pages.push('...');
      }
      pages.push(maxPage);
    }

    return pages;
  };

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <h1>ლიცენზიები</h1>
          <ReusableButton
            title="ლიცენზიის მოთხოვნა"
            size="normal"
            link="/farmer/licenses/addlicense"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.contentHeader}>
              <p>კატეგორია</p>
              <p>ქვეკატეგორია</p>
              <p>ჯიში/სახეობა</p>
              <p>მინ.ფასი</p>
              <p>მინ.რაოდენობა</p>
              <p>სტატუსი</p>
            </div>

            <div className={styles.contentItem}>
              {licenses && licenses.length > 0 ? (
                licenses.map((license, index) => {
                  const status = statusMap[license.status] || {
                    text: 'უცნობი',
                    className: '',
                  };

                  return (
                    <div key={index} className={styles.licenseEntry}>
                      <p>{license.category}</p>
                      <p>{license.subCategory}</p>
                      <p>{license.subSubCategory}</p>
                      <p>{license.minimumPrice}</p>
                      <p>{license.minimumQuantity}</p>
                      <p className={status.className}>{status.text}</p>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noData}>ლიცენზიები ვერ მოიძებნა</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.paginationWrapper}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <Image
              src={currentPage === 1 ? '/arrowLeftDisabled.svg' : '/arrowLeftActive.svg'}
              alt="Previous"
              width={36}
              height={36}
            />
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className={styles.ellipsis}>
                  {page}
                </span>
              )
            )}
          </div>

          <button onClick={handleNext} disabled={currentPage === maxPage}>
            <Image
              src={currentPage === maxPage ? '/arrowRightDisabled.svg' : '/arrowRightActive.svg'}
              alt="Next"
              width={36}
              height={36}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
