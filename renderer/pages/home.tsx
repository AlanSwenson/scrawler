import electron from 'electron';
import React, { useState, useEffect, FC } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpider, faSpinner } from '@fortawesome/free-solid-svg-icons';

import localFont from '@next/font/local'
import { Russo_One } from '@next/font/google'
import Button from '../components/button';

const championship = localFont({
  src: './Championship.ttf',
  weight: "400",
  variable: '--font-championship',
})

const russoOne = Russo_One({
  subsets: ['latin'],
  weight: "400",
  variable: '--font-russo-one',
})

const ipcRenderer = electron.ipcRenderer;

enum searchType {
  crawl,
  search
}

const Home: FC = () => {
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<JSX.Element>();
  const [searching, setSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<searchType>(searchType.crawl);

  const textFieldClass = 'focus:outline-none focus:border-purple-300 border border-mixed-500 rounded-3xl px-4 py-1 mr-4 placeholder:text-mixed-500 text-white bg-dark-200';
  const radioClass = 'hover:bg-purple-300 ease-in transition-all hover:border-purple-300 hover:text-dark-100 py-3 mx-1 rounded-full '
  const selected = 'text-dark-100 bg-primary-200 border-2 border-primary-200 ' + radioClass;
  const unselected = 'text-primary-100 border-2 border-primary-100 ' + radioClass;

  const handleSearch = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setSearching(true);
    if (selectedType == searchType.crawl) {
      ipcRenderer.send('start-crawl', url.toLowerCase())
    } else if (selectedType == searchType.search) {
      ipcRenderer.send('start-search', search);
    }
  };

  useEffect(() => {
    // register `ping-pong` event
    ipcRenderer.on('start-search', (event, data) => {
      setSearch('');
      setSearching(false);
      console.log("start-search: ");
    });

    return () => {
      // unregister it
      console.log("unregistering start-search");
      ipcRenderer.removeAllListeners('start-search');
    };
  }, []);

  const createMessage = (data: any) => {
    return (
      <div>
        <div className='mb-4 text-lg text-primary-300 border-b-2 border-dashed border-primary-100'><span className='text-2xl font-bold'>{data.search }</span> crawl found {data.urls?.length || 0} new Urls</div>
        {data.urls?.map((url: { url: string }, i: number) => {
          return (
            <div key={i}>
              <div className='text-purple-300'>{url.url}</div>
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
      setSearching(false);
      setUrl('');
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
      <div className={`${championship.variable} ${russoOne.variable} w-full flex flex-col justify-start h-screen bg-dark-100`}>
        <div className='w-full text-8xl flex justify-center text-primary-200 pt-20 pb-12 font-championship uppercase align-baseline'>
        Scrawler
        </div>
        <div className='w-auto mx-auto'>
          <div className='text-primary-200 flex justify-center w-full mb-6'>
            <div className={`${selectedType == searchType.crawl ? selected : unselected}`} onClick={e => setSelectedType(searchType.crawl)}>
            <FontAwesomeIcon icon={faSpider} className={`px-4`} />
            </div>
            <div className={`${selectedType == searchType.search ? selected : unselected}`} onClick={e => setSelectedType(searchType.search)}>
            <FontAwesomeIcon icon={faSearch} className={`px-4`} />
            </div>

          </div>
        <div className='flex flex-col justify-center items-center w-full '>
          <form className='flex w-full'>
              <input className={`${textFieldClass}`} type='text' placeholder={(selectedType == searchType.crawl) ? 'Enter Url' : 'Enter Product'} value={url} onChange={e => setUrl(e.target.value)} />
              <div onClick={(event) => handleSearch(event)} className='flex'>
              <Button label={(selectedType == searchType.crawl) ? 'Crawl' : 'Search'}  />
              </div>
          </form>

          <div className='text-white text-center my-8'>
            {searching ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : message}
            </div>
        </div>   
        </div>
   
      </div>
    </React.Fragment>
  );
}

export default Home;
