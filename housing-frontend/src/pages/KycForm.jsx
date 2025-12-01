import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function KycForm() {
    const [form, setForm] = useState({
        government_id: '', id_type: '', phone: '',
        address: '', emergency_contact_name: '', emergency_contact_phone: '',
        invitation_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    useEffect(() => {
 // if page opened after accepting invitation you might pass invitation_id via query string
        const qs = new URLSearchParams(window.location.search);
        const inv = qs.get('invitation');
        if (inv) setForm(f => ({ ...f, invitation_id: inv }));
    }, []);
    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); const token = localStorage.getItem('token'); const res
                = await axios.post('/api/kyc', form, {
                    headers: {
                        Authorization: `Bearer ${token}
 ` }
                }); setMsg('KYC submitted — welcome!'); window.location.href = '/';
        }
        catch (e) { alert('Error submitting KYC'); }
        finally { setLoading(false); }
    }
    return (
        <div style={{ padding: 20 }}>
            <h2>KYC Form</h2>
            <form onSubmit={submit} style={{ maxWidth: 600 }}>
                <label>Govt ID</label>
                <input value={form.government_id}
                    onChange={e => setForm({ ...form, government_id: e.target.value })} required />
                <label>ID Type</label>
                <input value={form.id_type}
                    onChange={e => setForm({ ...form, id_type: e.target.value })} required />
                <label>Phone</label>
                <input value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <label>Address</label>
                <input value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })} />
                <label>Emergency Contact Name</label>
                <input value={form.emergency_contact_name}
                    onChange={e => setForm({ ...form, emergency_contact_name: e.target.value })} />
                <label>Emergency Contact Phone</label>
                <input value={form.emergency_contact_phone}
                    onChange={e => setForm({ ...form, emergency_contact_phone: e.target.value })} />
                <input type="hidden" value={form.invitation_id} />
                <div style={{ marginTop: 12 }}>
                    <button type="submit" disabled={loading}>{loading ? 'Saving…' :
                        'Submit KYC'}</button>
                </div>
            </form>
            {msg && <div style={{ marginTop: 10, color: 'green' }}>{msg}</div>}
        </div>
    )
}