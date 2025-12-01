import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function TenantDashboard() {
    const [user, setUser] = useState(null);
    const [kyc, setKyc] = useState(null);
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token'); try {
                const res = await axios.get('/api/profile', {
                    headers: {
                        Authorization: `Bearer $
 {token}` }
                }); setUser(res.data);
                const k = await axios.get('/api/kyc', {
                    headers: {
                        Authorization: `Bearer $
 {token}` }
                }); setKyc(k.data.kyc);
            } catch (e) { console.error(e); }
        })();
    }, []);
    return (
        <div style={{ padding: 20 }}>
            <h1>Tenant Dashboard</h1>
            <div>User: {user?.name}</div>
            <div>Status: {user?.status}</div>
            <h3>KYC</h3>
            {kyc ? (
                <div>
                    <div>ID: {kyc.government_id} ({kyc.id_type})</div>
                    <div>Phone: {kyc.phone}</div>
                </div>
            ) : <div>No KYC yet</div>}
        </div>
    )
}