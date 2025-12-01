import React, {useEffect, useState} from "react";
import axios from "axios";
export default function Favorites(){
  const token = localStorage.getItem("token");
  const [items,setItems] = useState([]);
  useEffect(()=> {
    axios.get("http://127.0.0.1:8000/api/favorites", { headers: { Authorization: `Bearer ${token}` }})
      .then(r=> setItems(r.data) )
      .catch(()=> {});
  },[]);
  return (<div>{items.map(f => <div key={f.id}>{f.property.title}</div>)}</div>);
}
