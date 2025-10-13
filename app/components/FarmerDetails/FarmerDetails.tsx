import styles from './FarmerDetails.module.scss'
import BASE_URL from "@/app/config/api";
interface FarmerDetailsProps {
    name: string;
    lastName: string;
    location: string;
    licenseIcons: string[];
    income: string;
}

const FarmerDetails = (props: FarmerDetailsProps) => {
    return (
        <div className={styles.infoWrapper}>
            <div className={styles.content}>
                <div>
                    <p className={styles.label}>სახელი:</p>
                    <p>{props.name} {props.lastName}</p>
                </div>
                <div>
                    <p className={styles.label}>მისამართი:</p>
                    <p>{props.location}</p>
                </div>
                 <div>
                    <p className={styles.label}>შემოსავალი:</p>
                    <p>{props.income > '0' ? `${props.income}+ ₾` : `${props.income} ₾`}</p>
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