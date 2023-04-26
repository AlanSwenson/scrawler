import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
const ipcRenderer = electron.ipcRenderer;
import { crawl } from '../../main/lib/crawler';



function Home() {
  const [url, setUrl] = React.useState('');
  console.log(url);


  const onClickWithIpcSync = () => {
    const message = ipcRenderer.sendSync('ping-pong-sync', url );
  };

  
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className=' w-full flex justify-center h-screen bg-gray-900'>
        
        <div className='flex flex-col justify-center items-center'>
          <form >
            <input className='border rounded px-2 py-1 mx-2 text-slate-500 ' type='text' placeholder='Enter URL' value={url} onChange={e => setUrl(e.target.value)} />
            <button className='border rounded px-4 py-1 text-white bg-green-700' onClick={onClickWithIpcSync}>Crawl</button>
            </form>
        </div>
        

      
      </div>
    </React.Fragment>
  );
}

export default Home;
