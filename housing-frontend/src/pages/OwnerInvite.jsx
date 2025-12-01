import React, { useState } from 'react';
import axios from 'axios';
export default function OwnerInvite({ unitId }) {
    const [identifier, setIdentifier] = useState('');
    const [note, setNote] = useState('');
    const invite = async () => {
        try {
            const token = localStorage.getItem('token'); const res = await
                axios.post(`/api/units/${unitId}/invite`, { identifier, note }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }); alert('Invitation sent');
        }
        catch (e) { alert('Error inviting user'); }
    }
    return (
        <div style={{ padding: 12 }}>
            <input placeholder="username or email or user id" value={identifier}
                onChange={e => setIdentifier(e.target.value)} />
            <textarea placeholder="note (optional)" value={note}
                onChange={e => setNote(e.target.value)} />
            <button onClick={invite}>Send Invite</button>
        </div>
    )
}