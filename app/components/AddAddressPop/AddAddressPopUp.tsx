import { useForm } from 'react-hook-form';
import styles from './AddAddressPopUp.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';

type FormValues = {
    location: string;
};

const MIN_CHARS = 8;

interface Props {
    onClose: () => void;
}

const AddAddressPop = ({ onClose }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const onSubmit = (data: FormValues) => {
        console.log('valid data:', data.location);

        api.put(`/api/Cart/add-new-address?address=${data.location}`)
            .then(()=>{
                onClose();
            })
            .catch((e)=> {
                console.log(e)
            })
    };

    return (
        <form className={styles.addAddressWrapper} onClick={onClose} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>დაამატე ახალი მისმართი</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        <Image src="/greenDeleteIcon.svg" alt="Close" width={30} height={30} />
                    </button>
                </div>
                <div className={styles.inputWrapper}>
                    <label htmlFor="location" className={styles.label}>
                        ახალი ლოკაცია
                    </label>
                    <input
                        id="location"
                        type="text"
                        placeholder="უბანი, ქუჩა, კორპუსის ნომერი"
                        {...register('location', {
                            required: 'შეიყვანეთ ლოკაცია.',
                            validate: (val: string) => {
                                const trimmed = val.trim();
                                return (
                                    trimmed.length >= MIN_CHARS ||
                                    `ლოკაცია უნდა ჰქონდეს მინიმუმ ${MIN_CHARS} სიმბოლო.`
                                );
                            },
                        })}
                    />
                    {errors.location && (
                        <p className={styles.error}>{errors.location.message}</p>
                    )}
                </div>
                <button className={styles.submitButton} type="submit">
                    დამატება
                </button>
            </div>
        </form>
    );
};

export default AddAddressPop;
