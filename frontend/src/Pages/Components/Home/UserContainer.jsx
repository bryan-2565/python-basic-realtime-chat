import "./Styles/UserContainer.css";

// ====================== COMPONENTS ====================== //
// ******************** USER CONTAINER ******************** //
export function UserContainer({ pfp, username, isSelected, onSelect }) {
    return (
        <div className={`userContainer ${isSelected && "selected"}`} onClick={() => onSelect()}>
            {/* · User Avatar · */}
            <img src={pfp} alt="User profile"/>
            
            {/* · Username · */}
            <label>{username}</label>
        </div>
    );
}

// ******************** USER CONTAINER PLACEHOLDER ******************** //
export function UserContainerPlaceholder() {
    return (
        <div className={`userContainerPlaceholder`}>
            {/* › Skeleton Avatar ‹ */}
            <div className="userImagePlaceholder skeleton" />
            
            {/* › Skeleton Username ‹ */}
            <span className="userNamePlaceholder skeleton" />
        </div>
    );
}