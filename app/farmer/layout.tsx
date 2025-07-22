import FarmerSideBar from '../components/FarmerSideBar/FarmerSideBar';
import Header from '../components/Header/Header';
import styles from './layout.module.scss';

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
