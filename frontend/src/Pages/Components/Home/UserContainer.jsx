import "./Styles/UserContainer.css";

export default function UserContainer({ pfp, username, isSelected, onSelect }) {
    return (
        <div
            className={`userContainer ${isSelected ? 'userContainerSelected' : ''}`}
            onClick={() => onSelect()}
        >
            <img className="userImage" src={pfp} alt={username} />
            <span className="userName">{username}</span>
        </div>
    );
}