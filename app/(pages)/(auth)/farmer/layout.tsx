import FarmerSideBar from '@/app/components/FarmerSideBar/FarmerSideBar';
import styles from './layout.module.scss';
import Header from '@/app/components/Header/Header';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header/>
      <div className={styles.contentWrapper}>
        <FarmerSideBar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
