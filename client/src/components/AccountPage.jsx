import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/userContext';
import { useThemeContext } from '../contexts/themeContext';
import AccountPageMenuItem from './AccountPageMenuItem';
import { useLoadingContext } from '../contexts/loadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { usePopUpContext } from '../contexts/popUpContext';

function AccountPage() {
	const { user, setUser } = useUserContext()
	const { theme } = useThemeContext()
	const { loading, setLoading, setMsg, setErrorMsg } = useLoadingContext()
	const { setLoginPopUp } = usePopUpContext()

	const navigate = useNavigate()

	const [username, setUsername] = useState('')
	const [fullName, setFullName] = useState('')
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [image1, setImage1] = useState(null);
	const [imagePreview1, setImagePreview1] = useState(null)
	const [image2, setImage2] = useState(null);
	const [imagePreview2, setImagePreview2] = useState(null)

	const [deleteButton, setDeleteButton] = useState(false)
	const [password, setPassword] = useState('')

	const handleImageChange1 = (event) => {
		const file = event.target.files[0];

		if (file) {
			setImage1(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview1(reader.result); // Set the image preview
			};
			reader.readAsDataURL(file); // Read the file as a data URL
		}
	};

	const handleImageChange2 = (event) => {
		const file = event.target.files[0];

		if (file) {
			setImage2(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview2(reader.result); // Set the image preview
			};
			reader.readAsDataURL(file); // Read the file as a data URL
		}
	};

	const getCurrentUser = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/current-user`
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json', // Set the content type to JSON
			},
			credentials: 'include'
		}

		fetch(url, options)
			.then((res) => res.json())
			.then((res) => {
				if (res?.data)
					setUser(res.data)
			})
			.catch((err) => console.log('1', err))
	}

	const handleImageUpdate = async () => {
		if (image1) {
			const url = `${import.meta.env.VITE_BACKEND_URL}/users/cover-image`
			const formData = new FormData()
			formData.append('coverImage', image1)

			const options = {
				method: 'PATCH',
				body: formData,
				credentials: 'include'
			}

			fetch(url, options)
				.then((res) => res.json())
				.then((res) => {
					if (res.statusCode === 200) {
						getCurrentUser()
						setImage1(null)
						// setImagePreview1(null)
						setMsg(res.message)
						setTimeout(() => {
							setMsg('')
						}, 2000);
					}
				})
				.catch((err) => console.log(err))
		}

		if (image2) {
			const url = `${import.meta.env.VITE_BACKEND_URL}/users/avatar`
			const formData = new FormData()
			formData.append('avatar', image2)

			const options = {
				method: 'PATCH',
				body: formData,
				credentials: 'include'
			}

			fetch(url, options)
				.then((res) => res.json())
				.then((res) => {
					if (res.statusCode === 200) {
						getCurrentUser()
						setImage2(null)
						// setImagePreview2(null)
						setMsg(res.message)
						setTimeout(() => {
							setMsg('')
						}, 2000);
					}
					else {
						setErrorMsg(res.message)
						setTimeout(() => {
							setErrorMsg('')
						}, 2000);
					}
				})
				.catch((err) => console.log(err))
		}
	}

	const handleNameUpdate = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/update-account`
		const data = {}
		if (fullName !== user?.fullName) {
			data.fullName = fullName
		}
		if (username !== user?.username) {
			data.username = username
		}

		const options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			credentials: 'include'

		}

		fetch(url, options)
			.then((res) => res.json())
			.then((res) => {
				if (res.statusCode === 200) {
					getCurrentUser()
					setMsg(res.message)
					setTimeout(() => {
						setMsg('')
					}, 2000);
				}
				else {
					setErrorMsg(res.message)
					setTimeout(() => {
						setErrorMsg('')
					}, 2000);
				}
			})
			.catch((err) => console.log(err))
	}

	const handlePasswordUpdate = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/change-password`
		const data = {
			oldPassword,
			newPassword
		}
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			credentials: 'include'
		}

		fetch(url, options)
			.then((res) => res.json())
			.then((res) => {
				if (res.statusCode === 200) {
					getCurrentUser()
					setOldPassword('')
					setNewPassword('')
					setMsg(res.message)
					setTimeout(() => {
						setMsg('')
					}, 2000);
				}
				else {
					setErrorMsg(res.message)
					setTimeout(() => {
						setErrorMsg('')
					}, 2000);
				}
			})
			.catch((err) => console.log(err))
	}

	const handleVerifyPassword = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/verify-password`
		const data = {
			password
		}
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			credentials: 'include'
		}

		fetch(url, options)
			.then((res) => res.json())
			.then((res) => {
				if (res.statusCode === 200) {
					setDeleteButton(true)
				}
				else {
					setErrorMsg(res.message)
					setTimeout(() => {
						setErrorMsg('')
					}, 2000);
				}
			})
			.catch((err) => console.log(err))
	}

	const handleDeleteAccount = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/delete-account`
		const options = {
			method: 'DELETE',
			credentials: 'include'
		}

		fetch(url, options)
		.then((res) => res.json())
		.then((res) => {
			if (res.statusCode === 200) {
				setUser(null)
				navigate('/')
			}
			else {
				setErrorMsg(res.message)
				setTimeout(() => {
					setErrorMsg('')
				}, 2000);
			}
		})
		.catch((err) => console.log(err))
	}


	useEffect(() => {
		if(!loading) {
			if (user?._id) {
				setLoginPopUp(false)
				setUsername(user.username)
				setFullName(user.fullName)
			}
			else {
				setLoginPopUp(true)
			}
		}

	}, [user])


	if (!user?._id || loading) {
		return (
			<div>

			</div>
		)
	}

	return (
		<div className='flex flex-col items-center  mb-20 w-full sm:w-5/6 sm:p-2'>
			<div className='w-full flex flex-col justify-center items-center'>
				<div className='relative w-full'>
					<label htmlFor='coverImage-input' className='absolute w-full h-full hidden lg:flex justify-center items-center cursor-pointer sm:rounded-lg transition-opacity duration-100 bg-black opacity-0 bg-opacity-0 hover:opacity-100 hover:bg-opacity-30'>
						<span className='flex items-center gap-1 text-white bg-neutral-600 px-2 py-0.5 rounded-lg'>
							<FontAwesomeIcon icon={faPenToSquare} />
							<span>Choose File</span>
						</span>
					</label>
					<label htmlFor='coverImage-input' className='absolute bottom-1 right-1 lg:hidden flex justify-center items-center cursor-pointer sm:rounded-lg'>
						<span className='flex items-center gap-1 text-white bg-black bg-opacity-50 p-1.5 rounded-md'>
							<FontAwesomeIcon icon={faPenToSquare} />
							{/* <span>Choose File</span> */}
						</span>
					</label>
					<input onChange={handleImageChange1} id='coverImage-input' className='hidden' type="file" accept='image/*' />
					{/* <img className='object-cover h-60 w-full rounded-xl' src={user?.coverImage} alt="" /> */}
					{
						imagePreview1 && (
							<img className='object-cover h-40 sm:h-60 lg:h-80 w-full sm:rounded-xl' src={imagePreview1} alt="" />
						)
					}

					{
						!imagePreview1 && user?.coverImage && (
							<img className='object-cover h-40 sm:h-60 lg:h-80 w-full sm:rounded-xl' src={user?.coverImage} alt="" />
						)
					}
				</div>
				<div className='relative flex flex-col justify-center rounded-full -translate-y-1/2'>
					<label htmlFor='avatarImage-input' className='absolute w-full h-full hidden lg:flex justify-center items-center cursor-pointer rounded-full transition-opacity duration-100 bg-black opacity-0 bg-opacity-0 hover:opacity-100 hover:bg-opacity-30'>
						<span className='flex items-center gap-1 text-sm text-white bg-neutral-600 px-2 py-0.5 rounded-lg'>
							<FontAwesomeIcon icon={faPenToSquare} />
							<span>Choose File</span>
						</span>
					</label>
					<label htmlFor='avatarImage-input' className='absolute bottom-0 right-0 lg:hidden flex cursor-pointer sm:rounded-lg '>
						<span className='flex items-center gap-1 text-xs p-1 rounded-lg'>
							<FontAwesomeIcon icon={faPenToSquare} />
							{/* <span>Choose File</span> */}
						</span>
					</label>
					<input onChange={handleImageChange2} id='avatarImage-input' className='hidden' type="file" accept='image/*' />
					{/* <img className='object-cover h-60 w-full rounded-xl' src={user?.coverImage} alt="" /> */}
					{
						imagePreview2 && (
							<img className='w-28 lg:w-40 aspect-square object-cover rounded-full border-2 border-purple-600' src={imagePreview2} alt="" />
						)
					}

					{
						!imagePreview2 && user?.coverImage && (
							<img className='w-28 lg:w-40 aspect-square object-cover rounded-full border-2 border-purple-600' src={user?.avatar} alt="" />
						)
					}

					{/* <img className='w-28 lg:w-40 aspect-square object-cover rounded-full border-2 border-purple-600' src={user?.avatar} alt="" /> */}
					<div className='absolute top-full left-1/2 -translate-x-1/2 text-center text-3xl'>{user?.username}</div>
				</div>
			</div>

			<div className=''>
				{
					(image1 || image2) && (
						<button className={`text-xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3 mb-5 -translate-y-5`} onClick={handleImageUpdate}>
							Update
						</button>
					)
				}
			</div>

			<div className='w-full lg:w-3/4 xl:w-2/3 flex flex-col gap-2 px-5 sm:px-0'>
				<AccountPageMenuItem title={'Change Full Name'} showButton={user?.fullName !== fullName} >
					<div className='my-5 flex flex-col gap-5'>
						<div className='flex flex-col gap-1'>
							<label className='text-sm md:text-base' htmlFor="">Enter Full Name</label>
							<input
								type="text"
								className={`w-full p-2 rounded-lg text-lg md:text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
								placeholder='Full Name'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
						<div className='flex justify-center'>
							<button className={`text-xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3 ${user?.fullName === fullName ? 'hidden' : ''}`} onClick={handleNameUpdate}>
								Update
							</button>
						</div>
					</div>
				</AccountPageMenuItem>

				<AccountPageMenuItem title={'Change Username'} showButton={user?.username !== username} >
					<div className='my-5 flex flex-col gap-5'>
						<div className='flex flex-col gap-1'>
							<label className='text-sm md:text-base' htmlFor="">Enter Username</label>
							<input
								type="text"
								className={`w-full p-2 rounded-lg text-lg md:text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
								placeholder='Username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className='flex justify-center'>
							<button className={`text-xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3 ${user?.username === username ? 'hidden' : ''}`} onClick={handleNameUpdate}>
								Update
							</button>
						</div>
					</div>
				</AccountPageMenuItem>


				<AccountPageMenuItem title={'Change Password'} showButton={oldPassword && newPassword}>
					<div className='my-5 flex flex-col gap-5'>
						<div className='flex flex-col gap-1'>
							<label className='text-sm md:text-base' htmlFor="">Enter Old Password</label>
							<input
								type="text"
								className={`w-full p-2 rounded-lg text-lg md:text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
								placeholder='Old Password'
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label className='text-sm md:text-base' htmlFor="">Enter New Password</label>
							<input
								type="text"
								className={`w-full p-2 rounded-lg text-lg md:text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}
								placeholder='New Password'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<div className='flex justify-center'>
							<button className={`text-xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3 ${(oldPassword && newPassword) ? '' : 'hidden'}`} onClick={handlePasswordUpdate}>
								Update
							</button>
						</div>
					</div>


				</AccountPageMenuItem>

				<AccountPageMenuItem title={'Delete Account'} showButton={password || deleteButton} bgRed={true}>
					<div className='my-5 flex flex-col gap-5'>
						{
							!deleteButton && (
								<div className='text-xl'>
									Verify your password to delete your account
								</div>
							)
						}
						
						{
							!deleteButton && (
								<div className='flex flex-col gap-1'>
									{/* <label className='text-sm md:text-base' htmlFor="">Enter Password</label> */}
									<input
										type="text"
										className={`w-full p-2 rounded-lg text-lg md:text-xl focus:shadow-md focus:shadow-red-800 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`}
										placeholder='Password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							)
						}

						{
							deleteButton && (
								<div className='text-xl flex flex-col gap-1'>
									Are you sure you wat to delete your account? This action cannot be undone.
								</div>
							)
						}

						{
							!deleteButton && (
								<div className='flex justify-center'>
									<button className={`text-xl border-2 border-red-700 transition-colors duration-100 hover:bg-red-600 pb-2 pt-1 px-5 ${password ? '' : 'hidden'}`} onClick={handleVerifyPassword}>
										Verify
									</button>
								</div>
							)
						}

						<div className='flex justify-center'>
							<button className={`text-xl border-2 border-red-700 transition-colors duration-100 hover:bg-red-600 pb-2 pt-1 px-3 ${deleteButton ? '' : 'hidden'}`} onClick={handleDeleteAccount}>
								Delete
							</button>
						</div>
					</div>
				</AccountPageMenuItem>

			</div>
		</div>
	)
}

export default AccountPage