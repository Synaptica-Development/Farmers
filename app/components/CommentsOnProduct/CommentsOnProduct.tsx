'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './CommentsOnProduct.module.scss';
import api from '@/lib/axios';

interface Comment {
    id: string;
    usernName: string;
    comment: string;
    subComment: string;
}

interface PageData {
    page: number;
    comments: Comment[];
}

interface Props {
    id: string;
}

const CommentsOnProduct = ({ id }: Props) => {
    const [pagesData, setPagesData] = useState<Map<number, Comment[]>>(new Map());
    const [currentMinPage, setCurrentMinPage] = useState(1);
    const [currentMaxPage, setCurrentMaxPage] = useState(1);
    const [maxPageCount, setMaxPageCount] = useState(1);
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef<number>(0);
    const isLoadingRef = useRef(false);

    const MAX_PAGES_IN_MEMORY = 3;

    useEffect(() => {
        fetchInitialComments();
    }, [id]);

    const fetchInitialComments = async () => {
        if (!initialLoad) return;
        
        setLoadingBottom(true);
        try {
            const res = await api.get(
                `https://api.staging.natsarmi.ge/product-comments?productID=${id}&page=1&pageSize=6`
            );
            
            const newComments = res.data.comments || [];
            const newPagesData = new Map<number, Comment[]>();
            newPagesData.set(1, newComments);
            
            setPagesData(newPagesData);
            setMaxPageCount(res.data.maxPageCount || 1);
            setCurrentMinPage(1);
            setCurrentMaxPage(1);
            setInitialLoad(false);
        } catch (err) {
            console.error('Error fetching initial comments:', err);
        } finally {
            setLoadingBottom(false);
        }
    };

    const cleanupPages = (newPagesData: Map<number, Comment[]>, direction: 'up' | 'down', newPage: number) => {
        const sortedPages = Array.from(newPagesData.keys()).sort((a, b) => a - b);
        
        if (sortedPages.length > MAX_PAGES_IN_MEMORY) {
            if (direction === 'up') {
                const pagesToKeep = sortedPages.slice(0, MAX_PAGES_IN_MEMORY);
                const pagesToRemove = sortedPages.slice(MAX_PAGES_IN_MEMORY);
                
                pagesToRemove.forEach(page => {
                    newPagesData.delete(page);
                });
                
                setCurrentMaxPage(Math.max(...pagesToKeep));
            } else {
                const pagesToKeep = sortedPages.slice(-MAX_PAGES_IN_MEMORY);
                const pagesToRemove = sortedPages.slice(0, sortedPages.length - MAX_PAGES_IN_MEMORY);
                
                pagesToRemove.forEach(page => {
                    newPagesData.delete(page);
                });
                
                setCurrentMinPage(Math.min(...pagesToKeep));
            }
        }
        
        return newPagesData;
    };

    const fetchComments = useCallback(async (pageToLoad: number, direction: 'up' | 'down') => {
        if (pagesData.has(pageToLoad) || isLoadingRef.current) {
            return;
        }
        if (pageToLoad < 1 || pageToLoad > maxPageCount) {
            return;
        }

        isLoadingRef.current = true;
        
        if (direction === 'up') {
            setLoadingTop(true);
        } else {
            setLoadingBottom(true);
        }

        try {
            const res = await api.get(
                `https://api.staging.natsarmi.ge/product-comments?productID=${id}&page=${pageToLoad}&pageSize=6`
            );
            
            const newComments = res.data.comments || [];
            
            if (newComments.length > 0) {
                setPagesData(prevPages => {
                    const newPagesData = new Map(prevPages);
                    newPagesData.set(pageToLoad, newComments);
                    
                    const cleanedPages = cleanupPages(newPagesData, direction, pageToLoad);
                    
                    if (direction === 'up') {
                        setCurrentMinPage(pageToLoad);
                        
                        requestAnimationFrame(() => {
                            if (wrapperRef.current) {
                                const scrollHeightBefore = wrapperRef.current.scrollHeight;
                                setTimeout(() => {
                                    if (wrapperRef.current) {
                                        const scrollHeightAfter = wrapperRef.current.scrollHeight;
                                        const heightDifference = scrollHeightAfter - scrollHeightBefore;
                                        wrapperRef.current.scrollTop = scrollPositionRef.current + heightDifference;
                                    }
                                }, 0);
                            }
                        });
                    } else {
                        setCurrentMaxPage(pageToLoad);
                    }
                    
                    return cleanedPages;
                });
            }
        } catch (err) {
            console.error(`Error fetching comments for page ${pageToLoad}:`, err);
        } finally {
            if (direction === 'up') {
                setLoadingTop(false);
            } else {
                setLoadingBottom(false);
            }
            isLoadingRef.current = false;
        }
    }, [id, pagesData, maxPageCount]);

    const handleScroll = useCallback(() => {
        if (!wrapperRef.current || isLoadingRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;
        scrollPositionRef.current = scrollTop;
        
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (currentMaxPage < maxPageCount && !loadingBottom) {
                fetchComments(currentMaxPage + 1, 'down');
            }
        }
        
        if (scrollTop <= 10) {
            if (currentMinPage > 1 && !loadingTop) {
                fetchComments(currentMinPage - 1, 'up');
            }
        }
    }, [currentMaxPage, currentMinPage, maxPageCount, loadingTop, loadingBottom, fetchComments]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        let timeoutId: NodeJS.Timeout;
        const debouncedHandleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 100);
        };

        wrapper.addEventListener('scroll', debouncedHandleScroll);
        return () => {
            wrapper.removeEventListener('scroll', debouncedHandleScroll);
            clearTimeout(timeoutId);
        };
    }, [handleScroll]);

    const getAllComments = (): Comment[] => {
        const sortedPages = Array.from(pagesData.keys()).sort((a, b) => a - b);
        const allComments: Comment[] = [];
        
        sortedPages.forEach(pageNum => {
            const pageComments = pagesData.get(pageNum);
            if (pageComments) {
                allComments.push(...pageComments);
            }
        });
        
        return allComments;
    };

    const comments = getAllComments();

    return (
        <div className={styles.container}>
            <div
                className={styles.commentsWrapper}
                ref={wrapperRef}
                style={{ 
                    height: '400px', 
                    overflowY: 'auto',
                    position: 'relative'
                }}
            >
                {loadingTop && (
                    <div className={styles.loadingTop}>
                        <span>Loading previous comments...</span>
                    </div>
                )}
                
                {comments.length === 0 && !loadingBottom && !initialLoad && (
                    <div className={styles.noComments}>
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                )}
                
                <div className={styles.commentsGrid}>
                    {comments.map((comment, index) => (
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
                
                {loadingBottom && (
                    <div className={styles.loadingBottom}>
                        <span>Loading more comments...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsOnProduct;
