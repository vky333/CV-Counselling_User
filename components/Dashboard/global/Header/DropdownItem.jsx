import Link from 'next/link';
import styles from './Header.module.css';

const DropdownItem = (props) => {

    return (
        <div className={`d-flex ${styles.dropdown_item}`} style={{justifyContent: "space-between", alignItems: "center", whiteSpace: "nowrap"}}>
            <Link href={props.href}>
                <a onClick={props.clickHandler ? props.clickHandler : () => {}} className={styles.nav_dropdown_item}>
                    {props.title}
                </a>
            </Link>
            {props.new ? <span className={styles.new}>NEW</span> : <></>}
        </div>
    )
}

export default DropdownItem