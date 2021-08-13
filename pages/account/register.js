import { FaUser } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import styles from '@/styles/AuthForm.module.css'
import AuthContext from "@/context/AuthContext";

export default function Registerpage() {
    const [email, setEmail] =useState('')
    const [username, setUserName] =useState('')
    const [passwordConfirm, setPasswordConfirm] =useState('')

    const [password, setPassword] =useState('')

    const {register, error} = useContext(AuthContext)

    useEffect(() => {
        error && toast.error(error)
    })


    const handleSubmit = (e) => {
        e.preventDefault()

        if(password != passwordConfirm) {
            toast.error('Password do not match')
            return
        }

        register({username, email, password})
    }

    return (
        <Layout title='User Registration'>
            <div className={styles.auth}>
                <h1><FaUser /> Register</h1>
            
            <ToastContainer />
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='userName'>User name: </label>
                <input
                type='text'
                it='userName'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='email'>Email Adress: </label>
                <input
                type='email'
                it='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='password'>Password: </label>
                <input
                type='password'
                it='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='passwordConfirm'>Confirm password: </label>
                <input
                type='password'
                it='passwordConfirm'
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                />
            </div>
            <input type='submit' value='Register' className='btn' />
            </form>
            <p>
                Already have an account? <Link href='/account/login'>Login</Link>
            </p>
            </div>
        </Layout>
    )
}
