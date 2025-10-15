import FarmerSideBar from '@/app/components/FarmerSideBar/FarmerSideBar';
import styles from './layout.module.scss';
import Header from '@/app/components/Header/Header';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header/>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <FarmerSideBar />
        </div>
        <main className={styles.content}>{children}</main>
      </div>
        <FooterComponent/>
    </div>
  );
}
