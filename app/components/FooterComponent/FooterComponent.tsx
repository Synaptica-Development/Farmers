import styles from './FooterComponent.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const FooterComponent = () => {

    return (
        <div className={styles.background}>
            <div className={styles.footerWrapper}>
                <div className={styles.footerContent}>
                    <div className={styles.footerInfo}>
                        <Image src="/mainLogo.svg" alt="Ecobazar Logo" width={183} height={38} />
                        <p className={styles.footerText}>
                            Natsarmi.ge საშუალებას აძლევს ქართველ მეწარმეებს, განავითარონ საკუთარი საქმიანობა, მარტივად და სწრაფად მიაწოდონ თავიანთი პროდუქცია მომხმარებლებს. ამავე დროს, მომხმარებლებს შეუძლიათ სახლიდან გაუსვლელად, ნებისმიერი რეგიონიდან, ნატურალური პროდუქცია მიიღონ ხელმისაწვდომ ფასად.                        </p>

                        <div className={styles.footerContact}>
                            <p>(+995) 598 36 43 07</p>
                            <span>ან</span>
                            <p>natsarmige@gmail.com</p>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <h3 className={styles.footerLinksTitle}>გვერდები</h3>

                        <nav className={styles.footerNav}>
                            <Link href="/allproducts">პროდუქტები</Link>
                            <Link href="/faq">კითხვები</Link>
                            <Link href="/agroschool">აგრო სკოლა</Link>
                            <Link href="/aboutus">ჩვენს შესახებ</Link>
                            <Link href="/contact">კონტაქტი</Link>
                        </nav>

                        <div className={styles.footerSocials}>
                            <Image src="/twitter.svg" alt="Twitter" width={40} height={40} />
                            <Image src="/facebook.svg" alt="Facebook" width={40} height={40} />
                            <Image src="/instagram.svg" alt="Instagram" width={40} height={40} />
                        </div>
                    </div>
                </div>

                <div className={styles.footerCopyright}>
                    <p>Ecobazar eCommerce © 2025. All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
};

export default FooterComponent;
