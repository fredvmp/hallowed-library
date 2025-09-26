import styles from './BasicButton.module.css';

interface Props {
  title: string;

}

export const BasicButton = ( {title}: Props ) => {

  return (
    <div className={styles.wrapBasicButton}>
        <p>{title}</p>

    </div>  
  )

}


