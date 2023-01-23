import Head from 'next/head'
import styles from '../styles/Home.module.css'
import MessageBox from '../components/MessageBox'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sarcastic Clever AI</title>
        <meta name="description" content="A sarcastic clever AI by Ahamed, with OpenAI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz,wght@8..144,200&display=swap" rel="stylesheet" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          <h2>Sarcastic clever AI</h2>
          <p className={styles.credit}>by <a target='_blank' href='https://ahamedr.vercel.app/' rel="noreferrer">Ahamed</a></p>
          <small> OpenAI | NextJs</small>
        </div>
        <MessageBox/>
      </main>
    </>
  )
}
