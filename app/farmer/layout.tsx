import FarmerSideBar from '../components/FarmerSideBar/FarmerSideBar';
import styles from './layout.module.scss';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <FarmerSideBar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
