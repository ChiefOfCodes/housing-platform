import React from "react";

export default function PropertyCard({ p, user, onFavorite, onManage }) {
  // user = JSON.parse(localStorage.getItem('user')) passed from parent
  const isAdmin = user?.role === "admin";
  const isOwner = user?.id === p.owner_id;
  const isManager = user?.id === p.managed_by;
  const canEdit = isAdmin || isOwner || isManager;
  const canAdd = ["agent","owner","manager"].includes(user?.role);

  return (
    <div className="card">
      <div className="card-media">
        {p.images?.[0] ? (
          <img src={`http://127.0.0.1:8000/storage/${p.images[0].image_path}`} alt={p.title} />
        ) : <div className="no-image">No image</div>}
      </div>

      <div className="card-body">
        <h3>{p.title}</h3>
        <p className="location">📍 {p.city}, {p.state}</p>
        <div className="meta">
          <span>₦{Number(p.price).toLocaleString()}</span>
          <span className={`badge ${p.status}`}>{p.status}</span>
        </div>

        <div className="actions">
          <button onClick={() => onFavorite(p.id)} title="Favourite">♡ Favourite</button>
          <a href={`/properties/${p.id}`}>Details</a>

          {canEdit && (
            <>
              <button onClick={() => onManage(p.id)}>Manage</button>
            </>
          )}

          {isAdmin && (
            <>
              <button className="danger" onClick={() => {/* delete flow */}}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
