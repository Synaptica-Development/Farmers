import styles from './Categories.module.scss';
import CategoriesItem from './CategoriesItem/CategoriesItem';

const categoriesData = [
  { title: 'ხილი', image: 'fruit', alt: 'fruit', href: '/subcategories/1' },
  { title: 'ბოსტნეული', image: 'vegetable', alt: 'vegetable', href: '/' },
  { title: 'რძის პროდუქტი', image: 'test', alt: 'dairy', href: '/' },
  { title: 'სურსათი', image: 'test', alt: 'groceries', href: '/' },
  { title: 'წვენები', image: 'test', alt: 'juice', href: '/' },
  { title: 'წიწაკა', image: 'test', alt: 'pepper', href: '/' },
  { title: 'კონცენტრატი', image: 'test', alt: 'concentrate', href: '/' },
  { title: 'ზეთი', image: 'test', alt: 'oil', href: '/' },
  { title: 'ჩაი', image: 'test', alt: 'tea', href: '/' },
  { title: 'ყავა', image: 'test', alt: 'coffee', href: '/' },
  { title: 'ნუგბარი', image: 'test', alt: 'snacks', href: '/' },
  { title: 'სასმელები', image: 'test', alt: 'drinks', href: '/' },
];

const Categories = () => {
  return (
    <div className={styles.wrapper}>
      {categoriesData.map((item, index) => (
        <CategoriesItem
          key={index}
          title={item.title}
          image={item.image}
          alt={item.alt}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default Categories;
