// A round profile picture. Shows the user's photo, or the first letter
// of their name on a red circle when they haven't added one.
export default function Avatar({ user, size = 34, className = '' }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) };
  return (
    <span className={`avatar ${className}`} style={style} aria-hidden="true">
      {user.avatar ? <img src={user.avatar} alt="" /> : user.name.trim()[0]?.toUpperCase()}
    </span>
  );
}
