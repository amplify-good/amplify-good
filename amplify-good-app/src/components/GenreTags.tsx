export default function GenreTags({
  genres,
  className = "",
}: {
  genres: string[];
  className?: string;
}) {
  return (
    <div className={`flex items-center flex-wrap gap-1 ${className}`}>
      {genres.map((genre, i) => (
        <span key={genre} className="flex items-center gap-1">
          <span className="genre-pill">{genre}</span>
          {i < genres.length - 1 && (
            <span className="text-gold font-bold text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
