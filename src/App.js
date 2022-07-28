import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

const clientId = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
   
   const [loading, setLoading] = useState(false);
   const [photos, setPhotos] = useState([]);
   const [page, setPage] = useState(1);
   const [query, setQuery] = useState('');

   const fetchImages = async() =>{
     let url;
     const urlPage = `&page=${page}`;
     const urlQuery = `&query=${query}`;
     try {
       setLoading(true);
       if(query){
          url = `${searchUrl}${clientId}${urlPage}${urlQuery}`;
        
       }
       else{
          url = `${mainUrl}${clientId}${urlPage}`;
        
       }
       const response = await fetch(url);
       const data = await response.json();
       console.log(data);
       setPhotos((photo)=>{
         if(query && page === 1){
           return [...data.results];
         }
         if(query){
           return [...photo, ...data.results];
         }
         else {
          return [...photo, ...data];
         }
       });
       setLoading(false);
     } catch (error) {
       console.log(error)
       setLoading(false);
     }

   }

   useEffect(() => {
     fetchImages();
     // eslint-disable-next-line
   }, [page])

   useEffect(() => {
     const event = window.addEventListener('scroll', ()=>{
       if((window.innerHeight + window.scrollY)>= document.body.scrollHeight - 2){
         setPage((oldPage)=>{
           return oldPage + 1;
         })
       }
     })
     return () => {
       window.removeEventListener('scroll', event);
     }
   }, [])

   const handleSubmit = (e) =>{
     e.preventDefault();
     if(!query) return
     if(page === 1){
      fetchImages();
     }
     setPage(1);
     
   }
 
  return <main>
    <section className='search'>
         <form className='search-form'>
           <input type="text" placeholder="Search" className='form-input' value={query} onChange={(e)=>setQuery(e.target.value)}/>
           <button type="submit" className='submit-btn' onClick={handleSubmit}><FaSearch /></button>
         </form>
         </section>
         <section className="photos">
           <div className='photos-center'>
             {photos.map((image, index)=>{
               return <Photo key={index} {...image}/>
             })}
           </div>
           {loading && <h2 className='loading'>Loading...</h2>}
           
         </section>
  </main>
}

export default App
