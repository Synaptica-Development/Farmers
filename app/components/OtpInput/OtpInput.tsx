import React, { useRef, useEffect } from 'react';
import styles from './OtpInput.module.scss';

interface OtpInputProps {
    index: number;
    value: string;
    onChange: (value: string, index: number) => void;
    hasError: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

const OtpInput: React.FC<OtpInputProps> = ({ index, value, onChange, hasError, inputRef }) => {
    const localRef = useRef<HTMLInputElement>(null);
    const ref = inputRef ?? localRef;

    useEffect(() => {
        if (value && ref.current) {
            const next = ref.current.nextElementSibling as HTMLElement | null;
            next?.focus();
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/, '').slice(0, 1);
        onChange(val, index);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value) {
            const prev = e.currentTarget.previousElementSibling as HTMLElement | null;
            prev?.focus();
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`${styles.otpInput} ${hasError ? styles.error : ''}`}
            aria-label={`Digit ${index + 1}`}
        />
    );
};

export default OtpInput;
