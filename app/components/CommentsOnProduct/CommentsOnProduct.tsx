'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './CommentsOnProduct.module.scss';
import api from '@/lib/axios';

interface Comment {
  id: string;
  usernName: string;
  comment: string;
  subComment: string;
}

interface Props {
  id: string;
}

const PAGE_SIZE = 6;

const CommentsOnProduct = ({ id }: Props) => {
  const [pagesData, setPagesData] = useState<Map<number, Comment[]>>(new Map());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPageCount, setMaxPageCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setPagesData(new Map());
    setCurrentPage(1);
    setMaxPageCount(1);
    setInitialLoad(true);
  }, [id]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, id]);

  const fetchPage = useCallback(
    async (pageToLoad: number) => {
      if (!id) return;
      if (pagesData.has(pageToLoad)) {
        setInitialLoad(false);
        return;
      }
      if (pageToLoad < 1) return;

      setLoading(true);
      try {
        const res = await api.get(
          `https://api.staging.natsarmi.ge/product-comments?productID=${id}&page=${pageToLoad}&pageSize=${PAGE_SIZE}`
        );

        const newComments: Comment[] = res.data.comments || [];
        const newMax = res.data.maxPageCount || 1;

        setPagesData(prev => {
          const m = new Map(prev);
          m.set(pageToLoad, newComments);
          return m;
        });

        setMaxPageCount(newMax);
      } catch (err) {
        console.error(`Error fetching comments page ${pageToLoad}:`, err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    },
    [id, pagesData]
  );

  const currentComments = pagesData.get(currentPage) || [];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push('...');
      }
    }

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(maxPageCount, currentPage + delta); i++) {
      pages.push(i);
    }

    if (currentPage < maxPageCount - delta) {
      if (currentPage < maxPageCount - delta - 1) {
        pages.push('...');
      }
      pages.push(maxPageCount);
    }

    return pages;
  };

  const handlePrev = () => {
    setCurrentPage(p => (p > 1 ? p - 1 : p));
  };

  const handleNext = () => {
    setCurrentPage(p => (p < maxPageCount ? p + 1 : p));
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.commentsWrapper}
      >
        {loading && initialLoad && (
          <div className={styles.loadingBottom}>
            <span>Loading comments...</span>
          </div>
        )}

        {!loading && currentComments.length === 0 && !initialLoad && (
          <div className={styles.noComments}>
            <p>პროდუქციაზე კომენტარი არ არის!</p>
          </div>
        )}

        <div className={styles.commentsGrid}>
          {currentComments.map((comment, index) => (
            <div key={`${comment.id}-${index}`} className={styles.commentItem}>
              <div className={styles.userComentar}>
                <h3>{comment.usernName}</h3>
                <p>{comment.comment}</p>
              </div>
              {comment.subComment && (
                <div className={styles.subComment}>
                  <p>{comment.subComment}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {loading && !initialLoad && (
          <div className={styles.loadingBottom}>
            <span>Loading page {currentPage}...</span>
          </div>
        )}
      </div>

      <div className={styles.paginationWrapper}>
        <button onClick={handlePrev} disabled={currentPage === 1} aria-label="Previous page">
          <Image
            src={currentPage === 1 ? '/arrowLeftDisabled.svg' : '/arrowLeftActive.svg'}
            alt="Prev"
            width={36}
            height={36}
          />
        </button>

        <div className={styles.pageNumbers}>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'number' ? (
              <button
                key={idx}
                className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className={styles.ellipsis}>
                {page}
              </span>
            )
          )}
        </div>

        <button onClick={handleNext} disabled={currentPage === maxPageCount} aria-label="Next page">
          <Image
            src={currentPage === maxPageCount ? '/arrowRightDisabled.svg' : '/arrowRightActive.svg'}
            alt="Next"
            width={36}
            height={36}
          />
        </button>
      </div>

      <div className={styles.pageIndicator}>
        <small>
          გვერდი {currentPage} / {maxPageCount}
        </small>
      </div>
    </div>
  );
};

export default CommentsOnProduct;
