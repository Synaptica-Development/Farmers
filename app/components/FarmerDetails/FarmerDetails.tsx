import Image from "next/image";
import styles from './FarmerDetails.module.scss'
import BASE_URL from "@/app/config/api";
interface FarmerDetailsProps {
    name: string;
    lastName: string;
    location: string;
    licenseIcons: string[];
}

const FarmerDetails = (props: FarmerDetailsProps) => {
    return (
        <div className={styles.infoWrapper}>
            <Image
                src={'/farmerProfileImageTest.png'}
                alt="profile"
                width={100}
                height={100}
            />

            <div className={styles.content}>
                <div>
                    <p className={styles.label}>სახელი:</p>
                    <p>{props.name}</p>
                </div>
                <div>
                    <p className={styles.label}>გვარი:</p>
                    <p>{props.lastName}</p>
                </div>
                <div>
                    <p className={styles.label}>მისამართი:</p>
                    <p>{props.location}</p>
                </div>
            </div>

            <div className={styles.licensesWrapper}>
                <p>ლიცენზიები</p>
                <div className={styles.licensesContainer}>
                    {props.licenseIcons && props.licenseIcons.length > 0 ? (
                        props.licenseIcons.map((icon, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL}/${icon}`}
                                alt={`license-${index}`}
                                width={40}
                                height={40}
                            />
                        ))
                    ) : (
                        <p className={styles.noLicense}>ლიცენზია არ გაქვთ</p>
                    )}
                </div>
            </div>

        </div>
    )
}

export default FarmerDetails;