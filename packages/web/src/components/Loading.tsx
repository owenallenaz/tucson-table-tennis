export default function Loading({ loading }: { loading: boolean }) {
	return <div className="loading" aria-busy={loading}/>
}
