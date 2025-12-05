import { useState, type FormEvent } from "react";
import callGas from "#lib/callGas";
import useAuth from "#hooks/useAuth";

export default function Login() {
	const { setToken, setType } = useAuth();
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setLoading(true);
		const result = await callGas("checkToken", { token: password });
		setLoading(false);
		if (result.success !== true) {
			return alert("Invalid password");
		}

		setToken(password);
		setType(result.type);
	}

	return (
		<form>
			<fieldset role="group">
				<input
					type="text"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value.toLowerCase())}
				/>
				<button aria-busy={loading} onClick={onSubmit}>Login</button>
			</fieldset>
		</form>
	)
}
