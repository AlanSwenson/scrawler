import electron from 'electron';
import React, { useState, useEffect, FC } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import localFont from '@next/font/local'

const championship = localFont({
  src: './Championship.ttf',
  weight: "400",
  variable: '--font-championship',
})

const ipcRenderer = electron.ipcRenderer;

const Home: FC = () => {
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<JSX.Element>();
  const [crawling, setCrawling] = useState(false);
  const [searching, setSearching] = useState(false);

  const crawl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setCrawling(true);
    ipcRenderer.send('start-crawl', url.toLowerCase())
  };
  const handleSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setSearching(true);
    ipcRenderer.send('start-search', search);
  };

  const createMessage = (data: any) => {
    return (
      <div>
        <div className='text-lg text-orange-500 border-b-2 border-dashed border-orange-600'>{data.search } crawl found {data.urls?.length || 0} new Urls</div>
        {data.urls?.map((url: { url: string }, i: number) => {
          return (
            <div key={i}>
              <div>{url.url}</div>
            </div>
          )
        })}
      </div>
    )
  }


  useEffect(() => {
    // register `ping-pong` event
    ipcRenderer.on('start-crawl', (event, data) => {
      const newMessage = createMessage(data);
      setMessage(newMessage);
      setCrawling(false);
      console.log("start-crawl: ");
    });

    return () => {
      // unregister it
      console.log("unregistering start-crawl");
      ipcRenderer.removeAllListeners('start-crawl');
    };
  }, []);


  return (
    <React.Fragment>
      <Head>
        <title>Scrawler by Alan</title>
      </Head>
      <div className={`${championship.variable} w-full flex flex-col justify-start h-screen bg-slate-950`}>
        <div className='w-full text-8xl flex justify-center text-orange-400 pt-20 pb-12 font-championship uppercase align-baseline'>
        Scrawler
        </div>
        <div className='w-auto mx-auto'>
        <div className='flex flex-col justify-center items-center w-full '>
          <form className='flex w-full'>
            <input className='border rounded px-2 py-1 mr-4 text-slate-500 ' type='text' placeholder='Enter URL' value={url} onChange={e => setUrl(e.target.value)} />
            <button className='border rounded px-4 py-1 text-white bg-green-700' onClick={(event) => crawl(event) }>Crawl</button>
          </form>
          <form className='flex pt-2 w-full'>
            <input className='border rounded px-2 py-1 mr-4 text-slate-500 ' type='text' placeholder='Product Search' value={search} onChange={e => setSearch(e.target.value)} />
            <button className='border rounded px-4 py-1 text-white bg-green-700' onClick={(event) => handleSearch(event)}>Search Amazon</button>
          </form>
          <div className='text-white text-center mt-4'>
            {crawling ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : message}
            </div>
        </div>   
        </div>
   
      </div>
    </React.Fragment>
  );
}

export default Home;
