import React from 'react'
import { FontSize } from './font-size.enum'

export function Image(avatar: string, username: string, fontSize: FontSize) {
    return <div
        style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontWeight: 400,
            fontSize
        }}
    >
        <div style={{ display: 'flex', width: '25%', height: '25%' }}>
            <img src={avatar} alt="avatar" style={{ borderRadius: '50%' }}/>
        </div>
        <div style={{ marginTop: '18vw' }}>{username}</div>
    </div>
}
