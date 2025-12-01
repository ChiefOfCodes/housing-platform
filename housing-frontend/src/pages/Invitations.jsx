import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Invitations() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => { fetchInvs(); }, []);
    const fetchInvs = async () => {
        try {
            setLoading(true); setError('');
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/invitations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setItems(res.data.invitations || []);
        } catch (e) { setError('Unable to load invitations'); }
        finally { setLoading(false); }
    }
    const accept = async (id) => {
        try {
            const token = localStorage.getItem('token'); await axios.post(`/api/
 invitations/${id}/accept`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchInvs(); alert('Invitation accepted — please complete KYC');
            window.location.href = '/kyc';
        } catch (e) { alert('Error accepting'); }
    }
    const decline = async (id) => {
        try {
            const token = localStorage.getItem('token'); await axios.post(`/api/
 invitations/${id}/decline`, {}, {
                headers: {
                    Authorization: `Bearer ${token}
 ` }
            }); fetchInvs();
        } catch (e) { alert('Error declining'); }
    }
    return (
        <div className="p-6">
            <h2>Invitations</h2>
            {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}
            >{error}</div> : (
                <div>
                    {items.length === 0 && <div>No invitations</div>}
                    {items.map(inv => (
                        <div key={inv.id} style={{
                            border: '1px solid #eee', padding:
                                12, marginBottom: 8
                        }}>
                            <div><strong>{inv.unit?.unit_number || 'Unit'}</strong> —
                                {inv.unit?.property_name || inv.unit?.title || 'Property'}</div>
                            <div>From: {inv.inviter?.name}</div>
                            <div>Status: {inv.status}</div>
                            {inv.status === 'pending' && (
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={() => accept(inv.id)} style={{ marginRight: 8 }}
                                    >Accept</button>
                                    <button onClick={() => decline(inv.id)}>Decline</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
