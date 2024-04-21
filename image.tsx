import React from 'react'

export function Image(avatar: string, username: string) {
    return <div
        style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            fontSize: 64,
            fontWeight: 400,
        }}
    >
        <img src={avatar} alt="avatar" style={{ margin: '0 75px', width: 256, height: 256, borderRadius: '50%' }} />
        <div style={{ marginTop: 64 }}>{ username }</div>
    </div>
}
