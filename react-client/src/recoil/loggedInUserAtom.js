import { atom } from 'recoil'

const loggedInUserAtom = atom({
	key: 'loggedInUserAtom',
	default: null,
})

export default loggedInUserAtom

// import { useCookies } from 'react-cookie'
// import { atom } from 'recoil'

// const cookieEffect =
// 	(key) =>
// 	({ setSelf, onSet }) => {
// 		console.log(key)
// 		const [cookies, setCookie, removeCookie] = useCookies([key])

// 		const savedValue = cookies[key]

// 		console.log(savedValue)

// 		if (savedValue) {
//       console.log("R1")
// 			setSelf(savedValue)
// 		} else {
//       console.log("R2")
// 			setSelf(null)
// 		}

// 		console.log(savedValue)

// 		onSet((newValue) => {
// 			console.log(newValue)
// 			const isReset = newValue === null
// 			if (isReset) {
// 				removeCookie(key, { path: '/', domain: 'localhost' })
// 			} else {
// 				setCookie(key, newValue, {
// 					maxAge: 60 * 60 * 24 * 7, // Inloggningssessionen gäller i en vecka
// 					path: '/',
// 				})
// 			}
// 		})
// 	}

// const loggedInUserAtom = atom({
// 	key: 'loggedInUserAtom',
// 	default: null,
// 	effects: [cookieEffect('logged-in-user')],
// })

// export default loggedInUserAtom
