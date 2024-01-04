import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

import {FaSpinner} from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode,
}

export function Button({loading, children, ...rest}: ButtonProps){
    return(
        <button 
            className={styles.button}
            disabled={loading}
            {...rest}
            >
                {loading ? (
                    <FaSpinner color="#000" size={16} />
                ) : (
                    <div className={styles.buttonText}>
                        <p>{children}</p>
                        <FiPlus size={30}/>
                    </div>
                    
                )}
        </button>
    )
}