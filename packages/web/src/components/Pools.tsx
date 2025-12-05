import { NavLink } from "react-router"

export default function Pools({ pools }: { pools: string[] }) {
	return (
		<section>
			<h3>Pools</h3>
			<hr/>
			{
				pools.map(val => {
					return (
						<article>
							<div className="pool" key={val}><NavLink to={`pools/${val}`}>{val}</NavLink></div>
						</article>
					)
				})
			}
		</section>
	)
}
