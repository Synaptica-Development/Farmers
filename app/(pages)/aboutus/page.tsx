import Image from 'next/image';
import styles from './page.module.scss';
import Header from "@/app/components/Header/Header";
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';
import InfiniteScrollSection from '@/app/components/InfiniteScrollSection/InfiniteScrollSection';
const cards = [
  {
    name: '',
    image: '/projectSupporters.svg',
    description: '',
    url: 'https://www.facebook.com/',
  },
];

const cards2 = [
  {
    name: 'გიორგი თანდილაშვილი',
    image: '/testPersonImage.jpg',
    description: 'პროექტის მენეჯერი',
    url: 'https://www.facebook.com/G.Tandila',
  },
  {
    name: 'ირაკლი ახობაძე',
    image: '/testPersonImage.jpg',
    description: 'პროგრამული უზრუნველყოფა',
    url: 'https://www.instagram.com/',
  },
  {
    name: 'ნიკოლოზ ბექაური',
    image: '/testPersonImage.jpg',
    description: 'პროგრამული უზრუნველყოფა',
    url: 'https://www.youtube.com/',
  },
  {
    name: 'ირმა ნარიმანიშვილი',
    image: '/testPersonImage.jpg',
    description: 'Connect with us on a professional network.',
    url: 'https://www.facebook.com/irma.narimanishvili.77',
  },
   {
    name: 'ვალერი',
    image: '/testPersonImage.jpg',
    description: 'სოც-მედია, ფოტო-ვიდეო',
    url: 'https://www.linkedin.com/',
  },
];
export default function AboutUsPage() {
  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.wrapper}>
          <h1>ჩვენს შესახებ</h1>

          <div className={styles.contant}>
            <div className={styles.imageWrapper}>
              <Image
                src="/aboutUsHero.png"
                alt="about us image"
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 80vw, 100vw"
              />
            </div>

            <div className={styles.texts}>
              <p>
                Natsarmi.ge არის ონლაინ პლატფორმა, რომელიც საშუალებას აძლევს ქართველ მეწარმეებს, განავითარონ საკუთარი საქმიანობა, მარტივად და სწრაფად მიაწოდონ თავიანთი პროდუქცია მომხმარებლებს. ამავე დროს, მომხმარებლებს შეუძლიათ სახლიდან გაუსვლელად, ნებისმიერი რეგიონიდან, მათთვის სასურველი ნატურალური პროდუქცია მიიღონ ხელმისაწვდომ ფასად.
              </p>
              <p>
                ჩვენი მიზანია ქართული წარმოებისა და განსაკუთრებით სოფლის მეურნეობის მხარდაჭერა, როგორც თეორიულ ისე პრაქტიკულ დონეზე. Natsarmi.ge-ზე რეგისტრირებულ მეწარმეებს შეეძლებათ გაიარონ რეგულარული სწავლებები დარგის წამყვან სპეციალისტებთან, რაც ხელს შეუწყობს მათ წარმოების განვითარებას. Natsarmi.ge-ს ადმინისტრაცია მეწარმეებს დაეხმარება საკუთარი პროდუქციის წარმოების დახვეწა, რეკლამირება-გაყიდვასა და პროდუქციის მომხმარებლამდე მიწოდებაში.
              </p>
              <p>
                ამასთანავე, ჩვენი მიზანია საქართველოში მცხოვრებ ადამიანებს ჰქონდეთ ჯანსაღი პროდუქციის ადეკვატურ ფასად შეძენის შესაძლებლობა, რაც პირდაპირ პროპორციულია მათი უკეთესი ჯანმრთელობისა.
              </p>
            </div>

            <div className={styles.quote}>
              <p>„ერი რომელიც არის მომხმარებელი და არა მწარმოებელი, განწირულია მონობისთვის“</p>
              <span>თომას ჯეფერსონი</span>
            </div>
          </div>
          <InfiniteScrollSection
            title="პროექტის მხარდამჭერები"
            subtitle="(ვინაობის დასახელება არ სურთ)"
            cards={cards}
          />
          <InfiniteScrollSection
            title="საიტის ადმინისტრაცია"
            subtitle="აქ რამე ქვეტექსტი იქნება"
            cards={cards2}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
