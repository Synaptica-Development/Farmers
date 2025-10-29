import Image from 'next/image';
import styles from './page.module.scss';
import Header from "@/app/components/Header/Header";
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';
import InfiniteScrollSection from '@/app/components/InfiniteScrollSection/InfiniteScrollSection';
const cards = [
  {
    name: 'Facebook',
    image: '/testPersonImage.jpg',
    description: 'Follow us on Facebook for updates and news.',
    url: 'https://www.facebook.com/',
  },
  {
    name: 'Instagram',
    image: '/testPersonImage.jpg',
    description: 'Check our latest posts and stories.',
    url: 'https://www.instagram.com/',
  },
  {
    name: 'YouTube',
    image: '/testPersonImage.jpg',
    description: 'Watch our educational videos and interviews.',
    url: 'https://www.youtube.com/',
  },
  {
    name: 'LinkedIn',
    image: '/testPersonImage.jpg',
    description: 'Connect with us on a professional network.',
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
                src="/aboutUs.png"
                alt="about us image"
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 80vw, 100vw"
              />
            </div>

            <div className={styles.texts}>
              <p>
                Natsarmi.ge არის ონლაინ პლატფორმა, რომელიც საშუალებას აძლევს ქართველ მეწარმეებს, განავითარონ საკუთარი საქმიანობა და მარტივად და სწრაფად მიაწოდონ თავიანთი პროდუქცია მომხმარებლებს. ამავე დროს, მომხმარებლებს შეუძლიათ სახლიდან გაუსვლელად, ნებისმიერი რეგიონიდან, მათთვის სასურველი ნატურალური პროდუქცია მიიღონ ხელმისაწვდომ ფასად.
              </p>
              <p>
                ჩვენი მიზანია ქართული წარმოებისა და განსაკუთრებით სოფლის მეურნეობის მხარდაჭერა, როგორც თეორიულ ისე პრაქტიკულ დონეზე. Natsarmi.ge-ზე რეგისტრირებულ მეწარმეებს შეეძლებათ გაიარონ რეგულარული სწავლებები დარგის წამყვან სპეციალისტებთან, რაც ხელს შეუწყობს მათ წარმოების განვითარებას. Natsarmi.ge-ს ადმინისტრაცია მეწარმეებს დაეხმარება საკუთარი პროდუქციის წარმოების დახვეწა, რეკლამირება-გაყიდვასა და პროდუქციის მომხმარებლამდე მიწოდებაში.
              </p>
              <p>
                ამასთანავე, ჩვენი მიზანია საქართველოში მცხოვრებ ადამიანებს ჰქონდეთ ჯანსაღი პროდუქციის ადექვატურ ფასად შეძენის შესაძლებლობა, რაც პირდაპირ პროპორციულია მათი უკეთესი ჯანმრთელობისა.
              </p>
            </div>

            <div className={styles.quote}>
              <p>„ერი რომელიც არის მომხმარებელი და არა მწარმოებელი, განწირულია მონობისთვის“</p>
              <span>თომას ჯეფერსონი</span>
            </div>
          </div>
          <InfiniteScrollSection
            title="პროექტის მხარდამჭერი ჯიგარი ხალხი"
            subtitle="აქ რამე ქვეტექსტი იქნება"
            cards={cards}
          />
          <InfiniteScrollSection
            title="პროექტის მხარდამჭერი ჯიგარი ხალხი"
            subtitle="აქ რამე ქვეტექსტი იქნება"
            cards={cards}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
