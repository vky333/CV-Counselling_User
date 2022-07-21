import styles from './ActionButtonIcon.module.css';

const ActionButtonIcon = (props) => {

  return (
    <div style={{backgroundColor: props.button.backgroundColor}} key={props.button.id} onClick={props.button.action} className={`${styles.action_button_icon} ${props.hideMobile ? 'hideMobile' : ''}`}>
        {props.button.icon}
    </div>
  )
}

export default ActionButtonIcon;