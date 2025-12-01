import React, {useEffect, useState} from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

export default function ManageProperties() {
  const [props, setProps] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://127.0.0.1:8000/api/my/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProps(res.data);
    };
    fetch();
  }, [token]);

  const handleFavourite = (id) => { /* ignore for manage */ };

  const handleManage = (id) => {
    navigate(`/properties/edit/${id}`); // or open manage UI
  };

  return (
    <div>
      <h2>My Properties</h2>
      <div className="grid">
        {props.length ? props.map(p => (
          <PropertyCard key={p.id} p={p} user={user} onFavorite={handleFavourite} onManage={handleManage}/>
        )) : <p>No properties found.</p>}
      </div>
    </div>
  );
}
