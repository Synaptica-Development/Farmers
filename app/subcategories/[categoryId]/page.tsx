import styles from './page.module.scss';
import Header from '../../components/Header/Header';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';
import SubCategories from '@/app/components/SubCategories/SubCategories';
import SubProductsSection from '@/app/components/SubProductsSection/SubProductsSection';

interface Props {
  params: Promise<{ categoryId: string }>; 
}

export default async function subcategories({ params }: Props) {

  const { categoryId } = await params;

  return (
    <div className={styles.container}>
      <Header />
      <SubCategories categoryID={categoryId}/>
      <SubProductsSection categoryID={categoryId}/>
      <div style={{marginTop: '72px'}}><FooterComponent/></div>
    </div>
  );
}
