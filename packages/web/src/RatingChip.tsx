export default function RatingChip({ rating, delta }: { rating: number, delta?: string }) {
	return (
		<span className="ratingChip">({rating}{delta !== undefined ? <span>{delta}</span> : ""})</span>
	)
}
