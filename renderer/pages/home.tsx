import electron from 'electron';
import React, { useEffect} from 'react';
import Head from 'next/head';
const ipcRenderer = electron.ipcRenderer;




function Home() {
  const [url, setUrl] = React.useState('');
  const [message, setMessage] = React.useState('no message');
  const crawl = () => {
    ipcRenderer.send('start-crawl', url );
  };
  useEffect(() => {
    // like componentDidMount()

    // register `ping-pong` event
    ipcRenderer.on('start-crawl', (event, data) => {
      setMessage(data);
    });

    return () => {
      // like componentWillUnmount()

      // unregister it
      ipcRenderer.removeAllListeners('start-crawl');
    };
  }, []);



  
  return (
    <React.Fragment>
      <Head>
        <title>Scrawler by Alan</title>
      </Head>
      <div className=' w-full flex justify-center h-screen bg-gray-900'>
        <div className='flex flex-col justify-center items-center'>
          <form >
            <input className='border rounded px-2 py-1 mx-2 text-slate-500 ' type='text' placeholder='Enter URL' value={url} onChange={e => setUrl(e.target.value)} />
            <button className='border rounded px-4 py-1 text-white bg-green-700' onClick={crawl}>Crawl</button>
          </form>
          <div className='text-white text-center mt-4'>
            {message}
            </div>
        </div>      
      </div>
    </React.Fragment>
  );
}

export default Home;
